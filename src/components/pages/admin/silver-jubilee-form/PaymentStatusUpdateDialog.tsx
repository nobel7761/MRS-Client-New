"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { directApi } from "@/lib/directApi";
import { SilverJubileeParticipant } from "@/types/silverJubilee";

interface PaymentStatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  participant: SilverJubileeParticipant | null;
  onSuccess: () => void;
}

const PaymentStatusUpdateDialog = ({
  open,
  onClose,
  participant,
  onSuccess,
}: PaymentStatusUpdateDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateConfirm = async () => {
    if (!participant || !participant._id) return;

    setLoading(true);
    try {
      await directApi.patch(
        `/silver-jubilee/${participant._id}/update-payment-status`,
        {
          status: "Paid",
        }
      );
      toast.success("Payment status updated to Paid successfully");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  const getParticipantName = (participant: SilverJubileeParticipant) => {
    if (participant.participantCategory === "Baby") {
      return participant.babyName || participant.fullName;
    }
    if (participant.participantCategory === "Guest") {
      return participant.guestName || participant.fullName;
    }
    return participant.fullName;
  };

  const participantName = participant ? getParticipantName(participant) : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-blue-600">Update Payment Status</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <p className="text-gray-700">
            Are you sure you want to update the payment status to "Paid" for
            this participant?
          </p>
          {participant && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">{participantName}</p>
              <p className="text-sm text-gray-600">
                {participant.email || "-"}
              </p>
              <p className="text-sm text-gray-600">
                Category: {participant.participantCategory}
              </p>
              <p className="text-sm text-gray-600">
                Current Status: <span className="font-semibold">Not Paid</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpdateConfirm}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Updating..." : "Update to Paid"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentStatusUpdateDialog;
