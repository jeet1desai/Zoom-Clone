import * as React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";

const Header = () => {
  return (
    <AppBar position="static" className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography className="app-heading">Zoom - Clone</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
