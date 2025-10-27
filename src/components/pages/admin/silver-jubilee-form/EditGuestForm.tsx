"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { SilverJubileeParticipant } from "@/types/silverJubilee";
import {
  SilverJubileeGroup,
  SilverJubileePaymentType,
} from "@/types/silverJubilee";
import { silverJubileeApi } from "@/lib/silverJubileeApi";

interface EditGuestFormProps {
  formData: Partial<SilverJubileeParticipant>;
  setFormData: (data: Partial<SilverJubileeParticipant>) => void;
}

const EditGuestForm = ({ formData, setFormData }: EditGuestFormProps) => {
  const [mainParticipantsList, setMainParticipantsList] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  // Generate batch years from 2003 to 2027
  const batchYears = Array.from({ length: 25 }, (_, i) => 2003 + i);

  // Fetch main participants when batch and group change
  useEffect(() => {
    const fetchMainParticipants = async () => {
      if (formData.mainParticipantBatch && formData.mainParticipantGroup) {
        setIsLoadingParticipants(true);
        try {
          const response =
            await silverJubileeApi.getParticipantsByBatchAndGroup(
              formData.mainParticipantBatch,
              formData.mainParticipantGroup
            );

          // Transform participants to dropdown format (same as original form)
          const transformedParticipants = response.participants.map(
            (participant) => ({
              id: participant._id || "",
              name: `${participant.fullName} - ${participant.group} - ${participant.hscPassingYear}`,
              phoneNumber: participant.phoneNumber,
            })
          );

          // If we have a current main participant name but it's not in the fetched list,
          // add it to the list so it shows up in the dropdown
          if (
            formData.mainParticipantName &&
            !transformedParticipants.find(
              (p) => p.name === formData.mainParticipantName
            )
          ) {
            transformedParticipants.unshift({
              id: formData.mainParticipantId || "current",
              name: formData.mainParticipantName,
              phoneNumber: "",
            });
          }

          setMainParticipantsList(transformedParticipants);
        } catch (error) {
          console.error("Error fetching main participants:", error);
          // Even if API fails, show current participant if it exists
          if (formData.mainParticipantName) {
            setMainParticipantsList([
              {
                id: formData.mainParticipantId || "current",
                name: formData.mainParticipantName,
                phoneNumber: "",
              },
            ]);
          } else {
            setMainParticipantsList([]);
          }
        } finally {
          setIsLoadingParticipants(false);
        }
      } else {
        setMainParticipantsList([]);
      }
    };

    fetchMainParticipants();
  }, [
    formData.mainParticipantBatch,
    formData.mainParticipantGroup,
    formData.mainParticipantName,
    formData.mainParticipantId,
  ]);

  return (
    <div className="space-y-4">
      {/* Main Participant Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">
          Main Participant Information
        </h3>

        {/* Main Participant Batch and Group */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormControl fullWidth>
            <InputLabel>Main Participant Batch</InputLabel>
            <Select
              value={formData.mainParticipantBatch || ""}
              label="Main Participant Batch"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mainParticipantBatch: e.target.value,
                  mainParticipantName: "", // Reset name when batch changes
                })
              }
            >
              {batchYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Main Participant Group</InputLabel>
            <Select
              value={formData.mainParticipantGroup || ""}
              label="Main Participant Group"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mainParticipantGroup: e.target.value as SilverJubileeGroup,
                  mainParticipantName: "", // Reset name when group changes
                })
              }
            >
              <MenuItem value={SilverJubileeGroup.SCIENCE}>Science</MenuItem>
              <MenuItem value={SilverJubileeGroup.BUSINESS_STUDIES}>
                Business Studies
              </MenuItem>
              <MenuItem value={SilverJubileeGroup.HUMANITIES}>
                Humanities
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Main Participant Name */}
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel>Main Participant Name</InputLabel>
            <Select
              value={formData.mainParticipantName || ""}
              label="Main Participant Name"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mainParticipantName: e.target.value,
                })
              }
              disabled={
                !formData.mainParticipantBatch ||
                !formData.mainParticipantGroup ||
                isLoadingParticipants
              }
            >
              {isLoadingParticipants ? (
                <MenuItem disabled>Loading participants...</MenuItem>
              ) : !formData.mainParticipantBatch ||
                !formData.mainParticipantGroup ? (
                <MenuItem disabled>
                  Please select batch and group first
                </MenuItem>
              ) : mainParticipantsList.length === 0 ? (
                <MenuItem disabled>No participants found</MenuItem>
              ) : (
                mainParticipantsList.map((participant) => (
                  <MenuItem key={participant.id} value={participant.name}>
                    {participant.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Guest Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Guest Information</h3>

        {/* Guest Name and Relation */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextField
            label="Guest Name"
            value={formData.guestName || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                guestName: e.target.value,
              })
            }
            fullWidth
            required
          />
          <TextField
            label="Relation"
            value={formData.relation || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                relation: e.target.value,
              })
            }
            fullWidth
            required
            placeholder="e.g., Spouse, Friend"
          />
        </div>

        {/* Guest Phone Number */}
        <div className="mb-4">
          <TextField
            label="Guest Phone Number"
            value={formData.guestMobileNumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                guestMobileNumber: e.target.value,
              })
            }
            fullWidth
            required
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

        {/* Payment Type and Amount */}
        <div className="grid grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel>Payment Type</InputLabel>
            <Select
              value={formData.paymentType || ""}
              label="Payment Type"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentType: e.target.value as SilverJubileePaymentType,
                })
              }
            >
              <MenuItem value={SilverJubileePaymentType.BKASH}>Bkash</MenuItem>
              <MenuItem value={SilverJubileePaymentType.NAGAD}>Nagad</MenuItem>
              <MenuItem value={SilverJubileePaymentType.CASH}>Cash</MenuItem>
              <MenuItem value={SilverJubileePaymentType.BANK_ACCOUNT}>
                Bank Account
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            type="number"
            value={formData.amount || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            fullWidth
            required
          />
        </div>
      </div>

      {/* Comments */}
      <TextField
        label="Comments"
        value={formData.comments || ""}
        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
        fullWidth
        multiline
        rows={3}
      />
    </div>
  );
};

export default EditGuestForm;
