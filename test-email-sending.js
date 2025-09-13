#!/usr/bin/env node

/**
 * Email Service Test Script
 *
 * This script helps verify that your email service is working correctly.
 * Run it with: node test-email-sending.js
 */

const BASE_URL = "http://localhost:3000/api"; // Adjust this to match your server URL

async function testEndpoint(endpoint, method = "GET", data = null) {
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

async function runTests() {
  console.log("🧪 Testing Email Service...\n");

  // Test 1: Health Check
  console.log("1️⃣ Testing Email Service Health...");
  const health = await testEndpoint("/email/health");
  if (health.success) {
    console.log("✅ Health Check: PASSED");
    console.log(`   Status: ${health.data.status}`);
    if (health.data.stats) {
      console.log(
        `   Total Jobs: ${health.data.stats.agenda?.totalJobs || "N/A"}`
      );
      console.log(
        `   Running Jobs: ${health.data.stats.agenda?.runningJobs || "N/A"}`
      );
    }
  } else {
    console.log("❌ Health Check: FAILED");
    console.log(`   Error: ${health.error || "Unknown error"}`);
  }
  console.log("");

  // Test 2: Available Templates
  console.log("2️⃣ Testing Template Availability...");
  const templates = await testEndpoint("/email/templates");
  if (templates.success) {
    console.log("✅ Templates: PASSED");
    console.log(
      `   Available Templates: ${templates.data.templates?.length || 0}`
    );
    templates.data.templates?.forEach((template) => {
      console.log(`   - ${template.name}: ${template.description}`);
    });
  } else {
    console.log("❌ Templates: FAILED");
    console.log(`   Error: ${templates.error || "Unknown error"}`);
  }
  console.log("");

  // Test 3: Email Configuration Test
  console.log("3️⃣ Testing Email Configuration...");
  const configTest = await testEndpoint("/email/test-configuration", "POST");
  if (configTest.success) {
    console.log("✅ Configuration Test: PASSED");
    console.log(`   Message: ${configTest.data.message}`);
  } else {
    console.log("❌ Configuration Test: FAILED");
    console.log(
      `   Error: ${
        configTest.error || configTest.data?.message || "Unknown error"
      }`
    );
  }
  console.log("");

  // Test 4: Campaign List
  console.log("4️⃣ Testing Campaign Retrieval...");
  const campaigns = await testEndpoint("/email/campaigns?page=1&limit=5");
  if (campaigns.success) {
    console.log("✅ Campaigns: PASSED");
    console.log(`   Total Campaigns: ${campaigns.data.pagination?.total || 0}`);
    console.log(
      `   Campaigns on Page: ${campaigns.data.campaigns?.length || 0}`
    );

    if (campaigns.data.campaigns?.length > 0) {
      console.log("   Sample Campaigns:");
      campaigns.data.campaigns.slice(0, 3).forEach((campaign) => {
        console.log(
          `   - ${campaign.name} (${campaign.status}): ${campaign.totalRecipients} recipients`
        );
      });
    }
  } else {
    console.log("❌ Campaigns: FAILED");
    console.log(`   Error: ${campaigns.error || "Unknown error"}`);
  }
  console.log("");

  // Test 5: Today's Schedule
  console.log("5️⃣ Testing Today's Schedule...");
  const schedule = await testEndpoint("/email/schedule/today");
  if (schedule.success) {
    console.log("✅ Today's Schedule: PASSED");
    console.log(`   Date: ${schedule.data.date}`);
    console.log(`   Total Campaigns: ${schedule.data.totalCampaigns}`);
    console.log(`   Total Recipients: ${schedule.data.totalRecipients}`);
  } else {
    console.log("❌ Today's Schedule: FAILED");
    console.log(`   Error: ${schedule.error || "Unknown error"}`);
  }
  console.log("");

  // Test 6: Email Statistics
  console.log("6️⃣ Testing Email Statistics...");
  const stats = await testEndpoint("/email/stats");
  if (stats.success) {
    console.log("✅ Email Statistics: PASSED");
    console.log(`   Total Campaigns: ${stats.data.totalCampaigns || "N/A"}`);
    console.log(`   Total Emails Sent: ${stats.data.totalEmailsSent || "N/A"}`);
    console.log(`   Success Rate: ${stats.data.successRate || "N/A"}%`);
  } else {
    console.log("❌ Email Statistics: FAILED");
    console.log(`   Error: ${stats.error || "Unknown error"}`);
  }
  console.log("");

  // Test 7: Job Status
  console.log("7️⃣ Testing Job Scheduler Status...");
  const jobs = await testEndpoint("/email/jobs/status");
  if (jobs.success) {
    console.log("✅ Job Status: PASSED");
    console.log(`   Total Jobs: ${jobs.data.totalJobs || "N/A"}`);
    console.log(`   Running Jobs: ${jobs.data.runningJobs || "N/A"}`);
    console.log(`   Failed Jobs: ${jobs.data.failedJobs || "N/A"}`);
  } else {
    console.log("❌ Job Status: FAILED");
    console.log(`   Error: ${jobs.error || "Unknown error"}`);
  }
  console.log("");

  // Test 8: Scheduled Jobs
  console.log("8️⃣ Testing Scheduled Jobs...");
  const scheduledJobs = await testEndpoint("/email/jobs/scheduled");
  if (scheduledJobs.success) {
    console.log("✅ Scheduled Jobs: PASSED");
    console.log(`   Scheduled Jobs: ${scheduledJobs.data.jobs?.length || 0}`);

    if (scheduledJobs.data.jobs?.length > 0) {
      console.log("   Sample Jobs:");
      scheduledJobs.data.jobs.slice(0, 3).forEach((job) => {
        console.log(`   - ${job.name} (${job.status}): ${job.nextRunAt}`);
      });
    }
  } else {
    console.log("❌ Scheduled Jobs: FAILED");
    console.log(`   Error: ${scheduledJobs.error || "Unknown error"}`);
  }
  console.log("");

  console.log("🎯 Test Summary:");
  console.log("================");
  console.log("If all tests passed, your email service is working correctly!");
  console.log("");
  console.log("🔧 If you have issues:");
  console.log("1. Check your server is running");
  console.log("2. Verify your .env configuration");
  console.log("3. Check server logs for errors");
  console.log("4. Ensure MongoDB is connected");
  console.log("5. Verify SMTP settings are correct");
  console.log("");
  console.log(
    "📚 For more help, check the Email Campaign Fix Guide in your documentation."
  );
}

// Run the tests
runTests().catch(console.error);
