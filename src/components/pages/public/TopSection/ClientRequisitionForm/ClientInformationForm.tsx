"use client";

import FormInput from "@/components/shared/Forms/FormInput";

const ClientInformationForm = () => {
  return (
    <>
      <div className="border border-gray-300 rounded mb-6 p-4">
        <p className="text-lg mb-2">Client Information</p>
        <div className="grid grid-cols-1">
          <div className="">
            <FormInput
              type="text"
              name="client.name"
              size="large"
              placeholder="Company Name"
              validation={{ required: "Company Name is required" }}
            />
          </div>
          <div className="">
            <FormInput
              type="text"
              name="client.address"
              size="large"
              placeholder="Company Address"
              validation={{ required: "Company Address is required" }}
            />
          </div>
          <div className="">
            <FormInput
              type="text"
              name="client.branch"
              size="large"
              placeholder="Company Branch"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientInformationForm;
