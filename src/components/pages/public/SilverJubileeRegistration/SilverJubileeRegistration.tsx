"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Controller,
  Control,
  FieldPath,
  RegisterOptions,
  useForm,
} from "react-hook-form";
import { toast } from "react-toastify";
import {
  SilverJubileeBloodGroup,
  SilverJubileeGender,
  SilverJubileeGroup,
  SilverJubileeParticipantCategory,
  SilverJubileePaymentType,
} from "@/types/silverJubilee";
import { silverJubileeApi } from "@/lib/silverJubileeApi";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheckCircle, HiSelector } from "react-icons/hi";
import backgroundImage from "@/public/background.jpg";

type ParticipantSummary = {
  id: string;
  name: string;
  phoneNumber: string;
};

type FormValues = {
  participantCategory: SilverJubileeParticipantCategory | "";
  hscPassingYear?: number;
  fullName: string;
  professionalDetails: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  email: string;
  group: SilverJubileeGroup | "";
  gender: SilverJubileeGender | "";
  bloodGroup: SilverJubileeBloodGroup | "";
  paymentType: SilverJubileePaymentType | "";
  amount: number;
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;
  guestBatch?: number;
  guestGroup: SilverJubileeGroup | "";
  mainParticipantId: string;
  guestName: string;
  relation: string;
  guestPhoneNumber: string;
  comments: string;
};

const defaultPublicFormValues: FormValues = {
  participantCategory: "",
  hscPassingYear: undefined,
  fullName: "",
  professionalDetails: "",
  phoneNumber: "",
  alternativePhoneNumber: "",
  email: "",
  group: "",
  gender: "",
  bloodGroup: "",
  paymentType: "",
  amount: 0,
  fatherName: "",
  fatherPhoneNumber: "",
  fatherOccupation: "",
  motherName: "",
  motherPhoneNumber: "",
  motherOccupation: "",
  guestBatch: undefined,
  guestGroup: "",
  mainParticipantId: "",
  guestName: "",
  relation: "",
  guestPhoneNumber: "",
  comments: "",
};

const participantCategories = [
  {
    value: SilverJubileeParticipantCategory.ALUMNI,
    label: "Alumni",
  },
  {
    value: SilverJubileeParticipantCategory.STUDENT,
    label: "Student",
  },
  {
    value: SilverJubileeParticipantCategory.GUEST,
    label: "Guest",
  },
  {
    value: SilverJubileeParticipantCategory.BABY,
    label: "Baby",
  },
  {
    value: SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP,
    label: "Lifetime Membership",
  },
];

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

const aboutSection = [
  "NICAA is the official alumni network of National Ideal College, founded in 2016 to connect and empower graduates.",
  "We organized the college’s first alumni Iftar Mahfil and the historic 2020 full-scale reunion with over 1,000 participants, title-sponsored by PRAN-RFL.",
  "Beyond reunions, NICAA leads telemedicine, financial aid, essential supplies during COVID-19, and disaster relief for 1,500+ flood victims in 2024.",
  "Our initiatives feature on Jamuna TV and Desh TV, while we mentor current students, collaborate with college clubs, and champion leadership, creativity, and career development.",
];

const celebrationFacts = [
  { title: "Date", value: "27 December 2025" },
  {
    title: "Venue",
    value: "Khilgaon High School Field & Jagoroni Shangshad Field",
  },
  {
    title: "Chief Guest",
    value: "A distinguished Advisor from the Government of Bangladesh (TBC)",
  },
  { title: "Audience", value: "1500+ participants across diverse sectors" },
  {
    title: "Highlight",
    value:
      "Special Musical Performance – One of the Leading Musical Band in Bangladesh",
  },
  { title: "Media Partner", value: "Ekhon TV" },
];

const programHighlights = [
  "Grand Inauguration Ceremony with Chief Guest & Government Representatives",
  "Teacher Recognition Segment – Honoring our respected faculty",
  "Cultural & Musical Performances featuring one of the leading musical bands in Bangladesh and college alumnus",
  "Networking Opportunities for Alumni across 25 years",
  "Souvenir Launch – 1500 copies (100-page special edition)",
];

const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const alumniYears = Array.from(
  { length: 2025 - 2003 + 1 },
  (_, index) => 2003 + index
);
const studentYears = [2026, 2027];
const lifetimeMembershipYears = Array.from(
  { length: 2027 - 2003 + 1 },
  (_, index) => 2003 + index
);

const guestBatchOptions = alumniYears;

type DropdownOption<Value> = {
  value: Value;
  label: string;
  description?: string;
};

