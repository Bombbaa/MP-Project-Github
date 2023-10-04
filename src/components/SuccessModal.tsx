import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Success
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          The form was submitted successfully.
        </Typography>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
