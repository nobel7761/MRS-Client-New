import { NextRequest, NextResponse } from "next/server";
import {
  SilverJubileeParticipant,
  SilverJubileeFormData,
  SilverJubileeGuestSubmissionData,
  SilverJubileeParticipantCategory,
} from "@/types/silverJubilee";

// Mock data storage (in a real app, this would be a database)
let registrations: SilverJubileeParticipant[] = [];

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
  // Bangladeshi phone number validation: 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx
  const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
  return phoneRegex.test(phone);
};

const validateHSCYear = (
  year: number,
  category: SilverJubileeParticipantCategory
): boolean => {
  if (category === SilverJubileeParticipantCategory.ALUMNI) {
    return year >= 2003 && year <= 2025;
  } else if (category === SilverJubileeParticipantCategory.STUDENT) {
    return year >= 2026 && year <= 2027;
  } else if (category === SilverJubileeParticipantCategory.LIFETIMEMEMBERSHIP) {
    return year >= 2003 && year <= 2027;
  }
  return true;
};

// Check for duplicate registration
const checkDuplicateRegistration = (
  email?: string,
  phoneNumber?: string
): SilverJubileeParticipant | null => {
  return (
    registrations.find(
      (reg) =>
        (email && reg.email === email) ||
        (phoneNumber && reg.phoneNumber === phoneNumber)
    ) || null
  );
};

export async function POST(request: NextRequest) {
  try {
    const data: SilverJubileeFormData | SilverJubileeGuestSubmissionData =
      await request.json();

    // Validate participant category
    if (!data.participantCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Participant category is required",
        },
        { status: 400 }
      );
    }

    // Handle Guest/Baby registration
    if (
      data.participantCategory === SilverJubileeParticipantCategory.GUEST ||
      data.participantCategory === SilverJubileeParticipantCategory.BABY
    ) {
      const guestData = data as SilverJubileeGuestSubmissionData;

      // Validate required fields for guests
      const requiredGuestFields = [
        "mainParticipantBatch",
        "mainParticipantGroup",
        "mainParticipantId",
        "guestName",
        "guestMobileNumber",
        "amountType",
        "amount",
      ];

      for (const field of requiredGuestFields) {
        if (!guestData[field as keyof SilverJubileeGuestSubmissionData]) {
          return NextResponse.json(
            {
              success: false,
              message: `Missing required field: ${field}`,
            },
            { status: 400 }
          );
        }
      }

      // Validate guest phone number
      if (!validatePhoneNumber(guestData.guestMobileNumber)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid phone number format. Use 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx",
          },
          { status: 400 }
        );
      }

      // Validate amount
      if (guestData.amount <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Amount must be greater than 0",
          },
          { status: 400 }
        );
      }

      // Create guest/baby registration
      const newRegistration: SilverJubileeParticipant = {
        _id: `sj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        participantCategory: guestData.participantCategory,
        fullName: "",
        phoneNumber: "",
        alternativePhoneNumber: "",
        email: "",
        hscPassingYear: guestData.mainParticipantBatch,
        group: guestData.mainParticipantGroup,
        gender: "Male" as any,
        bloodGroup: "Don't know" as any,
        paymentType: "Cash" as any,
        amount: guestData.amount,
        comments: "",
        fatherName: "",
        fatherPhoneNumber: "",
        fatherOccupation: "",
        motherName: "",
        motherPhoneNumber: "",
        motherOccupation: "",
        mainParticipantBatch: guestData.mainParticipantBatch,
        mainParticipantGroup: guestData.mainParticipantGroup,
        mainParticipantId: guestData.mainParticipantId,
        mainParticipantName: "",
        guestName: guestData.guestName,
        guestMobileNumber: guestData.guestMobileNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      registrations.push(newRegistration);

      return NextResponse.json(
        {
          success: true,
          message: "Guest registration successful",
          data: newRegistration,
        },
        { status: 201 }
      );
    }

    // Handle Alumni/Student/Lifetime Membership registration
    const formData = data as SilverJubileeFormData;

    // Validate required fields
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "email",
      "hscPassingYear",
      "group",
      "gender",
      "bloodGroup",
      "paymentType",
      "amountType",
      "amount",
      "fatherName",
      "fatherPhoneNumber",
      "fatherOccupation",
      "motherName",
      "motherPhoneNumber",
      "motherOccupation",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof SilverJubileeFormData]) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate phone numbers
    if (!validatePhoneNumber(formData.phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone number format. Use 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx",
        },
        { status: 400 }
      );
    }

    if (
      formData.alternativePhoneNumber &&
      !validatePhoneNumber(formData.alternativePhoneNumber)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid alternative phone number format. Use 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx",
        },
        { status: 400 }
      );
    }

    if (!validatePhoneNumber(formData.fatherPhoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid father's phone number format. Use 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx",
        },
        { status: 400 }
      );
    }

    if (!validatePhoneNumber(formData.motherPhoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid mother's phone number format. Use 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx",
        },
        { status: 400 }
      );
    }

    // Validate HSC year
    if (
      !validateHSCYear(formData.hscPassingYear, formData.participantCategory)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid HSC passing year for the selected category",
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (formData.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Check for duplicate registration
    const duplicate = checkDuplicateRegistration(
      formData.email,
      formData.phoneNumber
    );
    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A registration with this email or phone number already exists",
        },
        { status: 409 }
      );
    }

    // Create new registration
    const newRegistration: SilverJubileeParticipant = {
      _id: `sj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    registrations.push(newRegistration);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: newRegistration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all registrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const group = searchParams.get("group");

    let filteredRegistrations = [...registrations];

    // Filter by category
    if (category) {
      filteredRegistrations = filteredRegistrations.filter(
        (reg) => reg.participantCategory === category
      );
    }

    // Filter by year
    if (year) {
      filteredRegistrations = filteredRegistrations.filter(
        (reg) => reg.hscPassingYear === parseInt(year)
      );
    }

    // Filter by group
    if (group) {
      filteredRegistrations = filteredRegistrations.filter(
        (reg) => reg.group === group
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredRegistrations,
        count: filteredRegistrations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
