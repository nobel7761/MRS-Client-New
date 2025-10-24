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

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface SilverJubileeFormData {
  // Participant Category
  participantCategory: SilverJubileeParticipantCategory;

  // Personal Information
  fullName: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  email: string;
  hscPassingYear: number;
  group: SilverJubileeGroup;
  gender: SilverJubileeGender;
  bloodGroup: SilverJubileeBloodGroup;
  paymentType: SilverJubileePaymentType;
  amount: number;
  comments: string;
  registeredUnder?: string;

  // Parents Information
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;

  // Guest Information (only for guests)
  mainParticipantBatch: number;
  mainParticipantGroup: SilverJubileeGroup;
  mainParticipantId: string;
  mainParticipantName: string;
  guestName: string;
  guestMobileNumber: string;
  guestAmountType: SilverJubileeGuestAmountType;
  guestAmount: number;

  // Baby Information (only for babies)
  babyAge: number;
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
