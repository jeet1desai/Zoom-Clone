import { Box } from "@mui/system";
import IconButton from "../components/IconButton";
import Video from "../components/Video";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import CloseIcon from "@mui/icons-material/Close";
import {
  Divider,
  SwipeableDrawer,
  IconButton as Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  DialogActions,
  Button,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Participants from "../components/Participant";

const InCall = ({ roomDetails }) => {
  const { meetingId } = useParams();
  let history = useHistory();

  const link =
    window.location.protocol + "//" + window.location.host + "/invite?r=" + roomDetails.room + "&g=" + roomDetails.name;

  const [isDrawerOpen, setDrawer] = useState({ isOpen: false, isInfo: true });
  const [isLayoutDialogOpen, setLayoutDialog] = useState(false);

  let [room, setRoom] = useState({});

  let [audioMuted, setAudioMuted] = useState(false);
  let [videoMuted, setVideoMuted] = useState(false);
  let [speakerMuted, setSpeakerMuted] = useState(false);

  let [memberList, setMemberList] = useState([]);

  let [layouts, setLayouts] = useState([]);
  let [curLayout, setCurLayout] = useState();

  let [, setUpdateSignal] = useState(true);
  const updateView = () => setUpdateSignal((x) => !x);

  let [thisMemberId, setThisMemberId] = useState(null);

  let [screenShareObj, setScreenShareObj] = useState(undefined);

  let [time, setTime] = useState("");

  let [cameras, setCameras] = useState([]);
  let [microphones, setMicrophones] = useState([]);
  let [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    const currentTime = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(currentTime);
  }, []);

  let onRoomInit = useCallback((room, layouts, cameras, microphones, speakers) => {
    setLayouts(layouts);
    setCameras(cameras);
    setMicrophones(microphones);
    setSpeakers(speakers);
    setRoom(room);
  }, []);

  let onRoomUpdate = useCallback(
    (updatedValues) => {
      if (updatedValues.cameras !== undefined) {
        setCameras(updatedValues.cameras);
      }
      if (updatedValues.speakers !== undefined) {
        setSpeakers(updatedValues.speakers);
      }
      if (updatedValues.microphones !== undefined) {
        setMicrophones(updatedValues.microphones);
      }
      if (updatedValues.left === true) {
        history.push("/");
      }
      if (updatedValues.thisMemberId !== undefined) {
        setThisMemberId(updatedValues.thisMemberId);
      }
      if (updatedValues.layout !== undefined) {
        setCurLayout(updatedValues.layout);
      }
      if (updatedValues.member !== undefined) {
        let mem = updatedValues.member;
        setAudioMuted(mem.audio_muted);
        setVideoMuted(mem.video_muted);
        setSpeakerMuted(mem.deaf);
      }
    },
    [history]
  );

  return (
    <>
      <Box>
        <Video
          onRoomInit={onRoomInit}
          onRoomUpdate={onRoomUpdate}
          joinDetails={roomDetails}
          onMemberListUpdate={useCallback((list) => {
            setMemberList(list);
          }, [])}
        />

        <Box className="menu-bottom-box">
          <Box className="menu-bottom-item">
            {time} | {meetingId}
          </Box>
          <Box className="menu-bottom-item">
            <IconButton
              isMuted={audioMuted}
              Icon={audioMuted ? MicOffIcon : MicIcon}
              onClick={async () => {
                if (audioMuted) {
                  await room.audioUnmute();
                  setAudioMuted(false);
                } else {
                  await room.audioMute();
                  setAudioMuted(true);
                }
              }}
            />
            <IconButton
              isMuted={speakerMuted}
              Icon={speakerMuted ? VolumeOffIcon : VolumeUpIcon}
              onClick={async () => {
                if (speakerMuted) {
                  await room.undeaf();
                  setSpeakerMuted(false);
                } else {
                  await room.deaf();
                  setSpeakerMuted(true);
                }
              }}
            />
            <IconButton
              isMuted={videoMuted}
              Icon={videoMuted ? VideocamOffIcon : VideocamIcon}
              onClick={async () => {
                if (videoMuted) {
                  await room.videoUnmute();
                  setVideoMuted(false);
                } else {
                  await room.videoMute();
                  setVideoMuted(true);
                }
              }}
            />
            <IconButton isMuted={false} Icon={MoreVertIcon} onClick={() => setLayoutDialog(true)} />
            <IconButton
              isShare
              onClick={async () => {
                if (screenShareObj === undefined) {
                  let sc = await room.createScreenShareObject();
                  setScreenShareObj(sc);
                } else {
                  screenShareObj.leave();
                  screenShareObj = undefined;
                  setScreenShareObj(undefined);
                }
              }}
            />
            <IconButton
              isCallEnd
              onClick={async () => {
                await room.leave();
                history.push("/");
              }}
            />
          </Box>
          <Box className="menu-bottom-item">
            <Icon onClick={() => setDrawer({ isOpen: true, isInfo: true })}>
              <IconButton isInfo Icon={InfoIcon} />
            </Icon>
            <Icon onClick={() => setDrawer({ isOpen: true, isInfo: false })}>
              <IconButton isInfo Icon={PeopleAltIcon} />
            </Icon>
          </Box>
        </Box>

        <SwipeableDrawer
          open={isDrawerOpen.isOpen}
          anchor={"right"}
          onClose={() => setDrawer({ isOpen: false, isInfo: false })}
          onOpen={() => setDrawer({ isOpen: true, isInfo: false })}
        >
          <Box className="sidebar">
            <Box className="close-menu">
              <CloseIcon onClick={() => setDrawer({ isOpen: false, isInfo: false })} />
              {isDrawerOpen.isInfo ? <h2>Meeting Details</h2> : <h2>People</h2>}
            </Box>
            <Divider />

            <Box className="sidebar-content-box">
              {isDrawerOpen.isInfo && (
                <>
                  <Box className="attendee-info">
                    <h3>Joining Info</h3>
                    <p>{link}</p>
                    <span
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast.success("Copied meeting link");
                      }}
                    >
                      Copy Link
                    </span>
                  </Box>
                </>
              )}

              {!isDrawerOpen.isInfo && (
                <Participants
                  memberList={memberList}
                  mod={roomDetails.mod}
                  onMemberUpdate={async (event) => {
                    if (event.action === "remove") {
                      await room.removeMember({ memberId: event.id });
                      if (event.id === thisMemberId) history.push("/");
                    } else if (event.action === "mute_video") {
                      await room.videoMute({ memberId: event.id });
                      if (event.id === thisMemberId) setVideoMuted(true);
                    } else if (event.action === "mute_audio") {
                      await room.audioMute({ memberId: event.id });
                      if (event.id === thisMemberId) setAudioMuted(true);
                    } else if (event.action === "unmute_audio") {
                      await room.audioUnmute({ memberId: event.id });
                      if (event.id === thisMemberId) setAudioMuted(false);
                    } else if (event.action === "unmute_video") {
                      await room.videoUnmute({ memberId: event.id });
                      if (event.id === thisMemberId) setVideoMuted(false);
                    }
                  }}
                />
              )}
            </Box>
          </Box>
        </SwipeableDrawer>
      </Box>

      <Dialog fullWidth open={isLayoutDialogOpen} onClose={() => setLayoutDialog(false)}>
        <DialogTitle>Layouts</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Layout</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={curLayout}
                label="Select Layout"
                onChange={async (e) => {
                  const value = e.target.value;
                  await room.setLayout({ name: value });
                  setCurLayout(value);
                }}
              >
                {layouts.map((i) => {
                  if (typeof i === "object")
                    return (
                      <MenuItem key={i.value} value={i.value}>
                        {i.name}
                      </MenuItem>
                    );
                  return (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLayoutDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InCall;
