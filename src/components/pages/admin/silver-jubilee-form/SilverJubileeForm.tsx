"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import SilverJubileeFormBanner from "./Banner";
import {
  SilverJubileeParticipantCategory,
  SilverJubileeGroup,
  SilverJubileeGender,
  SilverJubileeBloodGroup,
  SilverJubileePaymentType,
} from "@/types/silverJubilee";
import { silverJubileeApi } from "@/lib/silverJubileeApi";

// Icon Components
const ChevronUpDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

// Types
interface FormData {
  participantCategory: {
    value: SilverJubileeParticipantCategory;
    label: string;
  } | null;
  hscPassingYear: { value: number; label: string } | null;
  fullName: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  email: string;
  group: { value: SilverJubileeGroup; label: string } | null;
  gender: { value: SilverJubileeGender; label: string } | null;
  bloodGroup: { value: SilverJubileeBloodGroup; label: string } | null;
  paymentType: { value: SilverJubileePaymentType; label: string } | null;
  amount: number;
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;
  // Guest/Baby fields
  guestBatch: { value: number; label: string } | null;
  guestGroup: { value: SilverJubileeGroup; label: string } | null;
  mainParticipant: { id: string; name: string; phoneNumber: string } | null;
  guestName: string;
  relation: string;
  guestPhoneNumber: string;
  // Comments field for all types
  comments: string;
}

const participantCategories = [
  { value: SilverJubileeParticipantCategory.ALUMNI, label: "Alumni" },
  { value: SilverJubileeParticipantCategory.STUDENT, label: "Student" },
  { value: SilverJubileeParticipantCategory.GUEST, label: "Guest" },
  { value: SilverJubileeParticipantCategory.BABY, label: "Baby" },
  {
    value: SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP,
    label: "Lifetime Membership",
  },
];

// Generate HSC Passing Years for Alumni (2003-2025)
const alumniYears = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => ({
  value: 2003 + i,
  label: `${2003 + i}`,
}));

// Generate HSC Passing Years for Students (2026-2027)
const studentYears = Array.from({ length: 2027 - 2026 + 1 }, (_, i) => ({
  value: 2026 + i,
  label: `${2026 + i}`,
}));

// Generate HSC Passing Years for Lifetime Membership (2003-2027)
const lifetimeMembershipYears = Array.from(
  { length: 2027 - 2003 + 1 },
  (_, i) => ({
    value: 2003 + i,
    label: `${2003 + i}`,
  })
);

// Prepare dropdown options
const groupOptions = [
  { value: SilverJubileeGroup.SCIENCE, label: "Science" },
  { value: SilverJubileeGroup.BUSINESS_STUDIES, label: "Business Studies" },
  { value: SilverJubileeGroup.HUMANITIES, label: "Humanities" },
];

const genderOptions = [
  { value: SilverJubileeGender.MALE, label: "Male" },
  { value: SilverJubileeGender.FEMALE, label: "Female" },
];

const bloodGroupOptions = [
  { value: SilverJubileeBloodGroup.DONT_KNOW, label: "Don't know" },
  { value: SilverJubileeBloodGroup.A_POSITIVE, label: "A+" },
  { value: SilverJubileeBloodGroup.B_POSITIVE, label: "B+" },
  { value: SilverJubileeBloodGroup.O_POSITIVE, label: "O+" },
  { value: SilverJubileeBloodGroup.AB_POSITIVE, label: "AB+" },
  { value: SilverJubileeBloodGroup.AB_NEGATIVE, label: "AB-" },
  { value: SilverJubileeBloodGroup.A_NEGATIVE, label: "A-" },
  { value: SilverJubileeBloodGroup.B_NEGATIVE, label: "B-" },
  { value: SilverJubileeBloodGroup.O_NEGATIVE, label: "O-" },
];

const paymentTypeOptions = [
  { value: SilverJubileePaymentType.BKASH, label: "Bkash" },
  { value: SilverJubileePaymentType.NAGAD, label: "Nagad" },
  { value: SilverJubileePaymentType.CASH, label: "Cash" },
  { value: SilverJubileePaymentType.BANK_ACCOUNT, label: "Bank Account" },
];

