"use client";

import {
  Control,
  FieldErrors,
  UseFormWatch,
  UseFormRegister,
  Controller,
} from "react-hook-form";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  SilverJubileeGroup,
  SilverJubileeGender,
  SilverJubileeBloodGroup,
  SilverJubileePaymentType,
  SilverJubileeParticipantCategory,
  SilverJubileeFormData,
} from "@/types/silverJubilee";

// Types
interface LifetimeMembershipFormProps {
  control: Control<SilverJubileeFormData>;
  register: UseFormRegister<SilverJubileeFormData>;
  watch: UseFormWatch<SilverJubileeFormData>;
  errors: FieldErrors<SilverJubileeFormData>;
  setValue: (name: any, value: any) => void;
  selectedYear: { value: number; label: string } | null;
  isAmountEditable: boolean;
  setIsAmountEditable: (value: boolean) => void;
  collectors: { _id: string; firstName: string; lastName: string }[];
  isLoadingCollectors: boolean;
  onPreview: () => void;
}

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

const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LifetimeMembershipForm({
  control,
  register,
  watch,
  errors,
  setValue,
  selectedYear,
  isAmountEditable,
  setIsAmountEditable,
  collectors,
  isLoadingCollectors,
  onPreview,
}: LifetimeMembershipFormProps) {
  return (
    <>
      {/* Personal Information Fields */}
      {selectedYear && (
        <>
          {/* Full Name - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("fullName", {
                required: "Full name is required",
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
                rules={{ required: "Group is required" }}
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
                          {field.value ? field.value.label : "Select a group"}
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
                                      selected ? "font-semibold" : "font-normal"
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
                  required: "Phone number is required",
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
                  required: "Email is required",
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
                rules={{ required: "Gender is required" }}
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
                          {field.value ? field.value.label : "Select a gender"}
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
                                      selected ? "font-semibold" : "font-normal"
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
                rules={{ required: "Blood group is required" }}
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
                rules={{ required: "Payment type is required" }}
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
                            field.value ? field.value.label : "text-gray-400"
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
                  onClick={() => setIsAmountEditable(!isAmountEditable)}
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
                  Father's Name
                </label>
                <input
                  type="text"
                  {...register("fatherName")}
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
                  Father's Occupation
                </label>
                <input
                  type="text"
                  {...register("fatherOccupation")}
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
                  Father's Phone
                </label>
                <input
                  type="tel"
                  {...register("fatherPhoneNumber", {
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
                  Mother's Name
                </label>
                <input
                  type="text"
                  {...register("motherName")}
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
                  Mother's Occupation
                </label>
                <input
                  type="text"
                  {...register("motherOccupation")}
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
                  Mother's Phone
                </label>
                <input
                  type="tel"
                  {...register("motherPhoneNumber", {
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

          {/* Registered Under Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registered Under
            </label>
            <Controller
              name="registeredUnder"
              control={control}
              render={({ field }) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300">
                      <span className="block truncate">
                        {field.value
                          ? `${field.value.name} (${field.value.id})`
                          : isLoadingCollectors
                          ? "Loading collectors..."
                          : "Select a collector"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon />
                      </span>
                    </Listbox.Button>
                    <Transition
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                        {collectors.map((collector) => (
                          <Listbox.Option
                            key={collector._id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-amber-100 text-amber-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={{
                              id: collector._id,
                              name: `${collector.firstName} ${collector.lastName}`,
                            }}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {collector.firstName} {collector.lastName}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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
          </div>

          {/* Comments Field */}
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
              onClick={onPreview}
              className="px-8 py-3 rounded-lg font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Preview Submission
            </button>
          </div>
        </>
      )}
    </>
  );
}
