// LogoutModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export default function LogoutModal({ open, onClose, onConfirm, title = "Xác nhận đăng xuất", message = "Bạn chắc chắn muốn đăng xuất?" }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy bỏ
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Đăng xuất
        </Button>
      </DialogActions>
    </Dialog>
  );
}
