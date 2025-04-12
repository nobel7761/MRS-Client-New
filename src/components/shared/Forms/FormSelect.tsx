// "use client";

// import { Controller, useFormContext } from "react-hook-form";

// type SelectOptions = {
//   label: string;
//   value: string;
// };

// type SelectFieldProps = {
//   options: SelectOptions[];
//   name: string;
//   size?: "large" | "small";
//   value?: string | string[] | undefined;
//   label?: string;
//   defaultValue?: SelectOptions;
//   placeholder?: string;
// };

// const FormSelect = ({
//   name,
//   size = "large",
//   value,
//   label,
//   options,
//   defaultValue,
//   placeholder,
// }: SelectFieldProps) => {
//   const { control } = useFormContext();

//   return (
//     <div className="mb-2">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label}
//         </label>
//       )}
//       <Controller
//         control={control}
//         name={name}
//         render={({ field: { value, onChange } }) => (
//           <select
//             onChange={onChange}
//             value={value || ""}
//             className={`mt-1 block w-full ${
//               size === "large" ? "py-2 px-3" : "py-1 px-2"
//             } border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//           >
//             {placeholder && (
//               <option value="" disabled>
//                 {placeholder}
//               </option>
//             )}
//             {options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         )}
//       />
//     </div>
//   );
// };

// export default FormSelect;

"use client";

import { Controller, useFormContext } from "react-hook-form";

type SelectOptions = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  options: SelectOptions[];
  name: string;
  size?: "large" | "small";
  value?: string | string[] | undefined;
  label?: string;
  defaultValue?: SelectOptions;
  placeholder?: string;
};

const FormSelect = ({
  name,
  size = "large",
  value,
  label,
  options,
  defaultValue,
  placeholder,
}: SelectFieldProps) => {
  const { control } = useFormContext();

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
        render={({ field: { value, onChange } }) => (
          <select
            onChange={onChange}
            value={value || ""}
            className={`mt-1 block w-full ${
              size === "large" ? "py-2 px-3" : "py-1 px-2"
            } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};

export default FormSelect;
