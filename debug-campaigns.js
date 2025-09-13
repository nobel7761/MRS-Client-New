#!/usr/bin/env node

/**
 * Campaign Debug Script
 *
 * This script helps debug why campaigns aren't showing up in the dashboard.
 * Run it with: node debug-campaigns.js
 */

const BASE_URL = "http://localhost:3000/api"; // Adjust this to match your server URL

async function makeRequest(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function debugCampaigns() {
  console.log("🔍 Debugging Campaign Issues...\n");

  // Test 1: Basic campaigns endpoint
  console.log("1️⃣ Testing /email/campaigns endpoint...");
  const campaigns = await makeRequest("/email/campaigns?page=1&limit=10");

  if (campaigns.success) {
    console.log("✅ Campaigns endpoint: WORKING");
    console.log(
      `   Total campaigns: ${campaigns.data.pagination?.total || "N/A"}`
    );
    console.log(
      `   Campaigns on page: ${campaigns.data.campaigns?.length || 0}`
    );
    console.log(
      `   Total pages: ${campaigns.data.pagination?.totalPages || "N/A"}`
    );

    if (campaigns.data.campaigns?.length > 0) {
      console.log("   Sample campaigns:");
      campaigns.data.campaigns.forEach((campaign, index) => {
        console.log(
          `   ${index + 1}. ${campaign.name || "Unnamed"} (${campaign.id})`
        );
        console.log(`      Status: ${campaign.status}`);
        console.log(`      Recipients: ${campaign.totalRecipients}`);
        console.log(`      Emails Sent: ${campaign.emailsSent}`);
        console.log(`      Emails Failed: ${campaign.emailsFailed}`);
        console.log("");
      });
    } else {
      console.log("   ❌ No campaigns returned from API");
    }
  } else {
    console.log("❌ Campaigns endpoint: FAILED");
    console.log(`   Error: ${campaigns.error || "Unknown error"}`);
    console.log(`   Status: ${campaigns.status}`);
  }
  console.log("");

  // Test 2: Test with higher limit
  console.log("2️⃣ Testing with higher limit (100 campaigns)...");
  const campaignsHighLimit = await makeRequest(
    "/email/campaigns?page=1&limit=100"
  );

  if (campaignsHighLimit.success) {
    console.log("✅ High limit test: WORKING");
    console.log(
      `   Total campaigns: ${
        campaignsHighLimit.data.pagination?.total || "N/A"
      }`
    );
    console.log(
      `   Campaigns returned: ${campaignsHighLimit.data.campaigns?.length || 0}`
    );

    if (campaignsHighLimit.data.campaigns?.length > 0) {
      console.log("   Campaign status breakdown:");
      const statusCounts = {};
      campaignsHighLimit.data.campaigns.forEach((campaign) => {
        const status = campaign.status || "unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`      ${status}: ${count}`);
      });
    }
  } else {
    console.log("❌ High limit test: FAILED");
  }
  console.log("");

  // Test 3: Check email stats
  console.log("3️⃣ Testing email statistics...");
  const stats = await makeRequest("/email/stats");

  if (stats.success) {
    console.log("✅ Email stats: WORKING");
    console.log(`   Total campaigns: ${stats.data.totalCampaigns || "N/A"}`);
    console.log(`   Total emails sent: ${stats.data.totalEmailsSent || "N/A"}`);
    console.log(
      `   Total emails failed: ${stats.data.totalEmailsFailed || "N/A"}`
    );
    console.log(`   Success rate: ${stats.data.successRate || "N/A"}%`);
  } else {
    console.log("❌ Email stats: FAILED");
  }
  console.log("");

  // Test 4: Check health endpoint
  console.log("4️⃣ Testing health endpoint...");
  const health = await makeRequest("/email/health");

  if (health.success) {
    console.log("✅ Health check: WORKING");
    console.log(`   Status: ${health.data.status}`);
    if (health.data.stats) {
      console.log(
        `   Campaigns in system: ${health.data.stats.campaigns?.total || "N/A"}`
      );
      console.log(
        `   Completed campaigns: ${
          health.data.stats.campaigns?.completed || "N/A"
        }`
      );
      console.log(
        `   Pending campaigns: ${health.data.stats.campaigns?.pending || "N/A"}`
      );
    }
  } else {
    console.log("❌ Health check: FAILED");
  }
  console.log("");

  // Summary
  console.log("🎯 Debug Summary:");
  console.log("==================");

  if (campaigns.success && campaigns.data.pagination?.total > 0) {
    console.log("✅ Campaigns exist in the system");
    console.log("🔍 Check if the issue is:");
    console.log("   1. Frontend filtering (check browser console)");
    console.log("   2. API response format mismatch");
    console.log("   3. Campaign status filtering");
  } else if (campaigns.success && campaigns.data.pagination?.total === 0) {
    console.log("❌ No campaigns in the system");
    console.log("🔍 This means:");
    console.log("   1. No campaigns have been created yet");
    console.log("   2. All campaigns were deleted");
    console.log("   3. Database connection issue");
  } else {
    console.log("❌ API endpoint not working");
    console.log("🔍 Check:");
    console.log("   1. Server is running");
    console.log("   2. API endpoint exists");
    console.log("   3. Database connection");
  }

  console.log("");
  console.log("💡 Next steps:");
  console.log("   1. Check browser console for errors");
  console.log("   2. Check server logs");
  console.log("   3. Verify database has campaigns");
  console.log("   4. Test API endpoints manually");
}

// Run the debug
debugCampaigns().catch(console.error);
