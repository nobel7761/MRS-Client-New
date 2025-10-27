"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { directApi } from "@/lib/directApi";
import {
  SilverJubileeParticipant,
  SilverJubileeParticipantCategory,
} from "@/types/silverJubilee";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  participant: SilverJubileeParticipant | null;
  onSuccess: () => void;
}

const DeleteDialog = ({
  open,
  onClose,
  participant,
  onSuccess,
}: DeleteDialogProps) => {
  const [confirmName, setConfirmName] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the correct name based on participant category
  const getParticipantName = (participant: SilverJubileeParticipant) => {
    switch (participant.participantCategory) {
      case SilverJubileeParticipantCategory.BABY:
        return participant.babyName || participant.fullName;
      case SilverJubileeParticipantCategory.GUEST:
        return participant.guestName || participant.fullName;
      default:
        return participant.fullName;
    }
  };

  const participantName = participant ? getParticipantName(participant) : "";
  const isDeleteEnabled = participant && confirmName === participantName;

  const handleDeleteConfirm = async () => {
    if (!participant) return;

    setLoading(true);
    try {
      await directApi.delete(`/silver-jubilee/${participant._id}`);
      toast.success("Participant deleted successfully");
      onClose();
      setConfirmName("");
      onSuccess();
    } catch (error) {
      console.error("Error deleting participant:", error);
      toast.error("Failed to delete participant");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setConfirmName("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-red-600">
        Delete Silver Jubilee Participant
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <p className="text-gray-700">
            Are you sure you want to delete this participant?
          </p>
          {participant && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">{participantName}</p>
              <p className="text-sm text-gray-600">{participant.email}</p>
              <p className="text-sm text-gray-600">
                Category: {participant.participantCategory}
              </p>
            </div>
          )}
          <p className="text-sm text-red-600 font-medium">
            To confirm deletion, please type the participant's name:{" "}
            <span className="font-bold">{participantName}</span>
          </p>
          <TextField
            label="Type name to confirm"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            fullWidth
            placeholder={participantName}
            autoFocus
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          variant="contained"
          color="error"
          disabled={!isDeleteEnabled || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Deleting..." : "Delete Participant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