type FormDropdownProps<TFieldName extends FieldPath<FormValues>, TValue> = {
  name: TFieldName;
  control: Control<FormValues>;
  label: string;
  placeholder: string;
  options: DropdownOption<TValue>[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rules?: RegisterOptions<FormValues, TFieldName>;
  onSelectionChange?: (value: TValue | "") => void;
  helperText?: string;
  emptyMessage?: string;
};

const FormDropdown = <TFieldName extends FieldPath<FormValues>, TValue>({
  name,
  control,
  label,
  placeholder,
  options,
  required,
  error,
  disabled,
  rules,
  onSelectionChange,
  helperText,
  emptyMessage,
}: FormDropdownProps<TFieldName, TValue>) => {
  return (
    <Controller<FormValues, TFieldName>
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const selectedOption =
          options.find((option) => option.value === field.value) ?? null;

        const buttonClasses = [
          "relative w-full rounded-xl border bg-white/90 px-4 py-3 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40",
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-primary/60 hover:shadow-md",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-300"
            : "border-primary/20",
        ].join(" ");

        return (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brandColorSecondary">
              {label}{" "}
              {required && (
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            <Listbox
              value={selectedOption}
              onChange={(option) => {
                const nextValue = (option?.value ?? "") as TValue | "";
                field.onChange(nextValue);
                if (onSelectionChange) {
                  onSelectionChange(nextValue);
                }
              }}
              disabled={disabled}
              by="value"
            >
              <div className="relative">
                <Listbox.Button className={`${buttonClasses} pr-10`}>
                  <span
                    className={`block truncate ${
                      selectedOption
                        ? "text-brandColorSecondary"
                        : "text-slate-400"
                    }`}
                  >
                    {selectedOption?.label ?? placeholder}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <HiSelector className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-primary/15 bg-white/95 py-2 shadow-xl ring-1 ring-black/5 backdrop-blur focus:outline-none">
                    {options.length > 0 ? (
                      options.map((option) => (
                        <Listbox.Option
                          key={`${option.value}`}
                          value={option}
                          className={({ active, selected }) =>
                            [
                              "relative cursor-pointer select-none rounded-lg px-4 py-2 text-sm transition",
                              active
                                ? "bg-primary/15 text-primary"
                                : "text-brandColorSecondary",
                              selected ? "font-semibold" : "font-normal",
                            ].join(" ")
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className="block truncate">
                                {option.label}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-slate-500">
                        {emptyMessage || "No options available"}
                      </div>
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            {helperText && (
              <p className="text-xs text-brandColorSecondary/70">
                {helperText}
              </p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
      }}
    />
  );
};

const SilverJubileeRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [mainParticipants, setMainParticipants] = useState<
    ParticipantSummary[]
  >([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [noParticipantsFound, setNoParticipantsFound] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animateSuccessModal, setAnimateSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Registration submitted successfully!"
  );
  const modalCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeSuccessModal = useCallback(() => {
    setAnimateSuccessModal(false);
    if (modalCloseTimeout.current) {
      clearTimeout(modalCloseTimeout.current);
    }
    modalCloseTimeout.current = setTimeout(() => {
      setShowSuccessModal(false);
      modalCloseTimeout.current = null;
    }, 200);
  }, []);

  useEffect(() => {
    if (!showSuccessModal) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      setAnimateSuccessModal(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [showSuccessModal]);

  useEffect(() => {
    if (!showSuccessModal) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSuccessModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuccessModal, closeSuccessModal]);

  useEffect(() => {
    return () => {
      if (modalCloseTimeout.current) {
        clearTimeout(modalCloseTimeout.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultPublicFormValues,
  });

  const selectedCategory = watch("participantCategory");
  const selectedYear = watch("hscPassingYear");
  const guestBatch = watch("guestBatch");
  const guestGroup = watch("guestGroup");
  const mainParticipantId = watch("mainParticipantId");

  const selectedCategoryLabel = useMemo(() => {
    if (!selectedCategory) {
      return "Participant";
    }
    const matched = participantCategories.find(
      (category) => category.value === selectedCategory
    );
    return matched?.label || "Participant";
  }, [selectedCategory]);

  const hasSelectedCategory = useMemo(
    () => selectedCategory !== "",
    [selectedCategory]
  );

  const shouldShowHSCYear = useMemo(
    () =>
      selectedCategory === SilverJubileeParticipantCategory.ALUMNI ||
      selectedCategory === SilverJubileeParticipantCategory.STUDENT ||
      selectedCategory === SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP,
    [selectedCategory]
  );

  const isGuest = selectedCategory === SilverJubileeParticipantCategory.GUEST;
  const isBaby = selectedCategory === SilverJubileeParticipantCategory.BABY;
  const isPrimaryParticipant =
    selectedCategory === SilverJubileeParticipantCategory.ALUMNI ||
    selectedCategory === SilverJubileeParticipantCategory.STUDENT ||
    selectedCategory === SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP;
  const shouldShowProfessionalDetails =
    selectedCategory === SilverJubileeParticipantCategory.ALUMNI;

  const baseInputClasses =
    "w-full rounded-xl border border-primary/20 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-slate-400";

  const yearOptions = useMemo(() => {
    if (selectedCategory === SilverJubileeParticipantCategory.STUDENT) {
      return studentYears;
    }
    if (
      selectedCategory === SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP
    ) {
      return lifetimeMembershipYears;
    }
    return alumniYears;
  }, [selectedCategory]);

  useEffect(() => {
    if (
      selectedCategory === SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP
    ) {
      setValue("amount", 5000);
      setIsAmountEditable(false);
      return;
    }

    if (
      selectedCategory === SilverJubileeParticipantCategory.ALUMNI &&
      selectedYear
    ) {
      if (selectedYear >= 2003 && selectedYear <= 2021) {
        setValue("amount", 2000);
      } else if (selectedYear >= 2022) {
        setValue("amount", 1600);
      }
      setIsAmountEditable(false);
      return;
    }

    if (selectedCategory === SilverJubileeParticipantCategory.STUDENT) {
      setValue("amount", 1400);
      setIsAmountEditable(false);
      return;
    }

    if (isGuest && mainParticipantId) {
      setValue("amount", 1000);
      setIsAmountEditable(false);
      return;
    }

    if (isBaby && mainParticipantId) {
      setValue("amount", 500);
      setIsAmountEditable(false);
      return;
    }

    if (!hasSelectedCategory && !isAmountEditable) {
      setValue("amount", 0);
    }
  }, [
    selectedCategory,
    selectedYear,
    isGuest,
    isBaby,
    mainParticipantId,
    setValue,
    isAmountEditable,
    hasSelectedCategory,
  ]);

  useEffect(() => {
    if (!(isGuest || isBaby)) {
      setMainParticipants([]);
      setIsLoadingParticipants(false);
      setNoParticipantsFound(false);
      setValue("mainParticipantId", "");
      return;
    }

    if (!guestBatch || !guestGroup) {
      setMainParticipants([]);
      setValue("mainParticipantId", "");
      setNoParticipantsFound(false);
      return;
    }

    let isMounted = true;
    setIsLoadingParticipants(true);
    setNoParticipantsFound(false);

    silverJubileeApi
      .getParticipantsByBatchAndGroup(guestBatch, guestGroup)
      .then((response) => {
        if (!isMounted) return;

        const formatted = response.participants.map((participant) => ({
          id: participant._id ?? "",
          name: `${participant.fullName} • ${participant.group} • ${participant.hscPassingYear}`,
          phoneNumber: participant.phoneNumber,
        }));

        setMainParticipants(formatted);
        setNoParticipantsFound(formatted.length === 0);
        if (formatted.length === 0) {
          setValue("mainParticipantId", "");
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Failed to fetch main participants", error);
        toast.error(
          "Unable to load main participants. Please try again later."
        );
        setMainParticipants([]);
        setValue("mainParticipantId", "");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingParticipants(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [guestBatch, guestGroup, isGuest, isBaby, setValue]);

  const resetForm = () => {
    reset();
    setIsAmountEditable(false);
    setMainParticipants([]);
    setNoParticipantsFound(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.participantCategory) {
      toast.error("Participant category is required");
      return;
    }

    const trimmedComments = values.comments.trim();
    const trimmedProfessionalDetails = values.professionalDetails.trim();

    const basePayload = {
      comments: trimmedComments.length ? trimmedComments : undefined,
      submittedFrom: "Not Paid",
    };

    let payload: Record<string, unknown> | undefined;

    if (values.participantCategory === SilverJubileeParticipantCategory.GUEST) {
      payload = {
        participantCategory: values.participantCategory,
        mainParticipantBatch: values.guestBatch,
        mainParticipantGroup: values.guestGroup || undefined,
        mainParticipantId: values.mainParticipantId || undefined,
        guestName: values.guestName.trim(),
        relation: values.relation.trim(),
        guestMobileNumber: values.guestPhoneNumber.trim(),
        amount: values.amount,
        paymentType: values.paymentType || undefined,
        ...basePayload,
      };
    } else if (
      values.participantCategory === SilverJubileeParticipantCategory.BABY
    ) {
      payload = {
        participantCategory: values.participantCategory,
        mainParticipantBatch: values.guestBatch,
        mainParticipantGroup: values.guestGroup || undefined,
        mainParticipantId: values.mainParticipantId || undefined,
        babyName: values.guestName.trim(),
        babyPhone: values.guestPhoneNumber.trim(),
        amount: values.amount,
        paymentType: values.paymentType || undefined,
        ...basePayload,
      };
    } else {
      payload = {
        participantCategory: values.participantCategory,
        fullName: values.fullName.trim(),
        professionalDetails: trimmedProfessionalDetails.length
          ? trimmedProfessionalDetails
          : undefined,
        phoneNumber: values.phoneNumber.trim(),
        alternativePhoneNumber:
          values.alternativePhoneNumber.trim() || undefined,
        email: values.email.trim(),
        hscPassingYear: values.hscPassingYear,
        group: values.group || undefined,
        gender: values.gender || undefined,
        bloodGroup: values.bloodGroup || undefined,
        paymentType: values.paymentType || undefined,
        amount: values.amount,
        fatherName: values.fatherName.trim() || undefined,
        fatherPhoneNumber: values.fatherPhoneNumber.trim() || undefined,
        fatherOccupation: values.fatherOccupation.trim() || undefined,
        motherName: values.motherName.trim() || undefined,
        motherPhoneNumber: values.motherPhoneNumber.trim() || undefined,
        motherOccupation: values.motherOccupation.trim() || undefined,
        ...basePayload,
      };
    }

    console.log("Silver Jubilee public registration submission:", payload);

    setIsSubmitting(true);
    try {
      const response = await silverJubileeApi.register(payload as any);

      if (response.success) {
        resetForm();
        setSuccessMessage(
          response.message || "Registration submitted successfully!"
        );
        setShowSuccessModal(true);
      } else {
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Registration error", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit registration. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center lg:bg-fixed">
      {/* top part starts here */}
      <div
        className="relative flex flex-col items-center justify-center gap-8 bg-cover bg-center px-6 py-12 text-center sm:px-8 md:py-16 lg:bg-fixed lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10 lg:py-20 lg:text-left"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="max-w-2xl space-y-6 text-white lg:text-left">
          <p className="inline-flex items-center justify-center rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            National Ideal College Alumni Association
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Silver Jubilee Celebration 2025
          </h1>
          <p className="text-lg text-white/85">
            Join over 1,500 alumni, students, faculty, and special guests as we
            celebrate 25 years of excellence, legacy, and lifelong connections.
            Reserve your spot at the most anticipated reunion of the decade.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-white/85 md:justify-start">
            <span className="rounded-full border border-white/50 px-4 py-2 backdrop-blur-md">
              27 December 2025
            </span>
            <span className="rounded-full border border-white/50 px-4 py-2 backdrop-blur-md">
              Khilgaon High School Field & Jagoroni Shangshad Field
            </span>
            <span className="rounded-full border border-white/50 px-4 py-2 backdrop-blur-md">
              Featuring One of the Leading Musical Band in Bangladesh
            </span>
          </div>
        </div>
        <div className="w-full max-w-md rounded-2xl bg-white/15 p-6 text-white shadow-lg backdrop-blur-md mt-8 sm:p-8 lg:mt-0">
          <h2 className="text-lg font-semibold">Why Attend?</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>Reconnect with 25 years of National Ideal College legacy</li>
            <li>Celebrate teachers, achievers, and changemakers</li>
            <li>Enjoy cultural performances and immersive experiences</li>
            <li>Network with leaders across industries</li>
          </ul>
          <p className="mt-6 text-sm text-white/70">
            Seats are limited. Secure your registration today and make history
            with us.
          </p>
        </div>
      </div>

      {/* profile section starts here */}
      <section className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="rounded-[44px] border border-gray-200 bg-white p-4 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.4)] sm:p-8 lg:p-12">
          <div className="mx-auto grid items-start gap-16 text-gray-900 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-12">
              <div className="space-y-5">
                <span
                  className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-cover bg-center px-4 py-1 text-xs uppercase tracking-[0.35em] text-white"
                  style={{ backgroundImage: `url(${backgroundImage.src})` }}
                >
                  <span className="">Our Story</span>
                </span>
                <h2 className="text-3xl font-semibold leading-tight text-gray-900">
                  About National Ideal College Alumni Association (NICAA)
                </h2>
                <div className="space-y-4 text-base text-gray-700">
                  {aboutSection.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl border border-white/30 bg-cover bg-center p-8 text-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)] lg:p-10"
                style={{ backgroundImage: `url(${backgroundImage.src})` }}
              >
                {/* <span className="absolute inset-0 bg-black/35 backdrop-blur-sm" /> */}
                <div className="relative space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-[0.35em] text-white/70">
                      Event Snapshot
                    </span>
                    <h3 className="text-2xl font-semibold">
                      Silver Jubilee Celebration 2025
                    </h3>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {celebrationFacts.map((fact) => (
                      <div
                        key={fact.title}
                        className="rounded-2xl border border-white/25 bg-white/10 px-5 py-6 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.55)]"
                      >
                        <p className="text-[0.65rem] uppercase tracking-[0.32em] text-white/70">
                          {fact.title}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="space-y-3">
                <span
                  className="relative inline-flex items-center overflow-hidden rounded-full border border-white/40 bg-cover bg-center px-4 py-1 text-xs uppercase tracking-[0.35em] text-white shadow-lg shadow-black/20"
                  style={{ backgroundImage: `url(${backgroundImage.src})` }}
                >
                  <span className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                  <span className="relative">Program Flow</span>
                </span>
                <h3 className="text-3xl font-semibold leading-tight text-gray-900">
                  Silver Jubilee Celebration – Program Profile
                </h3>
                <p className="text-sm text-gray-600">
                  A curated celebration that honors our past, celebrates the
                  present, and inspires the future of the NICAA family.
                </p>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-gray-400 via-gray-200 to-transparent sm:block" />
                <ul className="space-y-6 pl-6 sm:pl-10">
                  {programHighlights.map((highlight, index) => (
                    <li
                      key={highlight}
                      className="relative overflow-hidden rounded-2xl border border-white/25 bg-cover bg-center p-5 text-white shadow-[0_22px_50px_-38px_rgba(15,23,42,0.55)]"
                      style={{ backgroundImage: `url(${backgroundImage.src})` }}
                    >
                      <span className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                      <span className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border border-white/60 bg-gradient-to-br from-primary/50 via-brandColorSecondary/60 to-primary/70 shadow-sm sm:-left-[33px] sm:h-6 sm:w-6" />
                      <div className="relative z-10 space-y-2">
                        <p className="text-sm font-medium text-white/80">
                          Step {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </p>
                        <p className="text-lg font-semibold">{highlight}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-0">
        <div className="rounded-[44px] border border-gray-200 bg-white p-4 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.4)] sm:p-8 lg:p-12">
          <div className="border-b border-primary/20 bg-white/70 p-6 backdrop-blur sm:p-8">
            <h2 className="text-3xl font-semibold text-brandColorSecondary">
              Reserve Your Place
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-brandColorSecondary/70">
              Complete the form below to confirm your participation. Please
              provide accurate details so our team can ensure a seamless
              experience for you and your guests.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10 p-4 sm:space-y-12 sm:p-6 lg:p-8"
          >
            <div className="rounded-3xl border border-primary/15 bg-white/95 p-5 shadow-sm shadow-primary/10 sm:p-6">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-lg shadow-primary/40">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brandColorSecondary">
                    Choose Your Category
                  </h3>
                  <p className="text-sm text-brandColorSecondary/70">
                    Select the participant type to unlock a tailored
                    registration form.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <FormDropdown
                  name="participantCategory"
                  control={control}
                  label="Participant Category"
                  placeholder="Select a category"
                  required
                  options={participantCategories}
                  rules={{
                    validate: (value) =>
                      value ? true : "Participant category is required",
                  }}
                  error={errors.participantCategory?.message}
                  onSelectionChange={(chosenValue) => {
                    const chosen = chosenValue as
                      | SilverJubileeParticipantCategory
                      | "";
                    reset({
                      ...defaultPublicFormValues,
                      participantCategory: chosen,
                    });
                    setIsAmountEditable(false);
                    setMainParticipants([]);
                    setNoParticipantsFound(false);
                  }}
                />

                {shouldShowHSCYear && (
                  <FormDropdown
                    name="hscPassingYear"
                    control={control}
                    label="HSC Passing Year"
                    placeholder="Select passing year"
                    required
                    options={yearOptions.map((year) => ({
                      value: year,
                      label: `${year}`,
                    }))}
                    rules={{
                      validate: (value) =>
                        shouldShowHSCYear && !value
                          ? "HSC passing year is required"
                          : true,
                    }}
                    error={errors.hscPassingYear?.message as string}
                  />
                )}
              </div>
              <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm text-brandColorSecondary/70 shadow-sm sm:p-5">
                <p className="font-semibold text-brandColorSecondary">
                  Not sure which category to choose?
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Alumni: HSC batches 2003–2025 and lifetime members.</li>
                  <li>Student: Current HSC 2026–2027 cohorts.</li>
                  <li>
                    Guest / Baby: Must be linked to a registered participant.
                  </li>
                </ul>
              </div>
            </div>

            {hasSelectedCategory ? (
              <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
                  <div className="flex w-full items-center justify-center gap-4 sm:w-auto sm:justify-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white sm:h-12 sm:w-12">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        Provide Your Details
                      </h3>
                      <p className="text-sm text-slate-600">
                        The fields adapt automatically based on the category you
                        chose.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary sm:ml-auto">
                    {selectedCategoryLabel}
                  </span>
                </div>

                <div className="pointer-events-none absolute -top-16 -right-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl -z-10" />
                <div className="pointer-events-none absolute bottom-0 left-[-60px] h-40 w-40 rounded-full bg-brandColorPrimary/20 blur-3xl opacity-70 -z-10" />

                {isPrimaryParticipant && (
                  <>
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("fullName", {
                            required: "Full name is required",
                            minLength: {
                              value: 3,
                              message:
                                "Full name must be at least 3 characters",
                            },
                          })}
                          className={`${baseInputClasses} ${
                            errors.fullName
                              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                              : ""
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-500">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {shouldShowProfessionalDetails && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-800">
                            Professional Details{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("professionalDetails", {
                              required: "Professional details are required",
                              minLength: {
                                value: 10,
                                message:
                                  "Please provide at least 10 characters",
                              },
                            })}
                            className={`${baseInputClasses} ${
                              errors.professionalDetails
                                ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                : ""
                            }`}
                            placeholder="Share your current role, organization, and key contributions"
                          />
                          {errors.professionalDetails && (
                            <p className="text-xs text-red-500">
                              {errors.professionalDetails.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <FormDropdown
                        name="group"
                        control={control}
                        label="Group"
                        placeholder="Select group"
                        required
                        options={groupOptions}
                        rules={{
                          validate: (value) =>
                            shouldShowHSCYear && !value
                              ? "Group is required"
                              : true,
                        }}
                        error={errors.group?.message as string}
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register("phoneNumber", {
                            required: "Phone number is required",
                            pattern: {
                              value: phoneRegex,
                              message:
                                "Use 01XXXXXXXXX or +8801XXXXXXXXX format",
                            },
                          })}
                          className={`${baseInputClasses} ${
                            errors.phoneNumber
                              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                              : ""
                          }`}
                          placeholder="01XXXXXXXXX"
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Alternative Phone Number
                        </label>
                        <input
                          type="tel"
                          {...register("alternativePhoneNumber", {
                            validate: (value) =>
                              value && !phoneRegex.test(value)
                                ? "Use 01XXXXXXXXX or +8801XXXXXXXXX format"
                                : true,
                          })}
                          className={`${baseInputClasses} ${
                            errors.alternativePhoneNumber
                              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                              : ""
                          }`}
                          placeholder="Optional"
                        />
                        {errors.alternativePhoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.alternativePhoneNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: emailRegex,
                              message: "Enter a valid email address",
                            },
                          })}
                          className={`${baseInputClasses} ${
                            errors.email
                              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                              : ""
                          }`}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <FormDropdown
                        name="gender"
                        control={control}
                        label="Gender"
                        placeholder="Select gender"
                        required
                        options={genderOptions}
                        rules={{
                          validate: (value) =>
                            shouldShowHSCYear && !value
                              ? "Gender is required"
                              : true,
                        }}
                        error={errors.gender?.message as string}
                      />

                      <FormDropdown
                        name="bloodGroup"
                        control={control}
                        label="Blood Group"
                        placeholder="Select blood group"
                        required
                        options={bloodGroupOptions}
                        rules={{
                          validate: (value) =>
                            shouldShowHSCYear && !value
                              ? "Blood group is required"
                              : true,
                        }}
                        error={errors.bloodGroup?.message as string}
                      />

                      <FormDropdown
                        name="paymentType"
                        control={control}
                        label="Payment Type"
                        placeholder="Select payment method"
                        required
                        options={paymentTypeOptions}
                        rules={{
                          validate: (value) =>
                            !value ? "Payment type is required" : true,
                        }}
                        error={errors.paymentType?.message as string}
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Amount (BDT) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            {...register("amount", {
                              required: "Amount is required",
                              valueAsNumber: true,
                              min: {
                                value: 1,
                                message: "Amount must be greater than 0",
                              },
                            })}
                            readOnly={!isAmountEditable}
                            className={`${baseInputClasses} pr-12 ${
                              errors.amount
                                ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                : ""
                            } ${
                              !isAmountEditable
                                ? "bg-slate-100 text-slate-600"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setIsAmountEditable((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-brandColorSecondary"
                          >
                            {isAmountEditable ? "Lock" : "Edit"}
                          </button>
                        </div>
                        {errors.amount && (
                          <p className="text-xs text-red-500">
                            {errors.amount.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Father&apos;s Name
                        </label>
                        <input
                          type="text"
                          {...register("fatherName")}
                          className={baseInputClasses}
                          placeholder="Enter father's name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Father&apos;s Occupation
                        </label>
                        <input
                          type="text"
                          {...register("fatherOccupation")}
                          className={baseInputClasses}
                          placeholder="Enter occupation"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Father&apos;s Phone
                        </label>
                        <input
                          type="tel"
                          {...register("fatherPhoneNumber", {
                            validate: (value) =>
                              value && !phoneRegex.test(value)
                                ? "Use 01XXXXXXXXX or +8801XXXXXXXXX format"
                                : true,
                          })}
                          className={`${baseInputClasses} ${
                            errors.fatherPhoneNumber
                              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                              : ""
                          }`}
                          placeholder="Optional"
                        />
                        {errors.fatherPhoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.fatherPhoneNumber.message as string}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Mother&apos;s Name
                        </label>
                        <input
                          type="text"
                          {...register("motherName")}
                          className={baseInputClasses}
                          placeholder="Enter mother's name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Mother&apos;s Occupation
                        </label>
                        <input
                          type="text"
                          {...register("motherOccupation")}
                          className={baseInputClasses}
                          placeholder="Enter occupation"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">
                          Mother&apos;s Phone
                        </label>
                        <input
                          type="tel"
                          {...register("motherPhoneNumber", {
                            validate: (value) =>
                              value && !phoneRegex.test(value)
                                ? "Use 01XXXXXXXXX or +8801XXXXXXXXX format"
                                : true,
                          })}
                          className={`${baseInputClasses} ${
                            errors.motherPhoneNumber
                              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                              : ""
                          }`}
                          placeholder="Optional"
                        />
                        {errors.motherPhoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.motherPhoneNumber.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {(isGuest || isBaby) && (
                  <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
                    <h3 className="text-lg font-semibold text-brandColorSecondary">
                      {isGuest ? "Guest Registration" : "Baby Registration"}
                    </h3>
                    <p className="mt-1 text-sm text-brandColorSecondary/80">
                      Select the main participant you are registering under and
                      share guest details.
                    </p>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <FormDropdown
                        name="guestBatch"
                        control={control}
                        label="Main Participant Batch"
                        placeholder="Select batch"
                        required
                        options={guestBatchOptions.map((year) => ({
                          value: year,
                          label: `${year}`,
                        }))}
                        rules={{
                          validate: (value) =>
                            (isGuest || isBaby) && !value
                              ? "Batch is required"
                              : true,
                        }}
                        error={errors.guestBatch?.message as string}
                      />

                      <FormDropdown
                        name="guestGroup"
                        control={control}
                        label="Main Participant Group"
                        placeholder="Select group"
                        required
                        options={groupOptions}
                        rules={{
                          validate: (value) =>
                            (isGuest || isBaby) && !value
                              ? "Group is required"
                              : true,
                        }}
                        error={errors.guestGroup?.message as string}
                      />
                    </div>

                    <div className="mt-6 space-y-6">
                      <FormDropdown
                        name="mainParticipantId"
                        control={control}
                        label="Main Participant"
                        placeholder={
                          isLoadingParticipants
                            ? "Loading participants..."
                            : "Select main participant"
                        }
                        required
                        disabled={
                          isLoadingParticipants || !guestBatch || !guestGroup
                        }
                        options={mainParticipants.map((participant) => ({
                          value: participant.id,
                          label: participant.name,
                        }))}
                        rules={{
                          validate: (value) =>
                            (isGuest || isBaby) && !value
                              ? "Please select the main participant"
                              : true,
                        }}
                        error={errors.mainParticipantId?.message as string}
                        emptyMessage={
                          isLoadingParticipants
                            ? "Loading participants..."
                            : "No participants available"
                        }
                      />
                      {noParticipantsFound && (
                        <p className="text-xs text-primary/80">
                          No registered participants found for this batch and
                          group yet.
                        </p>
                      )}

                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-brandColorSecondary">
                            {isGuest ? "Guest Name" : "Child Name"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("guestName", {
                              required: `${
                                isGuest ? "Guest" : "Child"
                              } name is required`,
                              minLength: {
                                value: 2,
                                message: "Please provide at least 2 characters",
                              },
                            })}
                            className={`${baseInputClasses} ${
                              errors.guestName
                                ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                : ""
                            }`}
                            placeholder="Full name"
                          />
                          {errors.guestName && (
                            <p className="text-xs text-red-500">
                              {errors.guestName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-brandColorSecondary">
                            {isGuest ? "Relation" : "Guardian"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("relation", {
                              required: isGuest
                                ? "Relation is required"
                                : "Guardian name is required",
                            })}
                            className={`${baseInputClasses} ${
                              errors.relation
                                ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                : ""
                            }`}
                            placeholder={
                              isGuest
                                ? "Relation to main participant"
                                : "Guardian name"
                            }
                          />
                          {errors.relation && (
                            <p className="text-xs text-red-500">
                              {errors.relation.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-brandColorSecondary">
                            Contact Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            {...register("guestPhoneNumber", {
                              required: "Contact number is required",
                              pattern: {
                                value: phoneRegex,
                                message:
                                  "Use 01XXXXXXXXX or +8801XXXXXXXXX format",
                              },
                            })}
                            className={`${baseInputClasses} ${
                              errors.guestPhoneNumber
                                ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                : ""
                            }`}
                            placeholder="01XXXXXXXXX"
                          />
                          {errors.guestPhoneNumber && (
                            <p className="text-xs text-red-500">
                              {errors.guestPhoneNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <FormDropdown
                        name="paymentType"
                        control={control}
                        label="Payment Type"
                        placeholder="Select payment method"
                        required
                        options={paymentTypeOptions}
                        rules={{
                          validate: (value) =>
                            !value ? "Payment type is required" : true,
                        }}
                        error={errors.paymentType?.message as string}
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-brandColorSecondary">
                          Amount (BDT) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            {...register("amount", {
                              required: "Amount is required",
                              valueAsNumber: true,
                              min: {
                                value: 1,
                                message: "Amount must be greater than 0",
                              },
                            })}
                            readOnly={!isAmountEditable}
                            className={`${baseInputClasses} pr-12 ${
                              errors.amount
                                ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                : ""
                            } ${
                              !isAmountEditable
                                ? "bg-primary/10 text-primary"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setIsAmountEditable((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-brandColorSecondary"
                          >
                            {isAmountEditable ? "Lock" : "Edit"}
                          </button>
                        </div>
                        {errors.amount && (
                          <p className="text-xs text-red-500">
                            {errors.amount.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      Comments / Additional Notes
                    </label>
                    <textarea
                      {...register("comments")}
                      rows={3}
                      className={`${baseInputClasses} min-h-[120px]`}
                      placeholder="Any special requests, guest information, or questions"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl bg-white/90 text-sm text-brandColorSecondary shadow-sm">
                  <p>
                    By submitting, you confirm that the information provided is
                    accurate and acknowledge that NICAA may contact you with
                    event updates, payment confirmations, and volunteer
                    opportunities.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-brandColorSecondary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center text-sm text-brandColorSecondary sm:p-8">
                <p className="font-semibold">
                  Please select a participant category to continue with the
                  registration.
                </p>
                <p className="mt-2 text-brandColorSecondary/70">
                  Once you choose, the relevant form will appear instantly.
                </p>
              </div>
            )}
          </form>
        </div>
      </section>
      {showSuccessModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm transition-opacity duration-300 ${
            animateSuccessModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeSuccessModal}
        >
          <div
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/10 bg-white/95 p-10 text-center shadow-[0_55px_140px_-65px_rgba(15,23,42,0.55)] transition-all duration-300 ease-out ${
              animateSuccessModal
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-brandColorSecondary/10 blur-3xl" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner shadow-primary/40">
              <HiCheckCircle className="h-9 w-9" />
            </div>
            <h3 className="relative mt-6 text-2xl font-semibold text-brandColorSecondary">
              Registration Received!
            </h3>
            <p className="relative mt-3 text-sm text-brandColorSecondary/70">
              {successMessage}
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={closeSuccessModal}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-brandColorSecondary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  closeSuccessModal();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-xl border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition hover:border-brandColorSecondary hover:text-brandColorSecondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Register Another Participant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SilverJubileeRegistration;
