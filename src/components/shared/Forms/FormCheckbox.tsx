"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";

interface ICheckbox {
  name: string;
  label?: string;
  validation?: object;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added onChange prop
}

const FormCheckbox = ({ name, label, validation, id, onChange }: ICheckbox) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className="mb-2 flex items-center">
      <Controller
        control={control}
        name={name}
        rules={validation}
        render={({ field }) => (
          <input
            type="checkbox"
            id={id}
            {...field}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={field.value} // Ensure the checkbox reflects the correct state
            onChange={(e) => {
              field.onChange(e); // Update the form state
              if (onChange) onChange(e); // Call the custom onChange handler if provided
            }}
          />
        )}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {errorMessage && (
        <small className="text-red-500 ml-2">{errorMessage}</small>
      )}
    </div>
  );
};

export default FormCheckbox;
