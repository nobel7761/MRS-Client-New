"use client";

import backgroundImage from "@/public/background.jpg";
import Link from "next/link";
import Image from "next/image";
import representativeRegistration2026 from "@/public/representative-reunion-2026/representative-form.gif";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";

type FormValues = {
  name: string;
  hscYear: number;
  hscGroup: string;
  gender: string;
  phone: string;
  facebookUrl: string;
  comments: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  hscYear: yup.number().required("HSC passing year is required"),
  hscGroup: yup.string().required("HSC group is required"),
  gender: yup.string().required("Gender is required"),
  phone: yup.string().required("Phone number is required"),
  facebookUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Facebook URL is required"),
  comments: yup.string().default(""),
});

const hscYears = Array.from({ length: 23 }, (_, i) => 2003 + i);
const hscGroups = ["Science", "Business Studies", "Humanities"];
const genders = ["Male", "Female"];

const RepresentativeRegistration2026Component = () => {
  const [selectedHscYear, setSelectedHscYear] = useState<number | null>(null);
  const [selectedHscGroup, setSelectedHscGroup] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/representative-collection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Failed to submit representative form. Please try again."
        );
        return;
      }

      toast.success("Representative registration successful");
      reset();
      // Reset dropdown states
      setSelectedHscYear(null);
      setSelectedHscGroup(null);
      setSelectedGender(null);
    } catch (error) {
      console.error("Error submitting representative form:", error);
      toast.error("Failed to submit representative form. Please try again.");
    }
  };

  return (
    <div>
      {/* bottom part */}
      <div className="w-[90%] mx-auto md:pt-24 py-5">
        <div className="flex md:flex-row flex-col gap-x-10">
          <div className="md:w-1/2 w-full">
            <p className="text-[35px] font-extrabold text-primary">
              Be the Voice of Your Batch – Join the NIC 25th Anniversary Grand
              Reunion as a Representative!
            </p>
            <Image
              src={representativeRegistration2026}
              alt="background"
              className="w-full"
            />
          </div>
          <div className="md:w-1/2 w-full">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* HSC Year and Group in same line */}
              <div className="grid grid-cols-2 gap-4">
                {/* HSC Year Dropdown */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    HSC Passing Year <span className="text-red-500">*</span>
                  </label>
                  <Listbox
                    value={selectedHscYear}
                    onChange={(value) => {
                      setSelectedHscYear(value);
                      if (value) {
                        setValue("hscYear", value);
                      }
                    }}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                        <span>{selectedHscYear || "Select HSC Year"}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <FiChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                          {hscYears.map((year) => (
                            <Listbox.Option
                              key={year}
                              value={year}
                              className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-primary text-white"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              {year}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  {errors.hscYear && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.hscYear.message}
                    </p>
                  )}
                </div>

                {/* HSC Group Dropdown */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    HSC Group <span className="text-red-500">*</span>
                  </label>
                  <Listbox
                    value={selectedHscGroup}
                    onChange={(value) => {
                      setSelectedHscGroup(value);
                      if (value) {
                        setValue("hscGroup", value);
                      }
                    }}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                        <span>{selectedHscGroup || "Select HSC Group"}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <FiChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                          {hscGroups.map((group) => (
                            <Listbox.Option
                              key={group}
                              value={group}
                              className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-primary text-white"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              {group}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  {errors.hscGroup && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.hscGroup.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender and Phone in same line */}
              <div className="grid grid-cols-2 gap-4">
                {/* Gender Dropdown */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Listbox
                    value={selectedGender}
                    onChange={(value) => {
                      setSelectedGender(value);
                      if (value) {
                        setValue("gender", value);
                      }
                    }}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                        <span>{selectedGender || "Select Gender"}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <FiChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                          {genders.map((gender) => (
                            <Listbox.Option
                              key={gender}
                              value={gender}
                              className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-primary text-white"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              {gender}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  {errors.gender && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Facebook URL Field */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Facebook Account URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  {...register("facebookUrl")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                {errors.facebookUrl && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.facebookUrl.message}
                  </p>
                )}
              </div>

              {/* Comments Field */}
              <div>
                <label className="block text-gray-700 mb-2">Comments</label>
                <textarea
                  {...register("comments")}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <p className="mt-1 text-sm text-gray-500">
                  If you’d like to support the committee in any specific
                  area—such as cultural activities, sponsorship, or anything
                  else—please feel free to let us know in the comments. We’d
                  really appreciate your involvement!
                </p>
                {errors.comments && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.comments.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                // disabled={!isAllFieldsFilled() || isSubmitting}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentativeRegistration2026Component;
