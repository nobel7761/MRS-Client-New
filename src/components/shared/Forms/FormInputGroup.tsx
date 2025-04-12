// "use client";

// import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
// import { Controller, useFormContext } from "react-hook-form";

// interface IFormInputGroup {
//   name: string;
//   size?: "large" | "small";
//   value?: string;
//   id?: string;
//   placeholder?: string;
//   validation?: object;
//   label?: string;
// }

// const FormInputGroup = ({
//   name,
//   size = "large",
//   value,
//   id,
//   placeholder,
//   validation,
//   label,
// }: IFormInputGroup) => {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();

//   const errorMessage = getErrorMessageByPropertyName(errors, name);

//   return (
//     <div className="mb-2">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label}
//         </label>
//       )}
//       <div className="relative">
//         <Controller
//           control={control}
//           name={name}
//           //   rules={validation}
//           render={({ field }) => (
//             <input
//               type="text"
//               id={id || name}
//               className={`block w-full rounded-md border-0 py-1.5  pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
//                 size === "large" ? "py-2 px-3" : "py-1 px-2"
//               }`}
//               placeholder={placeholder}
//               {...field}
//               value={value ? value : field.value}
//             />
//           )}
//         />
//         <div className="absolute inset-y-0 right-0 flex items-center">
//           <Controller
//             control={control}
//             name={name}
//             render={({ field }) => (
//               <select
//                 id={`${id || name}`}
//                 className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
//                 {...field}
//               >
//                 <option>Week</option>
//                 <option>Month</option>
//               </select>
//             )}
//           />
//         </div>
//       </div>
//       {errorMessage && <small className="text-red-500">{errorMessage}</small>}
//     </div>
//   );
// };

// export default FormInputGroup;

"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";

interface IFormInputGroup {
  name: string;
  type?: string;
  size?: "large" | "small";
  value?: string;
  id?: string;
  placeholder?: string;
  validation?: object;
  label?: string;
  options: SelectOptions[];
}

type SelectOptions = {
  label: string;
  value: string;
};

const FormInputGroup = ({
  name,
  type = "text",
  size = "large",
  value,
  id,
  placeholder,
  validation,
  label,
  options,
}: IFormInputGroup) => {
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
      <div className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <input
              type={type}
              id={id || name}
              className={`mt-1 block w-full ${
                size === "large" ? "py-2 px-3" : "py-1 px-2"
              } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
            />
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Controller
            control={control}
            name={`${name}Select`}
            render={({ field }) => (
              <select
                id={`${id || name}Select`}
                className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-black  sm:text-sm"
                {...field}
              >
                {/* <option value="week">Week</option>
                <option value="month">Month</option> */}

                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>
      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};

export default FormInputGroup;
