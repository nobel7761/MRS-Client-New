import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";

type TextAreaProps = {
  name: string;
  label?: string;
  rows?: number;
  value?: string;
  placeholder?: string;
  validation?: Object;
};

const FormTextArea = ({
  name,
  label,
  rows = 4,
  value,
  placeholder,
  validation,
}: TextAreaProps) => {
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
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => (
          <textarea
            rows={rows}
            placeholder={placeholder}
            {...field}
            defaultValue={value}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        )}
      />

      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};

export default FormTextArea;
