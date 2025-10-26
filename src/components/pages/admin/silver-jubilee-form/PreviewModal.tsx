"use client";

import { UseFormWatch } from "react-hook-form";
import { SilverJubileeParticipantCategory } from "@/types/silverJubilee";
import type { SilverJubileeFormData } from "@/types/silverJubilee";

interface PreviewModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  watch: UseFormWatch<SilverJubileeFormData>;
  selectedCategory: {
    value: SilverJubileeParticipantCategory;
    label: string;
  } | null;
  selectedYear: { value: number; label: string } | null;
  guestBatch: { value: number; label: string } | null;
  guestGroup: { value: any; label: string } | null;
  mainParticipant: { id: string; name: string; phoneNumber: string } | null;
  amount: number;
  isSubmitting: boolean;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  show,
  onClose,
  onConfirm,
  watch,
  selectedCategory,
  selectedYear,
  guestBatch,
  guestGroup,
  mainParticipant,
  amount,
  isSubmitting,
}) => {
  if (!show) return null;

  const isGuestOrBaby =
    selectedCategory?.value === SilverJubileeParticipantCategory.GUEST ||
    selectedCategory?.value === SilverJubileeParticipantCategory.BABY;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Preview Submission
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Participant Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Participant Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{selectedCategory?.label}</p>
              </div>
              {isGuestOrBaby ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Batch</p>
                    <p className="font-medium">{guestBatch?.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Group</p>
                    <p className="font-medium">{guestGroup?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Main Participant</p>
                    <p className="font-medium">{mainParticipant?.name}</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">HSC Passing Year</p>
                  <p className="font-medium">{selectedYear?.value}</p>
                </div>
              )}
            </div>
          </div>

          {/* Guest/Baby Information OR Personal Information */}
          {isGuestOrBaby ? (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                {selectedCategory?.value ===
                SilverJubileeParticipantCategory.BABY
                  ? "Baby"
                  : "Guest"}{" "}
                Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{watch("guestName")}</p>
                </div>
                {selectedCategory?.value ===
                  SilverJubileeParticipantCategory.GUEST && (
                  <div>
                    <p className="text-sm text-gray-600">Relation</p>
                    <p className="font-medium">{watch("relation")}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{watch("guestPhoneNumber")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-medium">
                    {watch("paymentType")?.label || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">{amount} BDT</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{watch("fullName")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Group</p>
                    <p className="font-medium">{watch("group")?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{watch("phoneNumber")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alternative Phone</p>
                    <p className="font-medium">
                      {watch("alternativePhoneNumber") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{watch("email")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">{watch("gender")?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">{watch("bloodGroup")?.label}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Type</p>
                    <p className="font-medium">{watch("paymentType")?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">{amount} BDT</p>
                  </div>
                </div>
              </div>

              {/* Father's Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Father's Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{watch("fatherName")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupation</p>
                    <p className="font-medium">{watch("fatherOccupation")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{watch("fatherPhoneNumber")}</p>
                  </div>
                </div>
              </div>

              {/* Mother's Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Mother's Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{watch("motherName")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupation</p>
                    <p className="font-medium">{watch("motherOccupation")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{watch("motherPhoneNumber")}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
