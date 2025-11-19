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
  SilverJubileePaymentType,
  SilverJubileeParticipantCategory,
  SilverJubileeFormData,
} from "@/types/silverJubilee";
import ReactHookFormPhoneNumberField from "@/components/shared/Forms/ReactHookFormPhoneNumberField";

// Types
interface BabyFormProps {
  control: Control<SilverJubileeFormData>;
  register: UseFormRegister<SilverJubileeFormData>;
  watch: UseFormWatch<SilverJubileeFormData>;
  errors: FieldErrors<SilverJubileeFormData>;
  setValue: (name: any, value: any) => void;
  mainParticipant: { id: string; name: string; phoneNumber: string } | null;
  guestBatch: { value: number; label: string } | null;
  guestGroup: { value: SilverJubileeGroup; label: string } | null;
  mainParticipantsList: { id: string; name: string; phoneNumber: string }[];
  isLoadingParticipants: boolean;
  noParticipantsFound: boolean;
  isAmountEditable: boolean;
  setIsAmountEditable: (value: boolean) => void;
  collectors: { _id: string; firstName: string; lastName: string }[];
  isLoadingCollectors: boolean;
  amount: number;
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

const paymentTypeOptions = [
  { value: SilverJubileePaymentType.BKASH, label: "Bkash" },
  { value: SilverJubileePaymentType.NAGAD, label: "Nagad" },
  { value: SilverJubileePaymentType.CASH, label: "Cash" },
  { value: SilverJubileePaymentType.BANK_ACCOUNT, label: "Bank Account" },
];

const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;

// Generate years for batch selection (2003-2027)
const batchYears = Array.from({ length: 2027 - 2003 + 1 }, (_, i) => ({
  value: 2003 + i,
  label: `${2003 + i}`,
}));

export default function BabyForm({
  control,
  register,
  watch,
  errors,
  setValue,
  mainParticipant,
  guestBatch,
  guestGroup,
  mainParticipantsList,
  isLoadingParticipants,
  noParticipantsFound,
  isAmountEditable,
  setIsAmountEditable,
  collectors,
  isLoadingCollectors,
  amount,
  onPreview,
}: BabyFormProps) {
  return (
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
            rules={{ required: "Batch is required" }}
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
                      {field.value ? field.value.label : "Select a batch"}
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
                      {batchYears.map((year, yearIdx) => (
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
                                  selected ? "font-semibold" : "font-normal"
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
            rules={{ required: "Group is required" }}
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
          {noParticipantsFound ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-bold text-lg">
                No participants found for the selected batch and group. Please
                try a different combination.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Participant <span className="text-red-500">*</span>
              </label>
              <Controller
                name="mainParticipant"
                control={control}
                rules={{ required: "Main participant is required" }}
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
                          !guestBatch || !guestGroup || isLoadingParticipants
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span
                          className={`block truncate ${
                            field.value ? "text-gray-900" : "text-gray-400"
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
                              No participants found for this batch and group
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
          )}

          {/* Baby Details - Show after main participant is selected */}
          {mainParticipant && (
            <>
              {/* Baby Name - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baby Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("guestName", {
                    required: "Baby name is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.guestName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter baby name"
                />
                {errors.guestName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.guestName.message}
                  </p>
                )}
              </div>

              {/* Baby Phone Number, Payment Type, and Amount - Same Line */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Baby Phone Number */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
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
                  <ReactHookFormPhoneNumberField
                    name="guestPhoneNumber"
                    control={control}
                    muiTelInputProps={{}}
                    rules={{
                      required: "Phone number is required",
                    }}
                    apiErrors={
                      errors.guestPhoneNumber?.message
                        ? [errors.guestPhoneNumber.message as string]
                        : undefined
                    }
                  />
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
      )}
    </>
  );
}
