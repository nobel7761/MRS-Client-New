"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { SilverJubileeParticipant } from "@/types/silverJubilee";
import {
  SilverJubileeGroup,
  SilverJubileeGender,
  SilverJubileeBloodGroup,
  SilverJubileePaymentType,
} from "@/types/silverJubilee";

interface EditStudentFormProps {
  formData: Partial<SilverJubileeParticipant>;
  setFormData: (data: Partial<SilverJubileeParticipant>) => void;
}

const EditStudentForm = ({ formData, setFormData }: EditStudentFormProps) => {
  return (
    <div className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Full Name"
          value={formData.fullName || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              fullName: e.target.value,
            })
          }
          fullWidth
          required
        />
        <TextField
          label="Phone Number"
          value={formData.phoneNumber || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              phoneNumber: e.target.value,
            })
          }
          fullWidth
          required
        />
      </div>

      {/* Email and Alternative Phone */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Alternative Phone"
          value={formData.alternativePhoneNumber || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              alternativePhoneNumber: e.target.value,
            })
          }
          fullWidth
        />
      </div>

      {/* HSC Year and Group */}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="HSC Passing Year"
          type="number"
          value={formData.hscPassingYear || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              hscPassingYear: parseInt(e.target.value) || 0,
            })
          }
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Group</InputLabel>
          <Select
            value={formData.group || ""}
            label="Group"
            onChange={(e) =>
              setFormData({
                ...formData,
                group: e.target.value as SilverJubileeGroup,
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

      {/* Gender and Blood Group */}
      <div className="grid grid-cols-2 gap-4">
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender || ""}
            label="Gender"
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value as SilverJubileeGender,
              })
            }
          >
            <MenuItem value={SilverJubileeGender.MALE}>Male</MenuItem>
            <MenuItem value={SilverJubileeGender.FEMALE}>Female</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Blood Group</InputLabel>
          <Select
            value={formData.bloodGroup || ""}
            label="Blood Group"
            onChange={(e) =>
              setFormData({
                ...formData,
                bloodGroup: e.target.value as SilverJubileeBloodGroup,
              })
            }
          >
            <MenuItem value={SilverJubileeBloodGroup.DONT_KNOW}>
              Don't know
            </MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.A_POSITIVE}>A+</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.B_POSITIVE}>B+</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.O_POSITIVE}>O+</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.AB_POSITIVE}>AB+</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.AB_NEGATIVE}>AB-</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.A_NEGATIVE}>A-</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.B_NEGATIVE}>B-</MenuItem>
            <MenuItem value={SilverJubileeBloodGroup.O_NEGATIVE}>O-</MenuItem>
          </Select>
        </FormControl>
      </div>

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

      {/* Comments */}
      <TextField
        label="Comments"
        value={formData.comments || ""}
        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
        fullWidth
        multiline
        rows={3}
      />

      {/* Parents Information */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Parents Information</h3>

        {/* Father's Information */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <TextField
            label="Father's Name"
            value={formData.fatherName || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                fatherName: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            label="Father's Phone"
            value={formData.fatherPhoneNumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                fatherPhoneNumber: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            label="Father's Occupation"
            value={formData.fatherOccupation || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                fatherOccupation: e.target.value,
              })
            }
            fullWidth
          />
        </div>

        {/* Mother's Information */}
        <div className="grid grid-cols-3 gap-4">
          <TextField
            label="Mother's Name"
            value={formData.motherName || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                motherName: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            label="Mother's Phone"
            value={formData.motherPhoneNumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                motherPhoneNumber: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            label="Mother's Occupation"
            value={formData.motherOccupation || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                motherOccupation: e.target.value,
              })
            }
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default EditStudentForm;
