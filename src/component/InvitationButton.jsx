import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import SendInvitationForm from "../pages/invitations/invitationForm"

export default function InviteButton({ room_id }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Mời thành viên
      </Button>

      {/* Modal/Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Mời thành viên vào phòng</DialogTitle>
        <DialogContent>
          <SendInvitationForm roomId={room_id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
