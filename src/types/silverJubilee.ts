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
}

export enum SilverJubileeAmountType {
  REGISTRATION = "Registration",
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
  amountType: SilverJubileeAmountType;
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
  mainParticipantName?: string;
  guestName?: string;
  guestMobileNumber?: string;

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
  amountType: SilverJubileeAmountType;
  amount: number;
  comments: string;

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
  mainParticipantName: string;
  guestName: string;
  guestMobileNumber: string;
}
