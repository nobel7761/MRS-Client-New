"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiCalendar,
  FiClock,
  FiBarChart,
  FiPieChart,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useEmailManagement } from "@/hooks/useEmailManagement";
import { EmailStats as EmailStatsType, CampaignStatus } from "@/types/email";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import backgroundImage from "@/public/background.jpg";

export default function EmailStatsComponent() {
  const { loading, getEmailStats } = useEmailManagement();

  const [stats, setStats] = useState<EmailStatsType | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await getEmailStats();
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error("Error fetching email statistics:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "processing":
        return "#3B82F6";
      case "scheduled":
        return "#F59E0B";
      case "failed":
        return "#EF4444";
      case "cancelled":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return "0%";
    return Math.round((value / total) * 100) + "%";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <FiTrendingUp className="w-4 h-4 text-green-600" />;
    } else if (current < previous) {
      return <FiTrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) {
      return "text-green-600";
    } else if (current < previous) {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  const getTrendText = (current: number, previous: number) => {
    if (previous === 0) return "N/A";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Prepare data for charts
  const prepareDailyStatsData = () => {
    if (!stats?.dailyStats) return [];

    return stats.dailyStats.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      emailsSent: day.emailsSent,
      emailsFailed: day.emailsFailed,
      campaignsActive: day.campaignsActive,
    }));
  };

  const prepareCampaignStatusData = () => {
    if (!stats?.campaignsByStatus) return [];

    return Object.entries(stats.campaignsByStatus).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: getStatusColor(status),
    }));
  };

  const prepareMonthlyData = () => {
    if (!stats?.emailsSentByMonth) return [];

    return stats.emailsSentByMonth.map((month) => ({
      month: month.month,
      count: month.count,
    }));
  };

  if (loading && !stats) {
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
          <h1 className="text-white font-bold text-2xl">Email Statistics</h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "7d" | "30d" | "90d")
              }
              className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button
              onClick={fetchStats}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Total Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats?.totalCampaigns || 0)}
                </p>
              </div>
              <FiMail className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          {/* Active Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats?.activeCampaigns || 0)}
                </p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          {/* Emails Sent Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats?.emailsSentToday || 0)}
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          {/* Failed Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats?.failedToday || 0)}
                </p>
              </div>
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.successRate
                    ? `${stats.successRate.toFixed(1)}%`
                    : "N/A"}
                </p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          {/* Average Delivery Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageDeliveryTime
                    ? `${stats.averageDeliveryTime.toFixed(1)}s`
                    : "N/A"}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Email Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Daily Email Trends
            </h2>
            <FiBarChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareDailyStatsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="emailsSent"
                stroke="#10B981"
                strokeWidth={2}
                name="Emails Sent"
              />
              <Line
                type="monotone"
                dataKey="emailsFailed"
                stroke="#EF4444"
                strokeWidth={2}
                name="Emails Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Campaign Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Campaign Status Distribution
            </h2>
            <FiPieChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareCampaignStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareCampaignStatusData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Email Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Email Volume
            </h2>
            <FiBarChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Performance Metrics
            </h2>
            <FiTrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Average Delivery Time
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.averageDeliveryTime
                    ? `${stats.averageDeliveryTime.toFixed(2)}s`
                    : "N/A"}
                </p>
              </div>
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Active Campaigns
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.activeCampaigns || 0}
                </p>
              </div>
              <FiMail className="w-6 h-6 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Completed Campaigns
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.campaignsByStatus?.[CampaignStatus.COMPLETED] || 0}
                </p>
              </div>
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Detailed Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Campaign Status Breakdown */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Campaign Status
            </h3>
            <div className="space-y-3">
              {stats?.campaignsByStatus &&
                Object.entries(stats.campaignsByStatus).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getStatusColor(status) }}
                        ></div>
                        <span className="text-sm text-gray-600 capitalize">
                          {status}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {count}
                      </span>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* Email Performance */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Email Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sent Today</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatNumber(stats?.emailsSentToday || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed Today</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatNumber(stats?.failedToday || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats?.successRate
                    ? `${stats.successRate.toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Delivery Time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats?.averageDeliveryTime
                    ? `${stats.averageDeliveryTime.toFixed(2)}s`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {stats?.dailyStats &&
                stats.dailyStats
                  .slice(-5)
                  .reverse()
                  .map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {day.emailsSent} emails sent
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {day.campaignsActive}
                        </p>
                        <p className="text-xs text-gray-500">
                          active campaigns
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
