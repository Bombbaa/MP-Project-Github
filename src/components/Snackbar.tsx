import React from "react";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Snackbar from "@mui/material/Snackbar";

// Function to create the Snackbar with a success alert
function createSuccessSnackbar(
  open,
  handleClose,
  message,
  autoHideDuration = 6000
) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize="inherit" />,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default createSuccessSnackbar;
