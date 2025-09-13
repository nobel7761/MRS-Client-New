"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
  FiRefreshCw,
  FiArrowLeft,
  FiDownload,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useEmailManagement } from "@/hooks/useEmailManagement";
import {
  Campaign,
  DailyScheduleItem,
  RecipientDetail,
  CampaignStatus,
} from "@/types/email";
import backgroundImage from "@/public/background.jpg";

interface CampaignDetailsProps {
  campaignId: string;
  onBack: () => void;
}

type TabType = "overview" | "daily-schedule" | "recipients";

export default function CampaignDetails({
  campaignId,
  onBack,
}: CampaignDetailsProps) {
  const { loading, getCampaignDetailed, cancelCampaign, retryBatch } =
    useEmailManagement();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedDay, setSelectedDay] = useState<DailyScheduleItem | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await getCampaignDetailed(campaignId);
      if (response) {
        setCampaign(response);
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    }
  };

  const handleCancelCampaign = async () => {
    if (!campaign) return;

    try {
      const success = await cancelCampaign(campaign.campaignId);
      if (success) {
        fetchCampaignDetails();
      }
    } catch (error) {
      console.error("Error cancelling campaign:", error);
    }
  };

  const handleRetryBatch = async (batchId: string) => {
    try {
      const success = await retryBatch(batchId);
      if (success) {
        fetchCampaignDetails();
      }
    } catch (error) {
      console.error("Error retrying batch:", error);
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressPercentage = () => {
    if (!campaign) return 0;
    if (campaign.status === CampaignStatus.COMPLETED) return 100;
    if (campaign.status === CampaignStatus.FAILED) return 0;

    const total =
      campaign.totalSent + campaign.totalFailed + campaign.totalPending;
    return total > 0 ? Math.round((campaign.totalSent / total) * 100) : 0;
  };

  const filteredRecipients = () => {
    if (!campaign) return [];

    let recipients: RecipientDetail[] = [];
    campaign.dailySchedule.forEach((day) => {
      recipients = [...recipients, ...day.recipientDetails];
    });

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

  const exportRecipients = () => {
    const recipients = filteredRecipients();
    const csvContent = [
      "Email,Name,Status,Scheduled For,Sent At,Error",
      ...recipients.map(
        (r) =>
          `"${r.email}","${r.name || ""}","${r.status}","${r.scheduledFor}","${
            r.sentAt || ""
          }","${r.error || ""}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-${campaignId}-recipients.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Campaign not found</p>
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
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-white font-bold text-2xl">
              {campaign.subject}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {campaign.status === CampaignStatus.SCHEDULED && (
              <button
                onClick={handleCancelCampaign}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel Campaign</span>
              </button>
            )}
            <button
              onClick={fetchCampaignDetails}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiUsers className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.totalRecipients}
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
              <FiCheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.totalSent}
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
              <FiAlertCircle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.totalFailed}
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
              <FiClock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.totalPending}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: FiMail },
              {
                id: "daily-schedule",
                label: "Daily Schedule",
                icon: FiCalendar,
              },
              { id: "recipients", label: "Recipients", icon: FiUsers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Campaign Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Subject:
                      </span>
                      <p className="text-gray-900">{campaign.subject}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Template:
                      </span>
                      <p className="text-gray-900">{campaign.templateName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(campaign.status)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            campaign.status
                          )}`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Created:
                      </span>
                      <p className="text-gray-900">
                        {formatDate(campaign.createdAt)}
                      </p>
                    </div>
                    {campaign.estimatedCompletionDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Estimated Completion:
                        </span>
                        <p className="text-gray-900">
                          {formatDate(campaign.estimatedCompletionDate)}
                        </p>
                      </div>
                    )}
                    {campaign.completedAt && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Completed:
                        </span>
                        <p className="text-gray-900">
                          {formatDate(campaign.completedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Overall Progress</span>
                        <span>{getProgressPercentage()}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {campaign.totalSent}
                        </div>
                        <div className="text-sm text-gray-500">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {campaign.totalFailed}
                        </div>
                        <div className="text-sm text-gray-500">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {campaign.totalPending}
                        </div>
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Daily Schedule Tab */}
          {activeTab === "daily-schedule" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Daily Schedule
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {campaign.dailySchedule.map((day, index) => (
                      <motion.button
                        key={day.day}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedDay(day)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          day.isToday
                            ? "border-blue-500 bg-blue-50"
                            : day.isPast
                            ? "border-gray-300 bg-gray-50"
                            : "border-gray-200 bg-white"
                        } ${
                          selectedDay?.day === day.day
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">
                            Day {day.day}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(day.date).split(",")[0]}
                          </div>
                          <div className="mt-2">
                            {getStatusIcon(day.status)}
                          </div>
                          <div className="text-xs font-medium mt-1">
                            {day.recipientCount} emails
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(
                              day.status
                            )}`}
                          >
                            {day.status}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Day Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Day Details
                  </h3>
                  {selectedDay ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Day {selectedDay.day} - {formatDate(selectedDay.date)}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Recipients:
                          </span>
                          <span className="font-medium">
                            {selectedDay.recipientCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sent:</span>
                          <span className="font-medium text-green-600">
                            {selectedDay.sentCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Failed:</span>
                          <span className="font-medium text-red-600">
                            {selectedDay.failedCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              selectedDay.status
                            )}`}
                          >
                            {selectedDay.status}
                          </span>
                        </div>
                      </div>

                      {selectedDay.recipientDetails.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Recipients
                          </h5>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {selectedDay.recipientDetails
                              .slice(0, 10)
                              .map((recipient, index) => (
                                <div
                                  key={index}
                                  className="text-xs text-gray-600"
                                >
                                  {recipient.email} - {recipient.status}
                                </div>
                              ))}
                            {selectedDay.recipientDetails.length > 10 && (
                              <div className="text-xs text-gray-500">
                                ... and{" "}
                                {selectedDay.recipientDetails.length - 10} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                      Select a day to view details
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Recipients Tab */}
          {activeTab === "recipients" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  All Recipients
                </h3>
                <button
                  onClick={exportRecipients}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search recipients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
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

              {/* Recipients Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                      {filteredRecipients().map((recipient, index) => (
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
                            {formatDate(recipient.scheduledFor)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {recipient.sentAt
                              ? formatDate(recipient.sentAt)
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {recipient.error || "-"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center text-gray-500">
                Showing {filteredRecipients().length} of{" "}
                {campaign.totalRecipients} recipients
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
