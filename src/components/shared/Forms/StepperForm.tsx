"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";

import { MdDone } from "react-icons/md";
import { setToLocalStorage } from "@/utils/local-storage";
import { getFromLocalStorage } from "@/utils/local-storage";

interface IStep {
  title: string;
  content: React.ReactElement | React.ReactNode;
}

interface IStepperFormProps {
  steps: IStep[];
  submitHandler: (data: any) => void;
  navigateLink?: string;
}

const useStep = (initialStep: number) => {
  const [current, setCurrent] = useState<number>(
    getFromLocalStorage("step")
      ? Number(JSON.parse(getFromLocalStorage("step") as string).step)
      : initialStep
  );

  useEffect(() => {
    setToLocalStorage("step", JSON.stringify({ step: current }));
  }, [current]);

  const next = useCallback(() => {
    setCurrent((prev) => prev + 1);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => prev - 1);
  }, []);

  return { current, next, prev, setCurrent };
};

const StepperForm: React.FC<IStepperFormProps> = ({
  steps,
  submitHandler,
  navigateLink,
}) => {
  const router = useRouter();
  const { current, next, prev, setCurrent } = useStep(0);
  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const handleStudentOnSubmit = (data: any) => {
    submitHandler(data);
    reset();
    setToLocalStorage("step", JSON.stringify({ step: 0 }));
    navigateLink && router.push(navigateLink);
  };

  const getStatusClass = (index: number) => {
    if (index < current) return "completed";
    if (index === current) return "in progress";
    return "pending";
  };

  return (
    <>
      {/* <ol className="flex w-full mb-4">
        {steps.map((step, index) => {
          const statusClass = getStatusClass(index);
          return (
            <li
              key={index}
              className={`relative mt-8 flex flex-col gap-y-2 w-full ${statusClass}`}
              aria-current={current === index ? "step" : undefined}
            >
              <span className={`flex items-center gap-x-2 ${statusClass}`}>
                <div
                  className={`relative flex justify-center items-center rounded-full ${
                    statusClass === "completed"
                      ? "bg-green-500 text-white"
                      : statusClass === "in progress"
                      ? "ring-2 ring-blue-500 p-1 bg-white"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`flex justify-center items-center rounded-full ${
                      statusClass === "completed"
                        ? "bg-green-500 text-white w-6 h-6"
                        : statusClass === "in progress"
                        ? "bg-blue-500 w-4 h-4"
                        : "bg-gray-300 w-6 h-6"
                    }`}
                  >
                    {statusClass === "completed" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>
              </span>
              <div className="flex flex-col">
                <span className="text-base text-black">{step.title}</span>
                <span
                  className={`text-xs ${
                    statusClass === "completed"
                      ? "text-green-500"
                      : statusClass === "in progress"
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {statusClass === "completed"
                    ? "Completed"
                    : statusClass === "in progress"
                    ? "In Progress"
                    : "Pending"}
                </span>
              </div>
            </li>
          );
        })}
      </ol> */}

      <div className="my-6">
        <div className={`flex items-center justify-between`}>
          {steps.map((step, index) => (
            <>
              <div key={index} className="px-10">
                {/* rounded filled box */}
                <div
                  className={` rounded-full flex justify-center items-center
                ${
                  getStatusClass(index) === "completed" &&
                  "w-6 h-6 bg-green-600"
                }
                ${
                  getStatusClass(index) === "in progress" &&
                  "w-6 h-6 bg-blue-500"
                }
                ${getStatusClass(index) === "pending" && "w-6 h-6 bg-gray-300"}
                `}
                >
                  {getStatusClass(index) === "completed" && (
                    <MdDone className="text-white font-bold" />
                  )}
                </div>
              </div>
              {/* line bar */}
              {index + 1 !== steps.length && (
                <div
                  className={`w-full h-0.5 
                ${
                  getStatusClass(index) === "completed"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }
                `}
                ></div>
              )}
            </>
          ))}
        </div>

        <div className={` flex items-center justify-between`}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                ${index === 0 && "text-left"} 
                ${index === steps.length - 1 && "text-right"}
                ${index !== 0 && index !== steps.length - 1 && "text-center"}
                `}
            >
              {/* <p className="text-gray-500">STEP {index + 1}</p> */}
              <p
                className={`font-bold
                ${getStatusClass(index) === "completed" && "text-green-600"}
                ${getStatusClass(index) === "in progress" && "text-blue-500"}
                ${getStatusClass(index) === "pending" && "text-gray-400"}
                `}
              >
                {step.title}
              </p>
              {/* <p
                className={`
                ${getStatusClass(index) === "completed" && "text-green-600"}
                ${getStatusClass(index) === "in progress" && "text-blue-500"}
                ${getStatusClass(index) === "pending" && "text-gray-300"}
                `}
              >
                {getStatusClass(index)}
              </p> */}
            </div>
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleStudentOnSubmit)}>
          <div>{steps[current].content}</div>
          <div className="mt-6">
            {current < steps.length - 1 && (
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-600"
                onClick={next}
              >
                Next
              </button>
            )}
            {current === steps.length - 1 && (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-600"
              >
                Done
              </button>
            )}
            {current > 0 && (
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2 transition-all duration-300 hover:bg-gray-600"
                onClick={prev}
              >
                Previous
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default StepperForm;