// Validation patterns
const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SilverJubileeForm = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [mainParticipantsList, setMainParticipantsList] = useState<
    { id: string; name: string; phoneNumber: string }[]
  >([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      participantCategory: null,
      hscPassingYear: null,
      fullName: "",
      phoneNumber: "",
      alternativePhoneNumber: "",
      email: "",
      group: null,
      gender: null,
      bloodGroup: null,
      paymentType: null,
      amount: 0,
      fatherName: "",
      fatherPhoneNumber: "",
      fatherOccupation: "",
      motherName: "",
      motherPhoneNumber: "",
      motherOccupation: "",
      guestBatch: null,
      guestGroup: null,
      mainParticipant: null,
      guestName: "",
      relation: "",
      guestPhoneNumber: "",
      comments: "",
    },
  });

  // Watch form values
  const selectedCategory = watch("participantCategory");
  const selectedYear = watch("hscPassingYear");
  const amount = watch("amount");
  const mainParticipant = watch("mainParticipant");
  const guestBatch = watch("guestBatch");
  const guestGroup = watch("guestGroup");

  // Check if HSC Passing Year should be shown
  const shouldShowHSCYear =
    selectedCategory?.value === SilverJubileeParticipantCategory.ALUMNI ||
    selectedCategory?.value === SilverJubileeParticipantCategory.STUDENT ||
    selectedCategory?.value ===
      SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP;

  // Check if Guest/Baby flow should be shown
  const isGuestOrBaby =
    selectedCategory?.value === SilverJubileeParticipantCategory.GUEST ||
    selectedCategory?.value === SilverJubileeParticipantCategory.BABY;

  // Separate checks for Guest and Baby
  const isGuest =
    selectedCategory?.value === SilverJubileeParticipantCategory.GUEST;
  const isBaby =
    selectedCategory?.value === SilverJubileeParticipantCategory.BABY;

  // Calculate amount based on category and year
  useEffect(() => {
    if (selectedCategory && selectedYear) {
      if (
        selectedCategory.value ===
        SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP
      ) {
        setValue("amount", 5000);
      } else if (
        selectedCategory.value === SilverJubileeParticipantCategory.ALUMNI
      ) {
        if (selectedYear.value >= 2003 && selectedYear.value <= 2021) {
          setValue("amount", 2000);
        } else if (selectedYear.value >= 2022 && selectedYear.value <= 2025) {
          setValue("amount", 1600);
        }
      } else if (
        selectedCategory.value === SilverJubileeParticipantCategory.STUDENT
      ) {
        setValue("amount", 1400);
      }
    }
  }, [selectedCategory, selectedYear, setValue]);

  // Set amount for Guest/Baby when main participant is selected
  useEffect(() => {
    if (mainParticipant) {
      if (isGuest) {
        setValue("amount", 1000);
      } else if (isBaby) {
        setValue("amount", 500);
      }
    }
  }, [isGuest, isBaby, mainParticipant, setValue]);

  // Fetch main participants when batch and group are selected
  useEffect(() => {
    const fetchMainParticipants = async () => {
      if (guestBatch && guestGroup) {
        setIsLoadingParticipants(true);
        try {
          const response =
            await silverJubileeApi.getParticipantsByBatchAndGroup(
              guestBatch.value,
              guestGroup.value
            );

          // Transform participants to dropdown format
          const transformedParticipants = response.participants.map(
            (participant) => ({
              id: participant._id || "",
              name: `${participant.fullName} - ${participant.group} - ${participant.hscPassingYear}`,
              phoneNumber: participant.phoneNumber,
            })
          );

          setMainParticipantsList(transformedParticipants);

          // Reset main participant selection when batch/group changes
          setValue("mainParticipant", null);
        } catch (error) {
          console.error("Error fetching participants:", error);
          toast.error("Failed to fetch participants. Please try again.");
          setMainParticipantsList([]);
        } finally {
          setIsLoadingParticipants(false);
        }
      } else {
        // Clear the list if batch or group is not selected
        setMainParticipantsList([]);
        setValue("mainParticipant", null);
      }
    };

    fetchMainParticipants();
  }, [guestBatch, guestGroup, setValue]);

  // Get appropriate year range based on category
  const getYearOptions = () => {
    if (selectedCategory?.value === SilverJubileeParticipantCategory.STUDENT) {
      return studentYears;
    } else if (
      selectedCategory?.value ===
      SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP
    ) {
      return lifetimeMembershipYears;
    }
    return alumniYears; // For Alumni
  };

  const yearOptions = getYearOptions();

  // Handle preview submission
  const handlePreview = handleSubmit(() => {
    setShowPreviewModal(true);
  });

  // Handle final submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      let formData: any;

      if (isGuest) {
        // Guest submission data
        formData = {
          participantCategory: data.participantCategory?.value,
          mainParticipantBatch: data.guestBatch?.value,
          mainParticipantGroup: data.guestGroup?.value,
          mainParticipantId: data.mainParticipant?.id,
          guestName: data.guestName,
          relation: data.relation, // Required for Guest
          guestMobileNumber: data.guestPhoneNumber,
          amount: data.amount,
          paymentType: data.paymentType?.value,
          comments: data.comments || "",
        };
      } else if (isBaby) {
        // Baby submission data
        formData = {
          participantCategory: data.participantCategory?.value,
          mainParticipantBatch: data.guestBatch?.value,
          mainParticipantGroup: data.guestGroup?.value,
          mainParticipantId: data.mainParticipant?.id,
          babyName: data.guestName, // Use babyName for Baby category
          babyPhone: data.guestPhoneNumber, // Use babyPhone for Baby category
          amount: data.amount,
          paymentType: data.paymentType?.value,
          comments: data.comments || "",
        };
      } else {
        // Alumni/Student/Lifetime membership submission data
        formData = {
          participantCategory: data.participantCategory?.value,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          alternativePhoneNumber: data.alternativePhoneNumber || "",
          email: data.email,
          hscPassingYear: data.hscPassingYear?.value,
          group: data.group?.value,
          gender: data.gender?.value,
          bloodGroup: data.bloodGroup?.value,
          paymentType: data.paymentType?.value,
          amount: data.amount,
          comments: data.comments || "",
          fatherName: data.fatherName,
          fatherPhoneNumber: data.fatherPhoneNumber,
          fatherOccupation: data.fatherOccupation,
          motherName: data.motherName,
          motherPhoneNumber: data.motherPhoneNumber,
          motherOccupation: data.motherOccupation,
        };
      }

      // Call the registration API
      const response = await silverJubileeApi.register(formData);

      if (response.success) {
        toast.success(
          response.message || "Registration completed successfully!"
        );

        // Close modal
        setShowPreviewModal(false);

        // Reset form
        reset();
        setIsAmountEditable(false);
      } else {
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);

      // Handle different types of errors
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit registration. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Banner Section */}
      <SilverJubileeFormBanner />

      {/* Form Section */}
      <div className="w-full px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Registration Form
        </h2>

        <form className="space-y-6">
          {/* Participant Category and HSC Passing Year - Same Line */}
          <div
            className={`grid gap-4 ${
              shouldShowHSCYear ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* Participant Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participant Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="participantCategory"
                control={control}
                rules={{ required: "Participant category is required" }}
                render={({ field }) => (
                  <Listbox
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("hscPassingYear", null);
                    }}
                  >
                    <div className="relative">
                      <Listbox.Button
                        className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                          errors.participantCategory
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      >
                        <span
                          className={`block truncate ${
                            field.value ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {field.value
                            ? field.value.label
                            : "Select a category"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                          <ChevronUpDownIcon />
                        </span>
                      </Listbox.Button>
                      <Transition
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {participantCategories.map(
                            (category, categoryIdx) => (
                              <Listbox.Option
                                key={categoryIdx}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                    active
                                      ? "bg-blue-100 text-blue-900"
                                      : "text-gray-900"
                                  }`
                                }
                                value={category}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {category.label}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <CheckIcon />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            )
                          )}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                )}
              />
              {errors.participantCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.participantCategory.message}
                </p>
              )}
            </div>

            {/* HSC Passing Year Dropdown - Conditional */}
            {shouldShowHSCYear && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HSC Passing Year <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="hscPassingYear"
                  control={control}
                  rules={{
                    required: shouldShowHSCYear
                      ? "HSC passing year is required"
                      : false,
                  }}
                  render={({ field }) => (
                    <Listbox value={field.value} onChange={field.onChange}>
                      <div className="relative">
                        <Listbox.Button
                          className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors.hscPassingYear
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        >
                          <span
                            className={`block truncate ${
                              field.value ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {field.value ? field.value.label : "Select a year"}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            <ChevronUpDownIcon />
                          </span>
                        </Listbox.Button>
                        <Transition
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {yearOptions.map((year, yearIdx) => (
                              <Listbox.Option
                                key={yearIdx}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                    active
                                      ? "bg-blue-100 text-blue-900"
                                      : "text-gray-900"
                                  }`
                                }
                                value={year}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {year.label}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <CheckIcon />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  )}
                />
                {errors.hscPassingYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hscPassingYear.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Guest/Baby Form Fields */}
          {isGuestOrBaby && (
            <>
              {/* Batch and Group - Same Line */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Batch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSC Batch <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="guestBatch"
                    control={control}
                    rules={{
                      required: isGuestOrBaby ? "Batch is required" : false,
                    }}
                    render={({ field }) => (
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.guestBatch
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          >
                            <span
                              className={`block truncate ${
                                field.value ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {field.value
                                ? field.value.label
                                : "Select a batch"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                              <ChevronUpDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {lifetimeMembershipYears.map((year, yearIdx) => (
                                <Listbox.Option
                                  key={yearIdx}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                      active
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={year}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }`}
                                      >
                                        {year.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <CheckIcon />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {errors.guestBatch && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guestBatch.message}
                    </p>
                  )}
                </div>

                {/* Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="guestGroup"
                    control={control}
                    rules={{
                      required: isGuestOrBaby ? "Group is required" : false,
                    }}
                    render={({ field }) => (
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.guestGroup
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          >
                            <span
                              className={`block truncate ${
                                field.value ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {field.value
                                ? field.value.label
                                : "Select a group"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                              <ChevronUpDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {groupOptions.map((group, groupIdx) => (
                                <Listbox.Option
                                  key={groupIdx}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                      active
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={group}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }`}
                                      >
                                        {group.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <CheckIcon />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {errors.guestGroup && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guestGroup.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Main Participant - Show after batch and group are selected */}
              {guestBatch && guestGroup && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Participant <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="mainParticipant"
                      control={control}
                      rules={{
                        required: isGuestOrBaby
                          ? "Main participant is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <Listbox
                          value={field.value}
                          onChange={field.onChange}
                          disabled={
                            !guestBatch || !guestGroup || isLoadingParticipants
                          }
                        >
                          <div className="relative">
                            <Listbox.Button
                              className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                                errors.mainParticipant
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              } ${
                                !guestBatch ||
                                !guestGroup ||
                                isLoadingParticipants
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <span
                                className={`block truncate ${
                                  field.value
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}
                              >
                                {isLoadingParticipants
                                  ? "Loading participants..."
                                  : !guestBatch || !guestGroup
                                  ? "Please select batch and group first"
                                  : field.value
                                  ? field.value.name
                                  : "Select main participant"}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                {isLoadingParticipants ? (
                                  <svg
                                    className="animate-spin h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <ChevronUpDownIcon />
                                )}
                              </span>
                            </Listbox.Button>
                            <Transition
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {mainParticipantsList.length === 0 ? (
                                  <div className="py-3 px-4 text-gray-500 text-center">
                                    No participants found for this batch and
                                    group
                                  </div>
                                ) : (
                                  mainParticipantsList.map((participant) => (
                                    <Listbox.Option
                                      key={participant.id}
                                      className={({ active }) =>
                                        `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                          active
                                            ? "bg-blue-100 text-blue-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={participant}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-semibold"
                                                : "font-normal"
                                            }`}
                                          >
                                            {participant.name}
                                          </span>
                                          <div className="text-xs text-gray-500 mt-1">
                                            {participant.phoneNumber}
                                          </div>
                                          {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                              <CheckIcon />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))
                                )}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      )}
                    />
                    {errors.mainParticipant && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mainParticipant.message}
                      </p>
                    )}
                  </div>

                  {/* Guest/Baby Details - Show after main participant is selected */}
                  {mainParticipant && (
                    <>
                      {/* Guest/Baby Name and Relation (if guest) - Same Line */}
                      <div
                        className={`grid grid-cols-1 ${
                          selectedCategory?.value ===
                          SilverJubileeParticipantCategory.GUEST
                            ? "md:grid-cols-2"
                            : ""
                        } gap-4`}
                      >
                        {/* Guest/Baby Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {selectedCategory?.value ===
                            SilverJubileeParticipantCategory.BABY
                              ? "Baby"
                              : "Guest"}{" "}
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("guestName", {
                              required: isGuestOrBaby
                                ? "Guest/Baby name is required"
                                : false,
                            })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.guestName
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                            placeholder={`Enter ${
                              selectedCategory?.value ===
                              SilverJubileeParticipantCategory.BABY
                                ? "baby"
                                : "guest"
                            } name`}
                          />
                          {errors.guestName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.guestName.message}
                            </p>
                          )}
                        </div>

                        {/* Relation - Only for Guest */}
                        {selectedCategory?.value ===
                          SilverJubileeParticipantCategory.GUEST && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Relation <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("relation", {
                                required:
                                  selectedCategory?.value ===
                                  SilverJubileeParticipantCategory.GUEST
                                    ? "Relation is required"
                                    : false,
                              })}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                errors.relation
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                              placeholder="Enter relation (e.g., Spouse, Friend)"
                            />
                            {errors.relation && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.relation.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Guest Phone Number, Payment Type, and Amount - Same Line */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Guest Phone Number */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setValue(
                                  "guestPhoneNumber",
                                  mainParticipant?.phoneNumber || ""
                                )
                              }
                              className="text-[12px] text-blue-600 hover:text-blue-800 hover:underline transition-colors capitalize"
                            >
                              use main participant phone number
                            </button>
                          </div>
                          <input
                            type="tel"
                            {...register("guestPhoneNumber", {
                              required: isGuestOrBaby
                                ? "Phone number is required"
                                : false,
                              pattern: {
                                value: phoneRegex,
                                message:
                                  "Invalid format. Use 01[3-9]XXXXXXXX or +8801[3-9]XXXXXXXX",
                              },
                            })}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.guestPhoneNumber
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                            placeholder="01XXXXXXXXX"
                          />
                          {errors.guestPhoneNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.guestPhoneNumber.message}
                            </p>
                          )}
                        </div>

                        {/* Payment Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Type <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="paymentType"
                            control={control}
                            rules={{
                              required: isGuestOrBaby
                                ? "Payment type is required"
                                : false,
                            }}
                            render={({ field }) => (
                              <Listbox
                                value={field.value}
                                onChange={field.onChange}
                              >
                                <div className="relative">
                                  <Listbox.Button
                                    className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                                      errors.paymentType
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                  >
                                    <span
                                      className={`block truncate ${
                                        field.value
                                          ? "text-gray-900"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {field.value
                                        ? field.value.label
                                        : "Select payment type"}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                      <ChevronUpDownIcon />
                                    </span>
                                  </Listbox.Button>
                                  <Transition
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                      {paymentTypeOptions.map(
                                        (paymentType, paymentTypeIdx) => (
                                          <Listbox.Option
                                            key={paymentTypeIdx}
                                            className={({ active }) =>
                                              `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                                active
                                                  ? "bg-blue-100 text-blue-900"
                                                  : "text-gray-900"
                                              }`
                                            }
                                            value={paymentType}
                                          >
                                            {({ selected }) => (
                                              <>
                                                <span
                                                  className={`block truncate ${
                                                    selected
                                                      ? "font-semibold"
                                                      : "font-normal"
                                                  }`}
                                                >
                                                  {paymentType.label}
                                                </span>
                                                {selected ? (
                                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                    <CheckIcon />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        )
                                      )}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </Listbox>
                            )}
                          />
                          {errors.paymentType && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.paymentType.message}
                            </p>
                          )}
                        </div>

                        {/* Amount (with Edit) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (BDT) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              {...register("amount", {
                                valueAsNumber: true,
                                required: "Amount is required",
                                min: {
                                  value: 1,
                                  message: "Amount must be greater than 0",
                                },
                              })}
                              readOnly={!isAmountEditable}
                              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                isAmountEditable
                                  ? "bg-white text-gray-900"
                                  : "bg-gray-50 text-gray-700 cursor-not-allowed"
                              } ${
                                errors.amount
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setIsAmountEditable(!isAmountEditable)
                              }
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              {isAmountEditable ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5 text-green-600"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.amount.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Comments Field for Guest/Baby */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comments / Additional Notes (Optional)
                        </label>
                        <textarea
                          {...register("comments")}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Any additional information or special requests..."
                        />
                      </div>

                      {/* Preview Submission Button for Guest/Baby */}
                      <div className="flex justify-center mt-8">
                        <button
                          type="button"
                          onClick={handlePreview}
                          className="px-8 py-3 rounded-lg font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                          Preview Submission
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* Personal Information Fields - Conditional */}
          {shouldShowHSCYear && selectedYear && (
            <>
              {/* Full Name - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: !isGuestOrBaby ? "Full name is required" : false,
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Group, Phone Number, Alternative Phone, Email - Same Line */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="group"
                    control={control}
                    rules={{
                      required: !isGuestOrBaby ? "Group is required" : false,
                    }}
                    render={({ field }) => (
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.group
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          >
                            <span
                              className={`block truncate ${
                                field.value ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {field.value
                                ? field.value.label
                                : "Select a group"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                              <ChevronUpDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {groupOptions.map((group, groupIdx) => (
                                <Listbox.Option
                                  key={groupIdx}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                      active
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={group}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }`}
                                      >
                                        {group.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <CheckIcon />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {errors.group && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.group.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: !isGuestOrBaby
                        ? "Phone number is required"
                        : false,
                      pattern: {
                        value: phoneRegex,
                        message:
                          "Invalid format. Use 01[3-9]XXXXXXXX or +8801[3-9]XXXXXXXX",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Alternative Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("alternativePhoneNumber", {
                      pattern: {
                        value: phoneRegex,
                        message:
                          "Invalid format. Use 01[3-9]XXXXXXXX or +8801[3-9]XXXXXXXX",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.alternativePhoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="01XXXXXXXXX (optional)"
                  />
                  {errors.alternativePhoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.alternativePhoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: !isGuestOrBaby ? "Email is required" : false,
                      pattern: {
                        value: emailRegex,
                        message: "Invalid email format",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender, Blood Group, Payment Type, Amount - Same Line */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{
                      required: !isGuestOrBaby ? "Gender is required" : false,
                    }}
                    render={({ field }) => (
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.gender
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          >
                            <span
                              className={`block truncate ${
                                field.value ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {field.value
                                ? field.value.label
                                : "Select a gender"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                              <ChevronUpDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {genderOptions.map((gender, genderIdx) => (
                                <Listbox.Option
                                  key={genderIdx}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                      active
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={gender}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }`}
                                      >
                                        {gender.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <CheckIcon />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="bloodGroup"
                    control={control}
                    rules={{
                      required: !isGuestOrBaby
                        ? "Blood group is required"
                        : false,
                    }}
                    render={({ field }) => (
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.bloodGroup
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          >
                            <span
                              className={`block truncate ${
                                field.value ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {field.value
                                ? field.value.label
                                : "Select blood group"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                              <ChevronUpDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {bloodGroupOptions.map(
                                (bloodGroup, bloodGroupIdx) => (
                                  <Listbox.Option
                                    key={bloodGroupIdx}
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                        active
                                          ? "bg-blue-100 text-blue-900"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={bloodGroup}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-semibold"
                                              : "font-normal"
                                          }`}
                                        >
                                          {bloodGroup.label}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                            <CheckIcon />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                )
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {errors.bloodGroup && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="paymentType"
                    control={control}
                    rules={{
                      required: !isGuestOrBaby
                        ? "Payment type is required"
                        : false,
                    }}
                    render={({ field }) => (
                      <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.paymentType
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          >
                            <span
                              className={`block truncate ${
                                field.value ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {field.value
                                ? field.value.label
                                : "Select payment type"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                              <ChevronUpDownIcon />
                            </span>
                          </Listbox.Button>
                          <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {paymentTypeOptions.map(
                                (paymentType, paymentTypeIdx) => (
                                  <Listbox.Option
                                    key={paymentTypeIdx}
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                        active
                                          ? "bg-blue-100 text-blue-900"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={paymentType}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-semibold"
                                              : "font-normal"
                                          }`}
                                        >
                                          {paymentType.label}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                            <CheckIcon />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                )
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    )}
                  />
                  {errors.paymentType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.paymentType.message}
                    </p>
                  )}
                </div>

                {/* Amount (Read-only with Edit) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (BDT) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("amount", {
                        valueAsNumber: true,
                        required: !isGuestOrBaby ? "Amount is required" : false,
                        min: {
                          value: 1,
                          message: "Amount must be greater than 0",
                        },
                      })}
                      readOnly={!isAmountEditable}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        isAmountEditable
                          ? "bg-white text-gray-900"
                          : "bg-gray-50 text-gray-700 cursor-not-allowed"
                      } ${
                        errors.amount
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsAmountEditable(!isAmountEditable)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {isAmountEditable ? (
                        // Tick/Check Icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-green-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        // Edit/Pencil Icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Parents Information Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Parents Information
                </h3>

                {/* Father's Information - Same Line */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Father Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("fatherName", {
                        required: !isGuestOrBaby
                          ? "Father's name is required"
                          : false,
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.fatherName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter father's name"
                    />
                    {errors.fatherName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fatherName.message}
                      </p>
                    )}
                  </div>

                  {/* Father Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Occupation{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("fatherOccupation", {
                        required: !isGuestOrBaby
                          ? "Father's occupation is required"
                          : false,
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.fatherOccupation
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter father's occupation"
                    />
                    {errors.fatherOccupation && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fatherOccupation.message}
                      </p>
                    )}
                  </div>

                  {/* Father Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register("fatherPhoneNumber", {
                        required: !isGuestOrBaby
                          ? "Father's phone number is required"
                          : false,
                        pattern: {
                          value: phoneRegex,
                          message:
                            "Invalid format. Use 01[3-9]XXXXXXXX or +8801[3-9]XXXXXXXX",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.fatherPhoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.fatherPhoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fatherPhoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mother's Information - Same Line */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mother Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("motherName", {
                        required: !isGuestOrBaby
                          ? "Mother's name is required"
                          : false,
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.motherName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter mother's name"
                    />
                    {errors.motherName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.motherName.message}
                      </p>
                    )}
                  </div>

                  {/* Mother Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Occupation{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("motherOccupation", {
                        required: !isGuestOrBaby
                          ? "Mother's occupation is required"
                          : false,
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.motherOccupation
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter mother's occupation"
                    />
                    {errors.motherOccupation && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.motherOccupation.message}
                      </p>
                    )}
                  </div>

                  {/* Mother Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register("motherPhoneNumber", {
                        required: !isGuestOrBaby
                          ? "Mother's phone number is required"
                          : false,
                        pattern: {
                          value: phoneRegex,
                          message:
                            "Invalid format. Use 01[3-9]XXXXXXXX or +8801[3-9]XXXXXXXX",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.motherPhoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.motherPhoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.motherPhoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Field for Alumni/Student/Lifetime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments / Additional Notes (Optional)
                </label>
                <textarea
                  {...register("comments")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any additional information or special requests..."
                />
              </div>

              {/* Preview Submission Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Preview Submission
                </button>
              </div>
            </>
          )}
        </form>

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  Preview Submission
                </h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-6">
                {/* Participant Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                    Participant Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{selectedCategory?.label}</p>
                    </div>
                    {isGuestOrBaby ? (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">Batch</p>
                          <p className="font-medium">{guestBatch?.value}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Group</p>
                          <p className="font-medium">{guestGroup?.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Main Participant
                          </p>
                          <p className="font-medium">{mainParticipant?.name}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">
                          HSC Passing Year
                        </p>
                        <p className="font-medium">{selectedYear?.value}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guest/Baby Information OR Personal Information */}
                {isGuestOrBaby ? (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                      {selectedCategory?.value ===
                      SilverJubileeParticipantCategory.BABY
                        ? "Baby"
                        : "Guest"}{" "}
                      Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{watch("guestName")}</p>
                      </div>
                      {selectedCategory?.value ===
                        SilverJubileeParticipantCategory.GUEST && (
                        <div>
                          <p className="text-sm text-gray-600">Relation</p>
                          <p className="font-medium">{watch("relation")}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">
                          {watch("guestPhoneNumber")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Type</p>
                        <p className="font-medium">
                          {watch("paymentType")?.label || "Not selected"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">{amount} BDT</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Personal Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{watch("fullName")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Group</p>
                          <p className="font-medium">{watch("group")?.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-medium">{watch("phoneNumber")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Alternative Phone
                          </p>
                          <p className="font-medium">
                            {watch("alternativePhoneNumber") || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{watch("email")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium">
                            {watch("gender")?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Blood Group</p>
                          <p className="font-medium">
                            {watch("bloodGroup")?.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                        Payment Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Payment Type</p>
                          <p className="font-medium">
                            {watch("paymentType")?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-medium">{amount} BDT</p>
                        </div>
                      </div>
                    </div>

                    {/* Father's Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                        Father's Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{watch("fatherName")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Occupation</p>
                          <p className="font-medium">
                            {watch("fatherOccupation")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-medium">
                            {watch("fatherPhoneNumber")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mother's Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                        Mother's Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{watch("motherName")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Occupation</p>
                          <p className="font-medium">
                            {watch("motherOccupation")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-medium">
                            {watch("motherPhoneNumber")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-4">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SilverJubileeForm;
