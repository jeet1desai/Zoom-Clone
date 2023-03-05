import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import * as SignalWire from "@signalwire/js";
import { getLayouts, getCameras, getMicrophones, getSpeakers } from "../utils/utils";
import server from "../server";

const Video = ({ onRoomInit, onRoomUpdate, joinDetails, onMemberListUpdate }) => {
  let [isLoading, setIsLoading] = useState(true);

  let [setupDone, setSetupDone] = useState(false);
  let thisMemberId = useRef(null);
  let memberList = useRef([]);

  const setup_room = async () => {
    setSetupDone(true);
    let token, room;

    try {
      token = await axios.post(server + "/get_token", {
        user_name: joinDetails.name,
        room_name: joinDetails.room,
        mod: joinDetails.mod,
      });
      token = token.data.token;

      try {
        try {
          room = await SignalWire.Video.createRoomObject({
            token,
            rootElementId: "video",
            video: true,
          });
        } catch (e) {
          console.log(e);
        }

        room.on("room.joined", async (e) => {
          thisMemberId.current = e.member_id;
          memberList.current = [...e.room.members];
          let thisMember = memberList.current.filter((m) => m.id === e.member_id);
          if (thisMember.length >= 1) thisMember = thisMember[0];
          onRoomUpdate({ thisMemberId: e.member_id, member: thisMember });
        });
        room.on("room.updated", async (e) => {
          await updateMemberList(room);
        });
        room.on("member.joined", async (e) => {
          await updateMemberList(room);
        });
        room.on("member.updated", async (e) => {
          await updateMemberList(room);
        });
        room.on("layout.changed", async (e) => {
          onRoomUpdate({ layout: e.layout.name });
        });
        room.on("member.left", async (e) => {
          let member = memberList.current.filter((m) => m.id === e.member.id);
          if (member.length === 0) {
            onRoomUpdate({ left: true });
            return;
          }
          if (thisMemberId.current === member[0]?.id) {
            onRoomUpdate({ left: true });
          }
          await updateMemberList(room);
        });

        await room.join();

        let layout = await getLayouts(room);
        let cameras = await getCameras();
        let microphones = await getMicrophones();
        let speakers = await getSpeakers();

        await updateMemberList(room);

        setIsLoading(false);
        onRoomInit(room, layout, cameras, microphones, speakers);

        let camChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
          targets: ["camera"],
        });
        camChangeWatcher.on("changed", (changes) => {
          onRoomUpdate({ cameras: changes.devices });
        });
        let micChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
          targets: ["microphone"],
        });
        micChangeWatcher.on("changed", (changes) => {
          onRoomUpdate({ microphones: changes.devices });
        });
        let speakerChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
          targets: ["speaker"],
        });
        speakerChangeWatcher.on("changed", (changes) => {
          onRoomUpdate({ speakers: changes.devices });
        });
      } catch (error) {
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      alert("Error encountered. Please try again.");
    }
  };

  async function updateMemberList(room) {
    let m;
    try {
      m = await room.getMembers();
    } catch (e) {
      return;
    }
    let members = m.members;
    if (members === undefined) return;
    memberList.current = members;
    onMemberListUpdate(memberList.current);
  }

  useEffect(() => {
    if (setupDone) return;
    setup_room();
  }, [joinDetails, onMemberListUpdate, onRoomInit, onRoomUpdate, setupDone]);

  return (
    <>
      <Loader loading={isLoading} />
      <div id="video" className="video-canvas"></div>
    </>
  );
};

export default Video;
