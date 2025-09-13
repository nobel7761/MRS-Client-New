#!/usr/bin/env node

/**
 * Campaign Fix Script
 *
 * This script helps fix email campaigns that are stuck in draft status.
 * It will force schedule and activate campaigns to get them sending emails.
 *
 * Run it with: node fix-campaign.js
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

async function fixCampaign(campaignId) {
  console.log(`🔧 Fixing campaign: ${campaignId}`);

  // Step 1: Force schedule the campaign
  console.log("   📅 Step 1: Force scheduling campaign...");
  const scheduleResult = await makeRequest(
    `/email/campaigns/${campaignId}/force-schedule`,
    "PUT"
  );

  if (!scheduleResult.success) {
    console.log(
      `   ❌ Failed to schedule campaign: ${
        scheduleResult.data?.message || "Unknown error"
      }`
    );
    return false;
  }

  console.log("   ✅ Campaign scheduled successfully");

  // Step 2: Activate the campaign
  console.log("   🚀 Step 2: Activating campaign...");
  const activateResult = await makeRequest(
    `/email/campaigns/${campaignId}/activate`,
    "PUT"
  );

  if (!activateResult.success) {
    console.log(
      `   ❌ Failed to activate campaign: ${
        activateResult.data?.message || "Unknown error"
      }`
    );
    return false;
  }

  console.log("   ✅ Campaign activated successfully");
  return true;
}

async function checkAndFixAllPending() {
  console.log("🔍 Checking for pending campaigns...");

  const campaignsResult = await makeRequest(
    "/email/campaigns?page=1&limit=100"
  );

  if (!campaignsResult.success) {
    console.log(
      `❌ Failed to fetch campaigns: ${
        campaignsResult.data?.message || "Unknown error"
      }`
    );
    return;
  }

  const campaigns = campaignsResult.data.campaigns || [];
  const draftCampaigns = campaigns.filter(
    (c) => c.status?.toLowerCase() === "draft"
  );
  const scheduledCampaigns = campaigns.filter(
    (c) => c.status?.toLowerCase() === "scheduled"
  );

  console.log(`📊 Found ${campaigns.length} total campaigns`);
  console.log(`   - Draft: ${draftCampaigns.length}`);
  console.log(`   - Scheduled: ${scheduledCampaigns.length}`);
  console.log(
    `   - Active: ${
      campaigns.filter((c) => c.status?.toLowerCase() === "active").length
    }`
  );
  console.log("");

  if (draftCampaigns.length === 0 && scheduledCampaigns.length === 0) {
    console.log(
      "🎉 No campaigns need fixing! All campaigns are either active or completed."
    );
    return;
  }

  // Fix draft campaigns
  if (draftCampaigns.length > 0) {
    console.log("🔧 Fixing draft campaigns...");
    for (const campaign of draftCampaigns) {
      console.log(
        `\n📧 Campaign: ${campaign.name || "Unnamed"} (${campaign.id})`
      );
      console.log(`   Recipients: ${campaign.totalRecipients}`);
      console.log(`   Subject: ${campaign.subject}`);

      const success = await fixCampaign(campaign.id);
      if (success) {
        console.log(
          `   🎉 Campaign ${campaign.name || campaign.id} fixed successfully!`
        );
      } else {
        console.log(
          `   ❌ Failed to fix campaign ${campaign.name || campaign.id}`
        );
      }
    }
  }

  // Activate scheduled campaigns
  if (scheduledCampaigns.length > 0) {
    console.log("\n🚀 Activating scheduled campaigns...");
    for (const campaign of scheduledCampaigns) {
      console.log(
        `\n📧 Campaign: ${campaign.name || "Unnamed"} (${campaign.id})`
      );
      console.log(`   Recipients: ${campaign.totalRecipients}`);
      console.log(`   Subject: ${campaign.subject}`);

      const activateResult = await makeRequest(
        `/email/campaigns/${campaign.id}/activate`,
        "PUT"
      );
      if (activateResult.success) {
        console.log(
          `   ✅ Campaign ${
            campaign.name || campaign.id
          } activated successfully!`
        );
      } else {
        console.log(
          `   ❌ Failed to activate campaign ${campaign.name || campaign.id}: ${
            activateResult.data?.message || "Unknown error"
          }`
        );
      }
    }
  }

  console.log("\n🎯 Fix Summary:");
  console.log("================");
  console.log(`✅ Fixed ${draftCampaigns.length} draft campaigns`);
  console.log(`✅ Activated ${scheduledCampaigns.length} scheduled campaigns`);
  console.log("");
  console.log("📧 Your campaigns should now be sending emails!");
  console.log("⏰ Check your email service dashboard to monitor progress.");
}

async function main() {
  console.log("🚀 Email Campaign Fix Script");
  console.log("============================\n");

  // Check if a specific campaign ID was provided
  const campaignId = process.argv[2];

  if (campaignId) {
    console.log(`🎯 Fixing specific campaign: ${campaignId}`);
    const success = await fixCampaign(campaignId);
    if (success) {
      console.log("\n🎉 Campaign fixed successfully!");
    } else {
      console.log("\n❌ Failed to fix campaign");
      process.exit(1);
    }
  } else {
    // Fix all pending campaigns
    await checkAndFixAllPending();
  }

  console.log("\n✨ Script completed!");
}

// Run the script
main().catch((error) => {
  console.error("💥 Script failed:", error);
  process.exit(1);
});
