export enum SilverJubileeGroup {
  SCIENCE = "Science",
  BUSINESS_STUDIES = "Business Studies",
  HUMANITIES = "Humanities",
}

export enum SilverJubileeGender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum SilverJubileeBloodGroup {
  DONT_KNOW = "Don't know",
  A_POSITIVE = "A+",
  B_POSITIVE = "B+",
  O_POSITIVE = "O+",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  A_NEGATIVE = "A-",
  B_NEGATIVE = "B-",
  O_NEGATIVE = "O-",
}

export enum SilverJubileePaymentType {
  BKASH = "Bkash",
  NAGAD = "Nagad",
  CASH = "Cash",
  BANK_ACCOUNT = "Bank Account",
}

export enum SilverJubileeParticipantCategory {
  ALUMNI = "Alumni",
  STUDENT = "Student",
  GUEST = "Guest",
  BABY = "Baby",
  LIFETIMEMEMBERSHIP = "Lifetime Membership",
}

export enum SilverJubileeAmountType {
  REGISTRATION = "Registration",
  DONATION = "Donation",
}

export enum SilverJubileeGuestAmountType {
  FIXED_1000 = "1000",
  OTHER_AMOUNT = "Other Amount",
  DONATION = "Donation",
}

export interface SilverJubileeParticipant {
  _id?: string;
  // Participant Category
  participantCategory: SilverJubileeParticipantCategory;

  // Personal Information
  fullName: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  email: string;
  hscPassingYear: number;
  group: SilverJubileeGroup;
  gender: SilverJubileeGender;
  bloodGroup: SilverJubileeBloodGroup;
  paymentType: SilverJubileePaymentType;
  amount: number;
  comments?: string;
  professionalDetails?: string;

  // Parents Information
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;

  // Guest Information (only for guests)
  mainParticipantBatch?: number;
  mainParticipantGroup?: SilverJubileeGroup;
  mainParticipantId?: string;
  mainParticipantName?: string;
  guestName?: string;
  relation?: string;
  guestMobileNumber?: string;

  // Baby Information (only for babies)
  babyName?: string;
  babyPhone?: string;

  // Secret Code for identification
  secretCode?: string;

  // Registered Under (Collector)
  registeredUnder?: string;

  // Submission source
  submittedFrom?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface SilverJubileeGuestSubmissionData {
  participantCategory: SilverJubileeParticipantCategory;
  mainParticipantBatch: number;
  mainParticipantGroup: SilverJubileeGroup;
  mainParticipantId: string;
  guestName: string;
  relation: string; // Relation to main participant (required for Guest)
  guestMobileNumber: string;
  amount: number;
  paymentType: string;
  comments?: string;
  registeredUnder?: string;
}

export interface SilverJubileeBabySubmissionData {
  participantCategory: SilverJubileeParticipantCategory;
  mainParticipantBatch: number;
  mainParticipantGroup: SilverJubileeGroup;
  mainParticipantId: string;
  babyName: string;
  babyPhone: string;
  amount: number;
  paymentType: string;
  comments?: string;
  registeredUnder?: string;
}

// Shared FormData interface for all Silver Jubilee form components
// This matches the form structure used in SilverJubileeForm.tsx and its sub-components
export interface SilverJubileeFormData {
  participantCategory: {
    value: SilverJubileeParticipantCategory;
    label: string;
  } | null;
  hscPassingYear: { value: number; label: string } | null;
  fullName: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  email: string;
  group: { value: SilverJubileeGroup; label: string } | null;
  gender: { value: SilverJubileeGender; label: string } | null;
  bloodGroup: { value: SilverJubileeBloodGroup; label: string } | null;
  paymentType: { value: SilverJubileePaymentType; label: string } | null;
  amount: number;
  professionalDetails?: string;
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;
  // Guest/Baby fields
  guestBatch: { value: number; label: string } | null;
  guestGroup: { value: SilverJubileeGroup; label: string } | null;
  mainParticipant: { id: string; name: string; phoneNumber: string } | null;
  guestName: string;
  relation: string;
  guestPhoneNumber: string;
  // Comments field for all types
  comments: string;
  // Registered Under field
  registeredUnder: { id: string; name: string } | null;
}
