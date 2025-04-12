"use client";

import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";

interface IFormDatePicker {
  name: string;
  type: "Date" | "Time";
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  dateFormat?: string;
  timeCaption?: string;
  label?: string;
  placeholder?: string;
}

const FormDatePicker = ({
  name,
  type,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 15,
  // dateFormat = "Pp", // Default format for date and time
  timeCaption = "Time",
  label,
  placeholder,
}: IFormDatePicker) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className="mb-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          type === "Date" ? (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showTimeSelect={showTimeSelect}
              showTimeSelectOnly={showTimeSelectOnly}
              timeIntervals={timeIntervals}
              // dateFormat={dateFormat}
              timeCaption={timeCaption}
              placeholderText={placeholder}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              // showTimeSelect={showTimeSelect}
              // showTimeSelectOnly={showTimeSelectOnly}
              // timeIntervals={timeIntervals}
              // dateFormat={dateFormat}
              // timeCaption={timeCaption}
              placeholderText={placeholder}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )
        }
      />
      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};

export default FormDatePicker;
