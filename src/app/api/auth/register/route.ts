import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { UserType } from "@/types/auth";

// Mock user storage - in production, this would be a database
const users: any[] = [];

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
  // Bangladeshi phone number validation: 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx
  // Format: +8801[3-9]xxxxxxxx (8 digits after 1[3-9]) or 01[3-9]xxxxxxxx (8 digits after 1[3-9])
  const phoneRegex = /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password: string): boolean => {
  // Password must be 8-16 characters with uppercase, lowercase, number, and special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  return passwordRegex.test(password);
};

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationData = await request.json();
    const { firstName, lastName, email, phoneNumber, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        {
          message:
            "Invalid phone number format. Use 01[3-9]xxxxxxxx or +8801[3-9]xxxxxxxx",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be 8-16 characters with uppercase, lowercase, number, and special character",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(
      (user) => user.email === email || user.phoneNumber === phoneNumber
    );
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or phone number already exists" },
        { status: 409 }
      );
    }

    // Hash password using Node.js crypto
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");

    // Create new user
    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName,
      email,
      phoneNumber,
      password: `${salt}:${hashedPassword}`, // Store salt with password
      role: "USER",
      status: "ACTIVE",
      userType: UserType.VISITOR, // Default userType, should be set by admin or through proper user management
      createdAt: new Date().toISOString(),
    };

    // Store user (in production, save to database)
    users.push(newUser);

    // Generate JWT token using Node.js crypto
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const payload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64url"
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url"
    );
    const signature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");

    const accessToken = `${encodedHeader}.${encodedPayload}.${signature}`;

    // Return success response (exclude password from response)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "Registration successful",
        user: userWithoutPassword,
        accessToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
