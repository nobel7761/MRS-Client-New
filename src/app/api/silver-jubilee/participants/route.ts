import { NextRequest, NextResponse } from "next/server";
import {
  SilverJubileeParticipant,
  SilverJubileeFormData,
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
    amountType: "Registration" as any,
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
    const data: SilverJubileeFormData = await request.json();

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
      ...baseRequiredFields,
      "mainParticipantBatch",
      "mainParticipantGroup",
      "mainParticipantName",
      "guestName",
      "guestMobileNumber",
    ];

    const requiredFields =
      data.participantCategory === "Guest"
        ? guestRequiredFields
        : alumniStudentRequiredFields;

    for (const field of requiredFields) {
      if (!data[field as keyof SilverJubileeFormData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new participant
    const newParticipant: SilverJubileeParticipant = {
      _id: (participants.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    participants.push(newParticipant);

    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create participant" },
      { status: 500 }
    );
  }
}
