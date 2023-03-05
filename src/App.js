import React, { useState } from "react";
import Header from "./components/Header";
import JoinCall from "./pages/JoinCall";
import InviteCall from "./pages/InviteCall";
import InCall from "./pages/InCall";
import { Switch, Route, useHistory, useLocation, Redirect } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Box } from "@mui/material";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  let history = useHistory();
  let query = useQuery();
  let [roomDetails, setRoomDetails] = useState({});

  return (
    <>
      <Box>
        <Toaster />
      </Box>

      <Switch>
        <Route path="/invite" exact>
          <InviteCall
            roomName={query.get("r")}
            groupName={query.get("g")}
            onJoin={({ room, name }) => {
              setRoomDetails({ name, room, mod: false });
              history.push(`/${room}`);
            }}
          />
        </Route>

        <Route path="/:meetingId">
          {roomDetails.name === undefined ? <Redirect to="/" /> : <InCall roomDetails={roomDetails} />}
        </Route>

        <Route path="/" exact>
          <Header />
          <JoinCall
            onJoin={({ room, name }) => {
              setRoomDetails({ name, room, mod: true });
              history.push(`/${room}`);
            }}
          />
        </Route>
      </Switch>
    </>
  );
};

export default App;
