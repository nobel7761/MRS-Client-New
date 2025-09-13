import { NextRequest, NextResponse } from "next/server";

// Campaign creation interface based on the demo data
interface CampaignCreationRequest {
  name: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  recipients: Array<{
    email: string;
    firstName: string;
    lastName: string;
    hscPassingYear: number;
  }>;
  emailsPerDay: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

interface CampaignCreationResponse {
  success: boolean;
  campaignId: string;
  message: string;
  totalRecipients: number;
  estimatedCompletionDate: string;
  dailySchedule: Array<{
    date: string;
    recipientCount: number;
    batchNumber: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CampaignCreationRequest = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.subject ||
      !body.templateName ||
      !body.recipients ||
      !body.emailsPerDay ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: name, subject, templateName, recipients, emailsPerDay, startDate, endDate",
        },
        { status: 400 }
      );
    }

    // Validate recipients array
    if (!Array.isArray(body.recipients) || body.recipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Recipients must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Validate emails per day
    if (body.emailsPerDay <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "emailsPerDay must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date format",
        },
        { status: 400 }
      );
    }

    if (startDate < now) {
      return NextResponse.json(
        {
          success: false,
          message: "Start date cannot be in the past",
        },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "End date must be after start date",
        },
        { status: 400 }
      );
    }

    // Calculate campaign details
    const totalRecipients = body.recipients.length;
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalBatches = Math.ceil(totalRecipients / body.emailsPerDay);

    // Generate daily schedule
    const dailySchedule = [];
    let currentBatchNumber = 1;
    let remainingRecipients = totalRecipients;

    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      const recipientsForDay = Math.min(body.emailsPerDay, remainingRecipients);

      if (recipientsForDay > 0) {
        dailySchedule.push({
          date: currentDate.toISOString().split("T")[0],
          recipientCount: recipientsForDay,
          batchNumber: currentBatchNumber,
        });

        remainingRecipients -= recipientsForDay;
        currentBatchNumber++;
      }
    }

    // Generate unique campaign ID
    const campaignId = `campaign_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Here you would typically:
    // 1. Save campaign to database
    // 2. Schedule email batches
    // 3. Set up monitoring and tracking

    const response: CampaignCreationResponse = {
      success: true,
      campaignId,
      message: "Campaign created successfully",
      totalRecipients,
      estimatedCompletionDate: endDate.toISOString(),
      dailySchedule,
    };

    console.log("Campaign created:", {
      campaignId,
      name: body.name,
      totalRecipients,
      emailsPerDay: body.emailsPerDay,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const template = searchParams.get("template");
    const search = searchParams.get("search");

    // Here you would typically fetch campaigns from database
    // For now, return mock data
    const mockCampaigns = [
      {
        campaignId: "campaign_123",
        name: "Silver Jubilee Announcement Campaign",
        subject:
          "Join Us for National Ideal College Silver Jubilee Celebration",
        templateName: "silver-jubilee-announcement",
        status: "scheduled",
        totalRecipients: 150,
        createdAt: new Date().toISOString(),
        startDate: "2024-01-20T00:00:00.000Z",
        endDate: "2024-02-10T23:59:59.000Z",
      },
    ];

    return NextResponse.json({
      success: true,
      campaigns: mockCampaigns,
      pagination: {
        page,
        limit,
        total: mockCampaigns.length,
        totalPages: Math.ceil(mockCampaigns.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
