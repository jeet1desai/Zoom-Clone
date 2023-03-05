import { useState } from "react";
import { Box, Button, Divider, TextField } from "@mui/material";
import { Form } from "react-bootstrap";
import Loader from "../components/Loader";

const InviteCall = ({ roomName, groupName, onJoin = () => {} }) => {
  let [name, setName] = useState("");
  let [loading, setLoading] = useState(false);

  return (
    <>
      <Loader loading={loading} />

      <Box className="join-call">
        <Box>
          <h1>Your Invited to {groupName}'s group.</h1>
          <p>Please join and make team great.</p>
        </Box>
        <Form
          onSubmit={(e) => {
            setLoading(true);
            e.preventDefault();
            if (name === "") {
              setLoading(true);
              return;
            }
            const meeting = {
              name: groupName,
              room: roomName,
            };
            onJoin(meeting);
            setLoading(true);
          }}
        >
          <Box className="form-join-call">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={name.length === 0}
            />
            <Button variant="contained" color="success" fullWidth type="submit">
              Join Meeting
            </Button>
          </Box>
        </Form>
        <Divider />
      </Box>
    </>
  );
};

export default InviteCall;
