import { NextRequest, NextResponse } from "next/server";
import { DailyTrendsResponse, DailyTrend } from "@/types/email";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");

    // Validate and set default days parameter
    let days = 30; // default value
    if (daysParam) {
      const parsedDays = parseInt(daysParam, 10);
      if (parsedDays >= 1 && parsedDays <= 365) {
        days = parsedDays;
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid days parameter. Must be between 1 and 365.",
          },
          { status: 400 }
        );
      }
    }

    // Generate mock data for the specified number of days
    const trends: DailyTrend[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic mock data with some variation
      const baseEmailsSent = Math.floor(Math.random() * 100) + 20; // 20-120 emails
      const baseEmailsFailed = Math.floor(Math.random() * 5) + 1; // 1-6 failures

      // Add some weekend/weekday variation
      const dayOfWeek = date.getDay();
      const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;

      const emailsSent = Math.floor(baseEmailsSent * weekendMultiplier);
      const emailsFailed = Math.floor(baseEmailsFailed * weekendMultiplier);

      trends.push({
        date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
        emailsSent,
        emailsFailed,
      });
    }

    const response: DailyTrendsResponse = {
      trends,
    };

    // In a real implementation, you would fetch this data from your database:
    //
    // const startDate = new Date();
    // startDate.setDate(startDate.getDate() - days);
    // startDate.setHours(0, 0, 0, 0);
    //
    // const endDate = new Date();
    // endDate.setHours(23, 59, 59, 999);
    //
    // const trends = await db.emailLogs.groupBy({
    //   by: ['sentAt'],
    //   where: {
    //     sentAt: {
    //       gte: startDate,
    //       lte: endDate,
    //     },
    //   },
    //   _count: {
    //     id: true,
    //   },
    //   _sum: {
    //     status: {
    //       equals: 'sent'
    //     }
    //   }
    // });
    //
    // // Process the results to group by date and calculate sent/failed counts
    // const dailyTrends = trends.map(trend => ({
    //   date: trend.sentAt.toISOString().split('T')[0],
    //   emailsSent: trend._sum.status || 0,
    //   emailsFailed: trend._count.id - (trend._sum.status || 0),
    // }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching daily email trends:", error);
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
