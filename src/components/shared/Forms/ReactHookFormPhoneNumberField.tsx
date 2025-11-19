"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  MuiTelInput,
  MuiTelInputCountry,
  MuiTelInputProps,
} from "mui-tel-input";

type ReactHookFormPhoneNumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
  control: Control<TFieldValues>;
  apiErrors?: string[];
  muiTelInputProps?: Omit<MuiTelInputProps, "value" | "onChange">;
  rules?: any;
};

const defaultPhoneNumberCode = (process.env
  .NEXT_PUBLIC_DEFUALT_PHONE_NUMBER_CODE || "BD") as MuiTelInputCountry;

function TelInput({
  variant = "outlined",
  fullWidth = true,
  sx,
  defaultCountry = defaultPhoneNumberCode,
  error,
  ...rest
}: MuiTelInputProps) {
  return (
    <MuiTelInput
      variant={variant}
      fullWidth={fullWidth}
      defaultCountry={defaultCountry}
      error={error}
      sx={{
        marginTop: 0,
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.5rem",
          height: "48px",
          "& input": {
            padding: "12px 14px",
          },
          "& fieldset": {
            borderColor: error ? "#ef4444" : "#d1d5db",
          },
          "&:hover fieldset": {
            borderColor: error ? "#ef4444" : "#d1d5db",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "#ef4444" : "#3b82f6",
            borderWidth: "2px",
          },
        },
        ...sx,
      }}
      {...rest}
    />
  );
}

export default function ReactHookFormPhoneNumberField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  apiErrors,
  muiTelInputProps,
  rules,
}: ReactHookFormPhoneNumberFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // Extract potentially problematic props from muiTelInputProps
        const {
          forceCallingCode,
          error: _error,
          ...safeProps
        } = (muiTelInputProps || {}) as any;

        return (
          <TelInput
            {...safeProps}
            forceCallingCode={forceCallingCode === false ? false : undefined}
            error={!!apiErrors || !!error}
            helperText={
              apiErrors
                ? apiErrors[0]
                : error?.message || muiTelInputProps?.helperText
            }
            value={(value as unknown as string) || ""}
            onChange={(newValue) => {
              onChange(newValue);
            }}
          />
        );
      }}
    />
  );
}
