"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { directApi } from "@/lib/directApi";
import { SilverJubileeParticipant } from "@/types/silverJubilee";
import { SilverJubileeParticipantCategory } from "@/types/silverJubilee";
import EditAlumniForm from "./EditAlumniForm";
import EditStudentForm from "./EditStudentForm";
import EditGuestForm from "./EditGuestForm";
import EditBabyForm from "./EditBabyForm";
import EditLifetimeMembershipForm from "./EditLifetimeMembershipForm";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  participant: SilverJubileeParticipant | null;
  onSuccess: () => void;
}

const EditDialog = ({
  open,
  onClose,
  participant,
  onSuccess,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<Partial<SilverJubileeParticipant>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (participant) {
      setFormData({
        participantCategory: participant.participantCategory,
        fullName: participant.fullName,
        phoneNumber: participant.phoneNumber,
        alternativePhoneNumber: participant.alternativePhoneNumber,
        email: participant.email,
        hscPassingYear: participant.hscPassingYear,
        group: participant.group,
        gender: participant.gender,
        bloodGroup: participant.bloodGroup,
        paymentType: participant.paymentType,
        amount: participant.amount,
        comments: participant.comments,
        fatherName: participant.fatherName,
        fatherPhoneNumber: participant.fatherPhoneNumber,
        fatherOccupation: participant.fatherOccupation,
        motherName: participant.motherName,
        motherPhoneNumber: participant.motherPhoneNumber,
        motherOccupation: participant.motherOccupation,
        mainParticipantBatch: participant.mainParticipantBatch,
        mainParticipantGroup: participant.mainParticipantGroup,
        mainParticipantId: participant.mainParticipantId,
        mainParticipantName: participant.mainParticipantName,
        guestName: participant.guestName,
        relation: participant.relation,
        guestMobileNumber: participant.guestMobileNumber,
        babyName: participant.babyName,
        babyPhone: participant.babyPhone,
      });
    }
  }, [participant]);

  const handleSubmit = async () => {
    if (!participant) return;

    setLoading(true);
    try {
      await directApi.patch(`/silver-jubilee/${participant._id}`, formData);
      toast.success("Participant updated successfully");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error updating participant:", error);
      toast.error("Failed to update participant");
    } finally {
      setLoading(false);
    }
  };

  const renderFormComponent = () => {
    if (!formData.participantCategory) return null;

    switch (formData.participantCategory) {
      case SilverJubileeParticipantCategory.ALUMNI:
        return <EditAlumniForm formData={formData} setFormData={setFormData} />;
      case SilverJubileeParticipantCategory.STUDENT:
        return (
          <EditStudentForm formData={formData} setFormData={setFormData} />
        );
      case SilverJubileeParticipantCategory.GUEST:
        return <EditGuestForm formData={formData} setFormData={setFormData} />;
      case SilverJubileeParticipantCategory.BABY:
        return <EditBabyForm formData={formData} setFormData={setFormData} />;
      case SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP:
        return (
          <EditLifetimeMembershipForm
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Silver Jubilee Participant</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          {/* Participant Category */}
          <FormControl fullWidth>
            <InputLabel>Participant Category</InputLabel>
            <Select
              value={formData.participantCategory || ""}
              label="Participant Category"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  participantCategory: e.target
                    .value as SilverJubileeParticipantCategory,
                })
              }
            >
              <MenuItem value={SilverJubileeParticipantCategory.ALUMNI}>
                Alumni
              </MenuItem>
              <MenuItem value={SilverJubileeParticipantCategory.STUDENT}>
                Student
              </MenuItem>
              <MenuItem value={SilverJubileeParticipantCategory.GUEST}>
                Guest
              </MenuItem>
              <MenuItem value={SilverJubileeParticipantCategory.BABY}>
                Baby
              </MenuItem>
              <MenuItem
                value={SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP}
              >
                Lifetime Membership
              </MenuItem>
            </Select>
          </FormControl>

          {/* Render appropriate form component based on category */}
          {renderFormComponent()}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Updating..." : "Update Participant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
