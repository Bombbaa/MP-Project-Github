import React from "react";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AlertComponentProps {
  onClose: () => void;
}

function AlertComponent({ onClose }: AlertComponentProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      <Alert
        severity="success"
        style={{
          fontSize: "18px",
          padding: "20px",
          borderRadius: "10px",
          border: "2px solid green",
        }}
      >
        บันทึกข้อมูลเรียบร้อย
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Alert>
    </div>
  );
}

export default AlertComponent;
