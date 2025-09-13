import { NextRequest, NextResponse } from "next/server";

interface CsvRecipient {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  hscPassingYear?: number;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("csvFile") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file type. Please upload a CSV file.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size should be less than 5MB" },
        { status: 400 }
      );
    }

    // Read and parse CSV file
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    const recipients: CsvRecipient[] = [];
    const seenEmails = new Set<string>();

    // Skip header row if it exists
    const startIndex = lines[0]?.toLowerCase().includes("email") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line
        .split(",")
        .map((col) => col.trim().replace(/"/g, ""));

      const email = columns[0];
      const firstName = columns[1] || "";
      const lastName = columns[2] || "";
      const hscPassingYear = columns[3] ? parseInt(columns[3]) : undefined;
      const name = columns[1] || ""; // For backward compatibility

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) && !seenEmails.has(email.toLowerCase())) {
        seenEmails.add(email.toLowerCase());

        // Determine if this is new format (has firstName/lastName) or old format (has name)
        if (firstName && lastName) {
          // New format with firstName, lastName, hscPassingYear
          recipients.push({
            email: email.toLowerCase(),
            firstName,
            lastName,
            hscPassingYear: hscPassingYear || 2010,
          });
        } else {
          // Old format with just name (for backward compatibility)
          recipients.push({
            email: email.toLowerCase(),
            name,
            firstName: name.split(" ")[0] || "",
            lastName: name.split(" ").slice(1).join(" ") || "",
            hscPassingYear: 2010,
          });
        }
      }
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid email addresses found in CSV" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${recipients.length} recipients processed successfully`,
      recipients,
    });
  } catch (error) {
    console.error("Error processing CSV upload:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process CSV file" },
      { status: 500 }
    );
  }
}
