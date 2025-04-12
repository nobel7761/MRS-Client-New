"use client";

import CustomDeleteAlert from "@/components/shared/custom-components/Alert";
import FormInput from "@/components/shared/Forms/FormInput";
import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const ContactPersonInformationForm = () => {
  const [contactPersons, setContactPersons] = useState([{ id: Date.now() }]);

  const addContactPerson = () => {
    setContactPersons([...contactPersons, { id: Date.now() }]);
  };

  const confirmRemoveContactPerson = (id: number) => {
    CustomDeleteAlert({
      onConfirm: () => removeContactPerson(id),
      onCancel: () => console.log("Deletion cancelled"),
    });
  };

  const removeContactPerson = (id: number) => {
    setContactPersons(contactPersons.filter((person) => person.id !== id));
  };

  return (
    <>
      {contactPersons.map((person, index) => (
        <div
          key={person.id}
          className="relative border border-gray-300 rounded p-4 mb-6"
        >
          <p className="text-lg mb-2">
            Contact Person {index === 0 && contactPersons.length > 1 ? 1 : null}
            {index !== 0 ? index + 1 : null}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <FormInput
                type="text"
                name={`client.contactPersons[${index}].name`}
                size="large"
                placeholder="Name"
                validation={{ required: "Contact Person Name is required" }}
              />
            </div>
            <div className="">
              <FormInput
                type="text"
                name={`client.contactPersons[${index}].designation`}
                size="large"
                placeholder="Designation"
                validation={{
                  required: "Contact Person Designation is required",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <FormInput
                type="email"
                name={`client.contactPersons[${index}].email`}
                size="large"
                placeholder="Email"
              />
            </div>
            <div className="">
              <FormInput
                type="number"
                name={`client.contactPersons[${index}].mobile`}
                size="large"
                placeholder="Contact Number"
                validation={{ required: "Contact Person Number is required" }}
              />
            </div>
          </div>
          {contactPersons.length < 3 && index === 0 && (
            <button
              type="button"
              onClick={addContactPerson}
              className="absolute top-0 right-0 -mt-4 mr-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add More Person
            </button>
          )}
          {index > 0 && (
            <button
              type="button"
              onClick={() => confirmRemoveContactPerson(person.id)}
              className="absolute top-0 right-0 -mt-4 mr-2 bg-red-500 text-white p-1 rounded"
            >
              <FaTrashAlt size={20} />
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default ContactPersonInformationForm;
