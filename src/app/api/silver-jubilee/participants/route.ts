import { NextRequest, NextResponse } from "next/server";
import {
  SilverJubileeParticipant,
  SilverJubileeFormData,
  SilverJubileeGuestSubmissionData,
} from "@/types/silverJubilee";

// Mock data storage (in a real app, this would be a database)
let participants: SilverJubileeParticipant[] = [
  {
    _id: "1",
    participantCategory: "Alumni" as any,
    fullName: "John Doe",
    phoneNumber: "01712345678",
    alternativePhoneNumber: "01812345678",
    email: "john.doe@example.com",
    hscPassingYear: 2020,
    group: "Science" as any,
    gender: "Male" as any,
    bloodGroup: "A+" as any,
    paymentType: "Bkash" as any,
    amount: 2000,
    comments: "Looking forward to the event!",
    fatherName: "Robert Doe",
    fatherPhoneNumber: "01712345679",
    fatherOccupation: "Engineer",
    motherName: "Jane Doe",
    motherPhoneNumber: "01712345680",
    motherOccupation: "Teacher",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: SilverJubileeFormData | SilverJubileeGuestSubmissionData =
      await request.json();

    // Validate required fields based on participant category
    const baseRequiredFields = [
      "participantCategory",
      "paymentType",
      "amountType",
      "amount",
    ];

    const alumniStudentRequiredFields = [
      ...baseRequiredFields,
      "fullName",
      "phoneNumber",
      "email",
      "hscPassingYear",
      "group",
      "gender",
      "bloodGroup",
      "fatherName",
      "fatherPhoneNumber",
      "fatherOccupation",
      "motherName",
      "motherPhoneNumber",
      "motherOccupation",
    ];

    const guestRequiredFields = [
      "participantCategory",
      "mainParticipantBatch",
      "mainParticipantGroup",
      "mainParticipantId",
      "guestName",
      "guestMobileNumber",
      "amountType",
      "amount",
    ];

    const requiredFields =
      data.participantCategory === "Guest"
        ? guestRequiredFields
        : alumniStudentRequiredFields;

    for (const field of requiredFields) {
      if (
        !data[
          field as keyof (
            | SilverJubileeFormData
            | SilverJubileeGuestSubmissionData
          )
        ]
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new participant
    let newParticipant: SilverJubileeParticipant;

    if (data.participantCategory === "Guest") {
      // For guests, create with minimal data
      newParticipant = {
        _id: (participants.length + 1).toString(),
        participantCategory: data.participantCategory,
        fullName: "",
        phoneNumber: "",
        alternativePhoneNumber: "",
        email: "",
        hscPassingYear: 0,
        group: "Science" as any,
        gender: "Male" as any,
        bloodGroup: "Don't know" as any,
        paymentType: "Cash" as any,
        amount: data.amount,
        comments: "",
        fatherName: "",
        fatherPhoneNumber: "",
        fatherOccupation: "",
        motherName: "",
        motherPhoneNumber: "",
        motherOccupation: "",
        mainParticipantBatch: data.mainParticipantBatch,
        mainParticipantGroup: data.mainParticipantGroup,
        mainParticipantId: data.mainParticipantId,
        mainParticipantName: "",
        guestName: data.guestName,
        guestMobileNumber: data.guestMobileNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // For alumni/students, use all data
      const formData = data as SilverJubileeFormData;
      newParticipant = {
        _id: (participants.length + 1).toString(),
        participantCategory:
          formData.participantCategory?.value || ("Alumni" as any),
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        alternativePhoneNumber: formData.alternativePhoneNumber,
        email: formData.email,
        hscPassingYear: formData.hscPassingYear?.value || 0,
        group: formData.group?.value || ("Science" as any),
        gender: formData.gender?.value || ("Male" as any),
        bloodGroup: formData.bloodGroup?.value || ("Don't know" as any),
        paymentType: formData.paymentType?.value || ("Cash" as any),
        amount: formData.amount,
        comments: formData.comments,
        fatherName: formData.fatherName,
        fatherPhoneNumber: formData.fatherPhoneNumber,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherPhoneNumber: formData.motherPhoneNumber,
        motherOccupation: formData.motherOccupation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    participants.push(newParticipant);

    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create participant" },
      { status: 500 }
    );
  }
}
