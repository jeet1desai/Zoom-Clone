import React from "react";
import Button from "react-bootstrap/Button";
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";
import { Box } from "@mui/material";

export default function Participants({ memberList, onMemberUpdate = () => {}, mod = false }) {
  if (!mod)
    return (
      <>
        {memberList.map((member) => (
          <Box className="member-box">
            <Box className="member-left-side" key={member.id}>
              {member.name + " "}
            </Box>
          </Box>
        ))}
      </>
    );

  return (
    <Box>
      {memberList.map((member) => {
        return (
          <Box key={member.id} className="member-box">
            <Box className="member-left-side">{member.name + " "}</Box>
            <Box className="member-right-side">
              <Button
                className={!member.audio_muted ? "success" : "danger"}
                onClick={() => {
                  member.audio_muted
                    ? onMemberUpdate({
                        action: "unmute_audio",
                        id: member.id,
                      })
                    : onMemberUpdate({
                        action: "mute_audio",
                        id: member.id,
                      });
                }}
              >
                {member.audio_muted ? <MdMicOff /> : <MdMic />}
              </Button>
              <Button
                className={!member.video_muted ? "success" : "danger"}
                onClick={() => {
                  member.video_muted
                    ? onMemberUpdate({
                        action: "unmute_video",
                        id: member.id,
                      })
                    : onMemberUpdate({
                        action: "mute_video",
                        id: member.id,
                      });
                }}
              >
                {member.video_muted ? <MdVideocamOff /> : <MdVideocam />}
              </Button>
              <Button
                className="danger"
                onClick={() => {
                  onMemberUpdate({ action: "remove", id: member.id });
                }}
              >
                <MdCallEnd />
              </Button>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
