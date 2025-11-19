"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import SilverJubileeFormBanner from "./Banner";
import AlumniForm from "./AlumniForm";
import StudentForm from "./StudentForm";
import LifetimeMembershipForm from "./LifetimeMembershipForm";
import GuestForm from "./GuestForm";
import BabyForm from "./BabyForm";
import PreviewModal from "./PreviewModal";
import {
  SilverJubileeParticipantCategory,
  SilverJubileeFormData,
} from "@/types/silverJubilee";
import { silverJubileeApi } from "@/lib/silverJubileeApi";
import { getCollectors, Collector } from "@/lib/authApi";

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

// Use shared FormData type from types/silverJubilee
type FormData = SilverJubileeFormData;

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

const SilverJubileeForm = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [mainParticipantsList, setMainParticipantsList] = useState<
    { id: string; name: string; phoneNumber: string }[]
  >([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [noParticipantsFound, setNoParticipantsFound] = useState(false);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [isLoadingCollectors, setIsLoadingCollectors] = useState(false);

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
      professionalDetails: "",
      guestBatch: null,
      guestGroup: null,
      mainParticipant: null,
      guestName: "",
      relation: "",
      guestPhoneNumber: "",
      comments: "",
      registeredUnder: null,
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

  // Load collectors on component mount
  useEffect(() => {
    const loadCollectors = async () => {
      setIsLoadingCollectors(true);
      try {
        const collectorsData = await getCollectors();
        setCollectors(collectorsData);
      } catch (error) {
        console.error("Error loading collectors:", error);
        toast.error("Failed to load collectors list");
      } finally {
        setIsLoadingCollectors(false);
      }
    };

    loadCollectors();
  }, []);

  // Fetch main participants when batch and group are selected
  useEffect(() => {
    const fetchMainParticipants = async () => {
      if (guestBatch && guestGroup) {
        setIsLoadingParticipants(true);
        setNoParticipantsFound(false);
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

          // Check if no participants were found
          if (transformedParticipants.length === 0) {
            setNoParticipantsFound(true);
          }

          // Reset main participant selection when batch/group changes
          setValue("mainParticipant", null);
        } catch (error: any) {
          console.error("Error fetching participants:", error);

          // Check if it's a "not found" or "no records" error (404 or empty result)
          // In these cases, show the "no participants found" message instead of error toast
          const isNoRecordsError =
            error?.response?.status === 404 ||
            error?.response?.data?.participants?.length === 0 ||
            error?.message?.toLowerCase().includes("not found") ||
            error?.message?.toLowerCase().includes("no participants");

          if (isNoRecordsError) {
            setMainParticipantsList([]);
            setNoParticipantsFound(true);
          } else {
            // Only show toast for actual errors (network issues, server errors, etc.)
            toast.error("Failed to fetch participants. Please try again.");
            setMainParticipantsList([]);
            setNoParticipantsFound(false);
          }
        } finally {
          setIsLoadingParticipants(false);
        }
      } else {
        // Clear the list if batch or group is not selected
        setMainParticipantsList([]);
        setValue("mainParticipant", null);
        setNoParticipantsFound(false);
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
          registeredUnder: data.registeredUnder?.id,
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
          registeredUnder: data.registeredUnder?.id,
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
          professionalDetails: data.professionalDetails || "",
          comments: data.comments || "",
          registeredUnder: data.registeredUnder?.id,
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
          {isGuest && (
            <GuestForm
              control={control}
              register={register}
              watch={watch}
              errors={errors}
              setValue={setValue}
              mainParticipant={mainParticipant}
              guestBatch={guestBatch}
              guestGroup={guestGroup}
              mainParticipantsList={mainParticipantsList}
              isLoadingParticipants={isLoadingParticipants}
              noParticipantsFound={noParticipantsFound}
              isAmountEditable={isAmountEditable}
              setIsAmountEditable={setIsAmountEditable}
              collectors={collectors}
              isLoadingCollectors={isLoadingCollectors}
              amount={amount}
              onPreview={handlePreview}
            />
          )}

          {isBaby && (
            <BabyForm
              control={control}
              register={register}
              watch={watch}
              errors={errors}
              setValue={setValue}
              mainParticipant={mainParticipant}
              guestBatch={guestBatch}
              guestGroup={guestGroup}
              mainParticipantsList={mainParticipantsList}
              isLoadingParticipants={isLoadingParticipants}
              noParticipantsFound={noParticipantsFound}
              isAmountEditable={isAmountEditable}
              setIsAmountEditable={setIsAmountEditable}
              collectors={collectors}
              isLoadingCollectors={isLoadingCollectors}
              amount={amount}
              onPreview={handlePreview}
            />
          )}

          {/* Alumni Form */}
          {selectedCategory?.value ===
            SilverJubileeParticipantCategory.ALUMNI &&
            selectedYear && (
              <AlumniForm
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
                selectedYear={selectedYear}
                isAmountEditable={isAmountEditable}
                setIsAmountEditable={setIsAmountEditable}
                collectors={collectors}
                isLoadingCollectors={isLoadingCollectors}
                onPreview={handlePreview}
              />
            )}

          {/* Student Form */}
          {selectedCategory?.value ===
            SilverJubileeParticipantCategory.STUDENT &&
            selectedYear && (
              <StudentForm
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
                selectedYear={selectedYear}
                isAmountEditable={isAmountEditable}
                setIsAmountEditable={setIsAmountEditable}
                collectors={collectors}
                isLoadingCollectors={isLoadingCollectors}
                onPreview={handlePreview}
              />
            )}

          {/* Lifetime Membership Form */}
          {selectedCategory?.value ===
            SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP &&
            selectedYear && (
              <LifetimeMembershipForm
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
                selectedYear={selectedYear}
                isAmountEditable={isAmountEditable}
                setIsAmountEditable={setIsAmountEditable}
                collectors={collectors}
                isLoadingCollectors={isLoadingCollectors}
                onPreview={handlePreview}
              />
            )}
        </form>

        <PreviewModal
          show={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onConfirm={handleSubmit(onSubmit)}
          watch={watch}
          selectedCategory={selectedCategory}
          selectedYear={selectedYear}
          guestBatch={guestBatch}
          guestGroup={guestGroup}
          mainParticipant={mainParticipant}
          amount={amount}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SilverJubileeForm;
