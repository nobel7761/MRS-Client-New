import CustomDeleteAlert from "@/components/shared/custom-components/Alert";
import FormInput from "@/components/shared/Forms/FormInput";
import FormInputGroup from "@/components/shared/Forms/FormInputGroup";
import FormSelect from "@/components/shared/Forms/FormSelect";
import FormTextArea from "@/components/shared/Forms/FormTextArea";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const ServiceRequisitionForm = () => {
  const [requisitions, setRequisitions] = useState([{ id: Date.now() }]);
  const [foodFacilityChecked, setFoodFacilityChecked] = useState(false);

  const addRequisition = () => {
    setRequisitions([...requisitions, { id: Date.now() }]);
  };

  const confirmRemoveRequisition = (id: number) => {
    CustomDeleteAlert({
      onConfirm: () => removeRequisition(id),
      onCancel: () => console.log("Deletion cancelled"),
    });
  };

  const removeRequisition = (id: number) => {
    setRequisitions(requisitions.filter((person) => person.id !== id));
  };

  const handleFoodFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodFacilityChecked(e.target.checked);
  };

  return (
    <div>
      {requisitions.map((requisition, index) => (
        <div
          key={index}
          className="relative border border-gray-300 rounded p-4 mb-6"
        >
          <p className="text-lg mb-2">
            Requisition Details{" "}
            {index === 0 && requisitions.length > 1 ? 1 : null}
            {index !== 0 ? index + 1 : null}
          </p>

          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                name="requisition.position"
                size="large"
                placeholder="Position"
                validation={{
                  required: "Position is required",
                }}
              />

              <FormInput
                type="number"
                name="requisition.numberOfManpower"
                size="large"
                placeholder="Number of Manpower"
              />
            </div>

            <FormTextArea
              name="requisition.jobDescription"
              placeholder="Job Description"
              validation={{
                required: "Job Description is required",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                name="requisition.gender"
                size="large"
                placeholder="Select Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />

              <FormInput
                type="text"
                name="requisition.ageLimit"
                size="large"
                placeholder="Age Limit (maximum)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInputGroup
                name="requisition.payment"
                placeholder="Payment"
                type="number"
                options={[
                  { label: "Hourly", value: "hourly" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "Monthly" },
                ]}
              />

              <FormSelect
                name="requisition.education"
                size="large"
                placeholder="Minimum Education"
                options={[
                  { label: "Class 5", value: "5" },
                  { label: "Class 8", value: "8" },
                  { label: "SSC", value: "ssc" },
                  { label: "HSC", value: "hsc" },
                  {
                    label: "University Student",
                    value: "university student",
                  },
                  { label: "Uneducated", value: "uneducated" },
                  { label: "Not Applicable", value: "not applicable" },
                ]}
              />

              {/* <FormInput
                type="number"
                name="requisition.salary"
                size="large"
                placeholder="Salary"
              />

              <FormInput
                type="text"
                name="requisition.height"
                size="large"
                placeholder="Height"
              /> */}
            </div>

            {/* <FormCheckbox
              name="requisition.residence"
              label="Residence Facility"
            /> */}

            {/* <FormCheckbox
              name="requisition.foodFacility"
              label="Food Facility"
              onChange={handleFoodFacilityChange}
            />

            {foodFacilityChecked && (
              <FormSelect
                name="requisition.foodTimes"
                size="large"
                placeholder="Select Food Times"
                options={[
                  { label: "2 times", value: "2 times" },
                  { label: "3 times", value: "3 times" },
                ]}
              />
            )} */}

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                name="requisition.tips"
                size="large"
                placeholder="Tips System"
                options={[
                  { label: "Personal", value: "personal" },
                  { label: "Box System", value: "box" },
                  { label: "Not Applicable", value: "not applicable" },
                ]}
              />

              <FormSelect
                name="requisition.overTime"
                size="large"
                placeholder="Paid Overtime Facility"
                options={[
                  { label: "Applicable", value: "applicable" },
                  { label: "Not Applicable", value: "not applicable" },
                ]}
              />
            </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                type="number"
                name="requisition.workingHoursForSingleDay"
                size="large"
                placeholder="Working hours / day"
              />

              <FormDatePicker
                type="Time"
                name="requisition.workingHourEnds"
                placeholder="Starts at"
              />

              <FormDatePicker
                type="Time"
                name="requisition.workingHourStarts"
                placeholder="Ends at"
              />
            </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormDatePicker
                name="requisition.joiningDate"
                placeholder="Joining Date"
                type="Date"
              />

              <FormInputGroup
                name="requisition.numberOfLeave"
                placeholder="Number of leave"
                type="number"
                options={[
                  { label: "Week", value: "week" },
                  { label: "Month", value: "Month" },
                ]}
              />
            </div> */}
          </div>

          {index === 0 && (
            <button
              type="button"
              onClick={addRequisition}
              className="absolute top-0 right-0 -mt-4 mr-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add More Person
            </button>
          )}

          {index > 0 && (
            <button
              type="button"
              onClick={() => confirmRemoveRequisition(requisition.id)}
              className="absolute top-0 right-0 -mt-4 mr-2 bg-red-500 text-white p-1 rounded"
            >
              <FaTrashAlt size={20} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceRequisitionForm;
