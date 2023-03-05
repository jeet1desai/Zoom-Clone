import { useState } from "react";
import { Box, Button, Divider, TextField } from "@mui/material";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import Loader from "../components/Loader";

const JoinCall = ({ onJoin = () => {} }) => {
  let [name, setName] = useState("");
  let [loading, setLoading] = useState(false);

  return (
    <>
      <Loader loading={loading} />

      <Box className="join-call">
        <Box>
          <h1>Premium video meetings. Now free for everyone.</h1>
          <p>
            Bring teams together, reimagine workspaces, engage new audiences, and delight your customers — all on the
            call platform you know and love.
          </p>
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
              name: name,
              room: uuidv4(),
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
              Create Meeting
            </Button>
          </Box>
        </Form>
        <Divider />
      </Box>
    </>
  );
};

export default JoinCall;
