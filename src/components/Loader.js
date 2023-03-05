import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

export default function Loader({ loading = false }) {
  return (
    <Backdrop style={{ zIndex: 9999, color: "#ffffff" }} open={loading}>
      <CircularProgress style={{ color: "#2c6fed" }} />
    </Backdrop>
  );
}
