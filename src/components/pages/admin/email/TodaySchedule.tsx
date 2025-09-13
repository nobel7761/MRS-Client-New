"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMail,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiEye,
  FiDownload,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useEmailManagement } from "@/hooks/useEmailManagement";
import { TodaySchedule, RecipientDetail } from "@/types/email";
import backgroundImage from "@/public/background.jpg";

export default function TodayScheduleComponent() {
  const { loading, getTodaySchedule } = useEmailManagement();

  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule | null>(
    null
  );
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchTodaySchedule();
    // Set up polling for real-time updates
    const interval = setInterval(fetchTodaySchedule, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTodaySchedule = async () => {
    try {
      const response = await getTodaySchedule();
      console.log("TodaySchedule response:", response);
      if (response) {
        console.log("Setting todaySchedule with:", response);
        setTodaySchedule(response);
      } else {
        console.log("Response is null or undefined");
      }
    } catch (error) {
      console.error("Error fetching today's schedule:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="w-4 h-4" />;
      case "processing":
        return <FiClock className="w-4 h-4" />;
      case "scheduled":
        return <FiCalendar className="w-4 h-4" />;
      case "failed":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiMail className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) {
      return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAllRecipients = (): RecipientDetail[] => {
    console.log("getAllRecipients called, todaySchedule:", todaySchedule);
    if (!todaySchedule) {
      console.log("todaySchedule is null/undefined, returning empty array");
      return [];
    }

    console.log("todaySchedule.campaigns:", todaySchedule.campaigns);
    if (!todaySchedule.campaigns) {
      console.log("todaySchedule.campaigns is null/undefined");
      return [];
    }

    let recipients: RecipientDetail[] = [];
    todaySchedule.campaigns.forEach((campaign) => {
      campaign.batches.forEach((batch) => {
        recipients = [...recipients, ...batch.recipientDetails];
      });
    });
    return recipients;
  };

  const getFilteredRecipients = (): RecipientDetail[] => {
    let recipients = getAllRecipients();

    if (searchTerm) {
      recipients = recipients.filter(
        (r) =>
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== "all") {
      recipients = recipients.filter((r) => r.status === filterStatus);
    }

    return recipients;
  };

  const exportTodaySchedule = () => {
    if (!todaySchedule) return;

    const recipients = getFilteredRecipients();
    const csvContent = [
      "Email,Name,Status,Scheduled For,Sent At,Error,Campaign Subject,Template",
      ...recipients.map((r) => {
        const campaign = todaySchedule.campaigns.find((c) =>
          c.batches.some((b) =>
            b.recipientDetails.some((rd) => rd.email === r.email)
          )
        );
        return `"${r.email}","${r.name || ""}","${r.status}","${
          r.scheduledFor
        }","${r.sentAt || ""}","${r.error || ""}","${
          campaign?.subject || ""
        }","${campaign?.templateName || ""}"`;
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `today-schedule-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCampaignProgress = (campaign: TodaySchedule["campaigns"][0]) => {
    const totalRecipients = campaign.totalRecipients;
    const sentRecipients = campaign.batches.reduce((total, batch) => {
      return (
        total + batch.recipientDetails.filter((r) => r.status === "sent").length
      );
    }, 0);
    return totalRecipients > 0
      ? Math.round((sentRecipients / totalRecipients) * 100)
      : 0;
  };

  if (loading && !todaySchedule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="bg-cover bg-center bg-no-repeat p-5 rounded-lg"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-bold text-2xl">
            Today's Email Schedule
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportTodaySchedule}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={fetchTodaySchedule}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiCalendar className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-600">Today's Date</p>
                <p className="font-bold text-gray-900">
                  {todaySchedule
                    ? formatDate(todaySchedule.date)
                    : "Loading..."}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiMail className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todaySchedule?.totalCampaigns || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiUsers className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todaySchedule?.totalRecipients || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiCheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getAllRecipients().filter((r) => r.status === "sent").length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Campaign-wise Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Campaign Breakdown
        </h2>

        {todaySchedule?.campaigns?.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No campaigns scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaySchedule?.campaigns?.map((campaign, index) => (
              <motion.div
                key={campaign.campaignId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {campaign.subject}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Template: {campaign.templateName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getCampaignProgress(campaign)}%
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedCampaign(
                          selectedCampaign === campaign.campaignId
                            ? null
                            : campaign.campaignId
                        )
                      }
                      className="text-primary hover:text-primary-dark"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCampaignProgress(campaign)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.totalRecipients}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sent</p>
                    <p className="text-lg font-semibold text-green-600">
                      {campaign.batches.reduce(
                        (total, batch) =>
                          total +
                          batch.recipientDetails.filter(
                            (r) => r.status === "sent"
                          ).length,
                        0
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-lg font-semibold text-red-600">
                      {campaign.batches.reduce(
                        (total, batch) =>
                          total +
                          batch.recipientDetails.filter(
                            (r) => r.status === "failed"
                          ).length,
                        0
                      )}
                    </p>
                  </div>
                </div>

                {/* Expanded Recipients List */}
                {selectedCampaign === campaign.campaignId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 border-t border-gray-200 pt-4"
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Recipients
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Email
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Scheduled
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {campaign.batches
                            .flatMap((batch) => batch.recipientDetails)
                            .map((recipient, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {recipient.email}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {recipient.name || "-"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {getStatusIcon(recipient.status)}
                                    <span
                                      className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        recipient.status
                                      )}`}
                                    >
                                      {recipient.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {formatTime(recipient.scheduledFor)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* All Recipients List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Recipients for Today
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled For
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredRecipients().map((recipient, index) => {
                const campaign = todaySchedule?.campaigns.find((c) =>
                  c.batches.some((b) =>
                    b.recipientDetails.some(
                      (rd) => rd.email === recipient.email
                    )
                  )
                );

                return (
                  <motion.tr
                    key={`${recipient.email}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.01 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recipient.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recipient.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign?.subject || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(recipient.status)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            recipient.status
                          )}`}
                        >
                          {recipient.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(recipient.scheduledFor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipient.sentAt ? formatTime(recipient.sentAt) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipient.error || "-"}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center text-gray-500">
          Showing {getFilteredRecipients().length} of{" "}
          {getAllRecipients().length} recipients
        </div>
      </div>
    </div>
  );
}
