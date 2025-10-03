import { NextResponse } from "next/server";

// Mock dashboard stats (in a real app, this would be calculated from database)
export async function GET() {
  try {
    const stats = {
      totalParticipants: 150,
      genderStats: {
        male: 85,
        female: 65,
      },
      hscYearStats: {
        "2020": 25,
        "2021": 30,
        "2022": 35,
        "2023": 40,
        "2024": 20,
      },
      groupStats: {
        Science: 80,
        "Business Studies": 45,
        Humanities: 25,
      },
      paymentStats: {
        Bkash: 60,
        Nagad: 35,
        Cash: 30,
        "Bank Account": 25,
      },
      amountStats: {
        "2000": 40,
        "1600": 35,
        "1400": 30,
        "1000": 25,
        "500": 15,
        "5000": 5,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
