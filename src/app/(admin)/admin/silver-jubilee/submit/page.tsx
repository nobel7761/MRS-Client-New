"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { silverJubileeApi } from "@/lib/silverJubileeApi";
import {
  SilverJubileeFormData,
  SilverJubileeGroup,
  SilverJubileeGender,
  SilverJubileeBloodGroup,
  SilverJubileePaymentType,
  SilverJubileeParticipantCategory,
  SilverJubileeAmountType,
} from "@/types/silverJubilee";
// Custom SVG Icons
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21h-4.5A2.25 2.25 0 0 1 9 18.75V14"
    />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const SilverJubileeSubmitPage = () => {
  const [formData, setFormData] = useState<SilverJubileeFormData>({
    // Participant Category
    participantCategory: "" as any,

    // Personal Information
    fullName: "",
    phoneNumber: "",
    alternativePhoneNumber: "",
    email: "",
    hscPassingYear: "" as any,
    group: "" as any,
    gender: "" as any,
    bloodGroup: "" as any,
    paymentType: "" as any,
    amountType: "" as any,
    amount: "" as any,
    comments: "",

    // Parents Information
    fatherName: "",
    fatherPhoneNumber: "",
    fatherOccupation: "",
    motherName: "",
    motherPhoneNumber: "",
    motherOccupation: "",

    // Guest Information
    mainParticipantBatch: "" as any,
    mainParticipantGroup: "" as any,
    mainParticipantName: "",
    guestName: "",
    guestMobileNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug: Log form validity whenever form data changes
  useEffect(() => {
    console.log("Form validity:", isFormValid());
  }, [formData]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate participant category
    if (!formData.participantCategory) {
      newErrors.participantCategory = "Please select a participant category";
    }

    if (formData.participantCategory === "Guest") {
      // Guest validation
      if (!formData.mainParticipantBatch) {
        newErrors.mainParticipantBatch = "Please select main participant batch";
      }
      if (!formData.mainParticipantGroup) {
        newErrors.mainParticipantGroup = "Please select main participant group";
      }
      if (!formData.mainParticipantName) {
        newErrors.mainParticipantName = "Please select main participant name";
      }
      if (!formData.guestName) {
        newErrors.guestName = "Please enter guest name";
      }
      if (!formData.guestMobileNumber) {
        newErrors.guestMobileNumber = "Please enter guest mobile number";
      }
    } else {
      // Alumni/Student validation
      if (!formData.fullName) {
        newErrors.fullName = "Please enter full name";
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Please enter phone number";
      }
      if (!formData.email) {
        newErrors.email = "Please enter email address";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.hscPassingYear) {
        newErrors.hscPassingYear = "Please select HSC passing year";
      }
      if (!formData.group) {
        newErrors.group = "Please select group";
      }
      if (!formData.gender) {
        newErrors.gender = "Please select gender";
      }
      if (!formData.bloodGroup) {
        newErrors.bloodGroup = "Please select blood group";
      }
      if (!formData.paymentType) {
        newErrors.paymentType = "Please select payment type";
      }
      if (!formData.amountType) {
        newErrors.amountType = "Please select amount type";
      }
      if (!formData.amount) {
        newErrors.amount = "Please select or enter amount";
      }
      if (!formData.fatherName) {
        newErrors.fatherName = "Please enter father's name";
      }
      if (!formData.fatherPhoneNumber) {
        newErrors.fatherPhoneNumber = "Please enter father's phone number";
      }
      if (!formData.fatherOccupation) {
        newErrors.fatherOccupation = "Please enter father's occupation";
      }
      if (!formData.motherName) {
        newErrors.motherName = "Please enter mother's name";
      }
      if (!formData.motherPhoneNumber) {
        newErrors.motherPhoneNumber = "Please enter mother's phone number";
      }
      if (!formData.motherOccupation) {
        newErrors.motherOccupation = "Please enter mother's occupation";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for showing preview button
  const isFormValid = (): boolean => {
    if (!formData.participantCategory) return false;

    if (formData.participantCategory === "Guest") {
      return !!(
        formData.mainParticipantBatch &&
        formData.mainParticipantGroup &&
        formData.mainParticipantName &&
        formData.guestName &&
        formData.guestMobileNumber
      );
    } else {
      // Debug logging
      console.log("Form validation check:", {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        hscPassingYear: formData.hscPassingYear,
        group: formData.group,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        paymentType: formData.paymentType,
        amountType: formData.amountType,
        amount: formData.amount,
        fatherName: formData.fatherName,
        fatherPhoneNumber: formData.fatherPhoneNumber,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherPhoneNumber: formData.motherPhoneNumber,
        motherOccupation: formData.motherOccupation,
      });

      return !!(
        formData.fullName &&
        formData.phoneNumber &&
        formData.email &&
        formData.hscPassingYear &&
        formData.group &&
        formData.gender &&
        formData.bloodGroup &&
        formData.paymentType &&
        formData.amountType &&
        formData.amount &&
        formData.fatherName &&
        formData.fatherPhoneNumber &&
        formData.fatherOccupation &&
        formData.motherName &&
        formData.motherPhoneNumber &&
        formData.motherOccupation
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hscPassingYear" ||
        name === "amount" ||
        name === "mainParticipantBatch"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategorySelect = (category: SilverJubileeParticipantCategory) => {
    setFormData((prev) => ({
      ...prev,
      participantCategory: category,
    }));
    setShowForm(true);
  };

  // Fetch participants when batch and group are selected for guests
  useEffect(() => {
    if (
      formData.participantCategory === SilverJubileeParticipantCategory.GUEST &&
      formData.mainParticipantBatch &&
      formData.mainParticipantGroup
    ) {
      setLoadingParticipants(true);
      // Mock API call - in real app, this would fetch participants by batch and group
      setTimeout(() => {
        const mockParticipants = [
          {
            id: "1",
            name: "John Doe",
            batch: formData.mainParticipantBatch,
            group: formData.mainParticipantGroup,
          },
          {
            id: "2",
            name: "Jane Smith",
            batch: formData.mainParticipantBatch,
            group: formData.mainParticipantGroup,
          },
          {
            id: "3",
            name: "Mike Johnson",
            batch: formData.mainParticipantBatch,
            group: formData.mainParticipantGroup,
          },
        ];
        setAvailableParticipants(mockParticipants);
        setLoadingParticipants(false);
      }, 1000);
    }
  }, [
    formData.mainParticipantBatch,
    formData.mainParticipantGroup,
    formData.participantCategory,
  ]);

  const handlePreview = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    setShowPreview(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      // Console log the data as requested
      console.log("Silver Jubilee Registration Data:", formData);

      await silverJubileeApi.createParticipant(formData);
      toast.success("Participant registered successfully!");

      // Reset form
      setFormData({
        participantCategory: "" as any,
        fullName: "",
        phoneNumber: "",
        alternativePhoneNumber: "",
        email: "",
        hscPassingYear: "" as any,
        group: "" as any,
        gender: "" as any,
        bloodGroup: "" as any,
        paymentType: "" as any,
        amountType: "" as any,
        amount: "" as any,
        comments: "",
        fatherName: "",
        fatherPhoneNumber: "",
        fatherOccupation: "",
        motherName: "",
        motherPhoneNumber: "",
        motherOccupation: "",
        mainParticipantBatch: "" as any,
        mainParticipantGroup: "" as any,
        mainParticipantName: "",
        guestName: "",
        guestMobileNumber: "",
      });
      setShowForm(false);
      setShowPreview(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hscYears = Array.from({ length: 25 }, (_, i) => 2003 + i);
  const amounts = [2000, 1600, 1400, 1000, 500, 5000];

  const isGuest =
    formData.participantCategory === SilverJubileeParticipantCategory.GUEST;
  const isDonation = formData.amountType === SilverJubileeAmountType.DONATION;

  // Custom Dropdown Component with proper z-index and overflow handling
  const CustomDropdown = ({
    label,
    value,
    onChange,
    options,
    required = false,
    placeholder = "Select",
    allowReset = false,
    error,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    placeholder?: string;
    allowReset?: boolean;
    error?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isOpen) {
          const target = event.target as Element;
          if (!target.closest(".dropdown-container")) {
            setIsOpen(false);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // Always show "Select" option but disable it by default or if a value is already selected
    const processedOptions = options.map((option) => ({
      ...option,
      disabled: option.value === "" && (value !== "" || !allowReset),
    }));

    return (
      <div className="relative dropdown-container">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
        >
          <span className="block truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full bg-white shadow-xl max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-gray-200"
            >
              {processedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  disabled={option.disabled}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                    option.disabled
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "text-gray-900 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  // Preview Component
  const PreviewComponent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 p-8 rounded-lg border-2 border-blue-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Registration Preview
        </h2>
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="space-y-6">
        {/* Participant Category */}
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Participant Category
          </h3>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
              formData.participantCategory === "Alumni"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : formData.participantCategory === "Student"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            }`}
          >
            {formData.participantCategory}
          </span>
        </div>

        {/* Guest Information */}
        {isGuest && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Main Participant:</strong>{" "}
                {formData.mainParticipantName}
              </div>
              <div>
                <strong>Batch:</strong> {formData.mainParticipantBatch}
              </div>
              <div>
                <strong>Group:</strong> {formData.mainParticipantGroup}
              </div>
              <div>
                <strong>Guest Name:</strong> {formData.guestName}
              </div>
              <div>
                <strong>Guest Mobile:</strong> {formData.guestMobileNumber}
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        {!isGuest && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Full Name:</strong> {formData.fullName}
              </div>
              <div>
                <strong>Phone:</strong> {formData.phoneNumber}
              </div>
              <div>
                <strong>Alternative Phone:</strong>{" "}
                {formData.alternativePhoneNumber || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {formData.email}
              </div>
              <div>
                <strong>HSC Year:</strong> {formData.hscPassingYear}
              </div>
              <div>
                <strong>Group:</strong> {formData.group}
              </div>
              <div>
                <strong>Gender:</strong> {formData.gender}
              </div>
              <div>
                <strong>Blood Group:</strong> {formData.bloodGroup}
              </div>
              <div>
                <strong>Payment Type:</strong> {formData.paymentType}
              </div>
              <div>
                <strong>Amount Type:</strong> {formData.amountType}
              </div>
              <div>
                <strong>Amount:</strong> ৳{formData.amount}
              </div>
              {formData.comments && (
                <div className="md:col-span-2">
                  <strong>Comments:</strong> {formData.comments}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parents Information */}
        {!isGuest && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Parents Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Father's Name:</strong> {formData.fatherName}
              </div>
              <div>
                <strong>Father's Phone:</strong> {formData.fatherPhoneNumber}
              </div>
              <div>
                <strong>Father's Occupation:</strong>{" "}
                {formData.fatherOccupation}
              </div>
              <div>
                <strong>Mother's Name:</strong> {formData.motherName}
              </div>
              <div>
                <strong>Mother's Phone:</strong> {formData.motherPhoneNumber}
              </div>
              <div>
                <strong>Mother's Occupation:</strong>{" "}
                {formData.motherOccupation}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-center mb-2"
            >
              National Ideal College Silver Jubilee
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-blue-100"
            >
              Organized by National Ideal College Alumni Association
            </motion.p>
          </div>

          <div className="p-8">
            {/* Participant Category Selection - Always Visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <CustomDropdown
                label="Select Participant Category"
                value={formData.participantCategory}
                onChange={(value) =>
                  handleCategorySelect(
                    value as SilverJubileeParticipantCategory
                  )
                }
                options={[
                  { value: "", label: "Select" },
                  ...Object.values(SilverJubileeParticipantCategory).map(
                    (category) => ({
                      value: category,
                      label: category,
                    })
                  ),
                ]}
                required
                placeholder="Select"
                error={errors.participantCategory}
              />
            </motion.div>

            {/* Form - Only show after category selection */}
            <AnimatePresence>
              {showForm && !showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <form onSubmit={handleSubmit}>
                    {/* Guest Information Section */}
                    {isGuest && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200"
                      >
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                          Main Participant Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <CustomDropdown
                              label="Main Participant Batch"
                              value={
                                formData.mainParticipantBatch
                                  ? formData.mainParticipantBatch.toString()
                                  : ""
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: "mainParticipantBatch",
                                    value,
                                  },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...hscYears.map((year) => ({
                                  value: year.toString(),
                                  label: year.toString(),
                                })),
                              ]}
                              required
                            />
                          </div>

                          <div>
                            <CustomDropdown
                              label="Main Participant Group"
                              value={formData.mainParticipantGroup}
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: "mainParticipantGroup",
                                    value,
                                  },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...Object.values(SilverJubileeGroup).map(
                                  (group) => ({
                                    value: group,
                                    label: group,
                                  })
                                ),
                              ]}
                              required
                            />
                          </div>

                          {/* Only show participant name dropdown if both batch and group are selected */}
                          {formData.mainParticipantBatch &&
                            formData.mainParticipantGroup && (
                              <div className="md:col-span-2">
                                <CustomDropdown
                                  label="Main Participant Name"
                                  value={formData.mainParticipantName}
                                  onChange={(value) =>
                                    handleInputChange({
                                      target: {
                                        name: "mainParticipantName",
                                        value,
                                      },
                                    } as React.ChangeEvent<HTMLSelectElement>)
                                  }
                                  options={[
                                    {
                                      value: "",
                                      label: loadingParticipants
                                        ? "Loading participants..."
                                        : "Select a participant",
                                    },
                                    ...availableParticipants.map(
                                      (participant) => ({
                                        value: participant.name,
                                        label: participant.name,
                                      })
                                    ),
                                  ]}
                                  required
                                />
                              </div>
                            )}
                        </div>

                        {/* Only show guest information section if participant name is selected */}
                        {formData.mainParticipantName && (
                          <div className="mt-6 pt-6 border-t border-yellow-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              Guest Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Guest Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="guestName"
                                  value={formData.guestName}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Enter guest name"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Guest Mobile Number{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  name="guestMobileNumber"
                                  value={formData.guestMobileNumber}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  placeholder="01XXXXXXXXX"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Personal Information Section */}
                    {!isGuest && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                      >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                          Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your full name"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="01XXXXXXXXX"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Alternative Phone Number
                            </label>
                            <input
                              type="tel"
                              name="alternativePhoneNumber"
                              value={formData.alternativePhoneNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="01XXXXXXXXX"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="your.email@example.com"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                          >
                            <CustomDropdown
                              label="HSC Passing Year"
                              value={
                                formData.hscPassingYear
                                  ? formData.hscPassingYear.toString()
                                  : ""
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: { name: "hscPassingYear", value },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...hscYears.map((year) => ({
                                  value: year.toString(),
                                  label: year.toString(),
                                })),
                              ]}
                              required
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                          >
                            <CustomDropdown
                              label="Group"
                              value={formData.group}
                              onChange={(value) =>
                                handleInputChange({
                                  target: { name: "group", value },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...Object.values(SilverJubileeGroup).map(
                                  (group) => ({
                                    value: group,
                                    label: group,
                                  })
                                ),
                              ]}
                              required
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                          >
                            <CustomDropdown
                              label="Gender"
                              value={formData.gender}
                              onChange={(value) =>
                                handleInputChange({
                                  target: { name: "gender", value },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...Object.values(SilverJubileeGender).map(
                                  (gender) => ({
                                    value: gender,
                                    label: gender,
                                  })
                                ),
                              ]}
                              required
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                          >
                            <CustomDropdown
                              label="Blood Group"
                              value={formData.bloodGroup}
                              onChange={(value) =>
                                handleInputChange({
                                  target: { name: "bloodGroup", value },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...Object.values(SilverJubileeBloodGroup).map(
                                  (bloodGroup) => ({
                                    value: bloodGroup,
                                    label: bloodGroup,
                                  })
                                ),
                              ]}
                              required
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                          >
                            <CustomDropdown
                              label="Payment Type"
                              value={formData.paymentType}
                              onChange={(value) =>
                                handleInputChange({
                                  target: { name: "paymentType", value },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...Object.values(SilverJubileePaymentType).map(
                                  (paymentType) => ({
                                    value: paymentType,
                                    label: paymentType,
                                  })
                                ),
                              ]}
                              required
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                          >
                            <CustomDropdown
                              label="Amount Type"
                              value={formData.amountType}
                              onChange={(value) =>
                                handleInputChange({
                                  target: { name: "amountType", value },
                                } as React.ChangeEvent<HTMLSelectElement>)
                              }
                              options={[
                                { value: "", label: "Select" },
                                ...Object.values(SilverJubileeAmountType).map(
                                  (amountType) => ({
                                    value: amountType,
                                    label: amountType,
                                  })
                                ),
                              ]}
                              required
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount <span className="text-red-500">*</span>
                              </label>
                              {isDonation ? (
                                <input
                                  type="number"
                                  name="amount"
                                  value={formData.amount}
                                  onChange={handleInputChange}
                                  required
                                  min="1"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Enter donation amount"
                                />
                              ) : (
                                <CustomDropdown
                                  label=""
                                  value={
                                    formData.amount
                                      ? formData.amount.toString()
                                      : ""
                                  }
                                  onChange={(value) =>
                                    handleInputChange({
                                      target: { name: "amount", value },
                                    } as React.ChangeEvent<HTMLSelectElement>)
                                  }
                                  options={[
                                    { value: "", label: "Select" },
                                    ...amounts.map((amount) => ({
                                      value: amount.toString(),
                                      label: `৳${amount}`,
                                    })),
                                  ]}
                                  required
                                />
                              )}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="md:col-span-2"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Comments
                            </label>
                            <textarea
                              name="comments"
                              value={formData.comments}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Any additional comments or special requirements..."
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Parents Information Section */}
                    {!isGuest && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                      >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                          Parents Information
                        </h2>

                        <div className="space-y-8">
                          {/* Father Information */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-blue-50 p-6 rounded-lg"
                          >
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                              Father's Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Father's Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="fatherName"
                                  value={formData.fatherName}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Father's full name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Father's Phone Number{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  name="fatherPhoneNumber"
                                  value={formData.fatherPhoneNumber}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  placeholder="01XXXXXXXXX"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Father's Occupation{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="fatherOccupation"
                                  value={formData.fatherOccupation}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Father's occupation"
                                />
                              </div>
                            </div>
                          </motion.div>

                          {/* Mother Information */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-pink-50 p-6 rounded-lg"
                          >
                            <h3 className="text-lg font-semibold text-pink-800 mb-4">
                              Mother's Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mother's Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="motherName"
                                  value={formData.motherName}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Mother's full name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mother's Phone Number{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  name="motherPhoneNumber"
                                  value={formData.motherPhoneNumber}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                  placeholder="01XXXXXXXXX"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mother's Occupation{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="motherOccupation"
                                  value={formData.motherOccupation}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Mother's occupation"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Preview Button */}
                    {isFormValid() && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center mt-8"
                      >
                        <motion.button
                          type="button"
                          onClick={handlePreview}
                          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <EyeIcon className="h-5 w-5" />
                          See Preview
                        </motion.button>
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview Component */}
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <PreviewComponent />

                  {/* Submit Button - Only show in preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mt-8"
                  >
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SilverJubileeSubmitPage;
