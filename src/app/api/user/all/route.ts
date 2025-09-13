import { NextRequest, NextResponse } from "next/server";

// This is a placeholder API route
// In a real application, this would connect to your backend database
export async function GET(request: NextRequest) {
  try {
    // Placeholder response - replace with actual database query
    const users = [
      {
        membershipCategory: "FREE",
        _id: "67f577c411236e7c9265935f",
        firstName: "Habibur",
        lastName: "Nobel",
        phone: "01611627761",
        email: "habiburnobel+superadmin@gmail.com",
        status: "ACTIVE",
        role: "SUPER_ADMIN",
        createdAt: "2025-04-08T19:23:48.075Z",
        updatedAt: "2025-09-04T21:26:10.889Z",
        __v: 0,
      },
      {
        membershipCategory: "FREE",
        _id: "67f577c411236e7c9265932f",
        firstName: "Habibur",
        lastName: "Nobel",
        phone: "01611627762",
        email: "habiburnobel@gmail.com",
        status: "ACTIVE",
        role: "ADMIN",
        createdAt: "2025-04-08T19:23:48.075Z",
        updatedAt: "2025-08-27T11:51:20.713Z",
        __v: 0,
      },
      {
        _id: "68ba03156a1e22eca4fab293",
        firstName: "Habibur",
        lastName: "Nobel",
        phone: "01521320912",
        email: "habiburnobel+1@gmail.com",
        status: "ACTIVE",
        role: "USER",
        membershipCategory: "FREE",
        createdAt: "2025-09-04T21:22:29.859Z",
        updatedAt: "2025-09-04T21:22:30.004Z",
        __v: 0,
      },
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
