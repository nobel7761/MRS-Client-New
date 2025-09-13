"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiEye,
  FiX,
  FiRefreshCw,
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPlay,
  FiPause,
  FiZap,
  FiInfo,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useEmailManagement } from "@/hooks/useEmailManagement";
import {
  SimpleCampaign,
  SimplePaginatedCampaignsResponse,
  CampaignFilters,
} from "@/types/email";
import backgroundImage from "@/public/background.jpg";

interface CampaignDashboardProps {
  onCreateCampaign: () => void;
  onViewCampaign: (campaignId: string) => void;
}

export default function CampaignDashboard({
  onCreateCampaign,
  onViewCampaign,
}: CampaignDashboardProps) {
  const {
    getCampaigns,
    forceScheduleCampaign: hookForceSchedule,
    activateCampaign: hookActivateCampaign,
    pauseCampaign: hookPauseCampaign,
    checkPendingCampaigns,
  } = useEmailManagement();
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<SimpleCampaign[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Separate state for comprehensive stats
  const [campaignStats, setCampaignStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalEmailsSent: 0,
    totalEmailsFailed: 0,
    totalEmailsScheduled: 0,
  });

  const fetchCampaigns = async (
    page: number = 1,
    newFilters?: CampaignFilters
  ) => {
    try {
      setIsLoading(true);
      const response = await getCampaigns(page, 10, newFilters || filters);
      if (response) {
        console.log("Campaigns API Response:", response); // Debug log
        setCampaigns(response.campaigns);
        setTotalPages(response.pagination.totalPages);

        // Workaround: If API returns 0 total but we have campaigns, calculate it ourselves
        const actualTotal =
          response.pagination.total > 0
            ? response.pagination.total
            : response.campaigns.length;

        setTotalCampaigns(actualTotal);

        // Debug: Log what we received
        console.log("Total campaigns from API:", response.pagination.total);
        console.log("Actual total (with workaround):", actualTotal);
        console.log("Campaigns on this page:", response.campaigns.length);
        console.log(
          "Campaign statuses:",
          response.campaigns.map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
          }))
        );

        // If we have campaigns but no comprehensive stats, calculate fallback stats
        if (
          response.campaigns.length > 0 &&
          campaignStats.totalCampaigns === 0
        ) {
          calculateStatsFromVisibleCampaigns();
        }
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from visible campaigns as fallback
  const calculateStatsFromVisibleCampaigns = () => {
    if (campaigns.length > 0) {
      const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(
          (c) => c.status?.toLowerCase() === "active"
        ).length,
        totalEmailsSent: campaigns.reduce(
          (sum, c) => sum + (c?.emailsSent || 0),
          0
        ),
        totalEmailsFailed: campaigns.reduce(
          (sum, c) => sum + (c?.emailsFailed || 0),
          0
        ),
        totalEmailsScheduled: campaigns.reduce(
          (sum, c) => sum + (c?.emailsScheduled || 0),
          0
        ),
      };

      console.log("Fallback stats from visible campaigns:", stats);
      setCampaignStats(stats);
    }
  };

  // Fetch comprehensive stats (not limited by pagination)
  const fetchComprehensiveStats = async () => {
    try {
      // Get all campaigns for stats calculation (with a higher limit)
      const allCampaignsResponse = await getCampaigns(1, 1000, {});
      if (allCampaignsResponse) {
        const allCampaigns = allCampaignsResponse.campaigns || [];

        // Workaround: If API returns 0 total but we have campaigns, use the actual count
        const actualTotal =
          allCampaignsResponse.pagination.total > 0
            ? allCampaignsResponse.pagination.total
            : allCampaigns.length;

        const stats = {
          totalCampaigns: actualTotal,
          activeCampaigns: allCampaigns.filter(
            (c) => c.status?.toLowerCase() === "active"
          ).length,
          totalEmailsSent: allCampaigns.reduce(
            (sum, c) => sum + (c?.emailsSent || 0),
            0
          ),
          totalEmailsFailed: allCampaigns.reduce(
            (sum, c) => sum + (c?.emailsFailed || 0),
            0
          ),
          totalEmailsScheduled: allCampaigns.reduce(
            (sum, c) => sum + (c?.emailsScheduled || 0),
            0
          ),
        };

        console.log("Comprehensive Stats:", stats);
        console.log(
          "API returned total:",
          allCampaignsResponse.pagination.total
        );
        console.log("Actual campaigns found:", allCampaigns.length);
        setCampaignStats(stats);
      } else {
        // Fallback to visible campaigns if comprehensive fetch fails
        calculateStatsFromVisibleCampaigns();
      }
    } catch (error) {
      console.error("Error fetching comprehensive stats:", error);
      // Fallback to visible campaigns if comprehensive fetch fails
      calculateStatsFromVisibleCampaigns();
    }
  };

  // Campaign management actions
  const handleForceSchedule = async (campaignId: string) => {
    try {
      setActionLoading(`schedule-${campaignId}`);
      const success = await hookForceSchedule(campaignId);
      if (success) {
        await fetchCampaigns(currentPage, filters);
      }
    } catch (error) {
      console.error("Error scheduling campaign:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateCampaign = async (campaignId: string) => {
    try {
      setActionLoading(`activate-${campaignId}`);
      const success = await hookActivateCampaign(campaignId);
      if (success) {
        await fetchCampaigns(currentPage, filters);
      }
    } catch (error) {
      console.error("Error activating campaign:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      setActionLoading(`pause-${campaignId}`);
      const success = await hookPauseCampaign(campaignId);
      if (success) {
        await fetchCampaigns(currentPage, filters);
      }
    } catch (error) {
      console.error("Error pausing campaign:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Initial data load
  // Note: In development with React Strict Mode, this effect runs twice
  // This is normal behavior and helps detect side effects
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await fetchCampaigns(currentPage, filters);
        await fetchComprehensiveStats(); // Fetch comprehensive stats on initial load
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Handle search term changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setFilters((prev) => ({ ...prev, search: searchTerm }));
      } else {
        setFilters((prev) => {
          const { search, ...rest } = prev;
          return rest;
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch campaigns when page or filters change (but not on initial load)
  useEffect(() => {
    if (campaigns.length > 0 || filters.search) {
      fetchCampaigns(currentPage, filters);
    }
  }, [currentPage, filters]);

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <FiMail className="w-4 h-4" />;

    switch (status.toLowerCase()) {
      case "active":
        return <FiCheckCircle className="w-4 h-4" />;
      case "completed":
        return <FiCheckCircle className="w-4 h-4" />;
      case "scheduled":
        return <FiCalendar className="w-4 h-4" />;
      case "draft":
        return <FiMail className="w-4 h-4" />;
      case "failed":
        return <FiAlertCircle className="w-4 h-4" />;
      case "paused":
        return <FiClock className="w-4 h-4" />;
      case "cancelled":
        return <FiX className="w-4 h-4" />;
      default:
        return <FiMail className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (campaign: SimpleCampaign) => {
    if (!campaign.status) return 0;
    if (campaign.status.toLowerCase() === "completed") return 100;
    if (campaign.status.toLowerCase() === "failed") return 0;

    const total = campaign.totalRecipients || 0;
    const sent = campaign.emailsSent || 0;
    const failed = campaign.emailsFailed || 0;
    const scheduled = campaign.emailsScheduled || 0;

    if (total === 0) return 0;

    const completed = sent + failed;
    return Math.round((completed / total) * 100);
  };

  const getCampaignActions = (campaign: SimpleCampaign) => {
    const status = campaign.status?.toLowerCase();
    const actions = [];

    // View action is always available
    actions.push(
      <button
        key="view"
        onClick={() => campaign.id && onViewCampaign(campaign.id)}
        className="text-primary hover:text-primary-dark flex items-center space-x-1 disabled:opacity-50"
        disabled={!campaign.id}
        title="View Campaign Details"
      >
        <FiEye className="h-4 w-4" />
        <span>View</span>
      </button>
    );

    // Status-specific actions
    if (status === "draft") {
      actions.push(
        <button
          key="schedule"
          onClick={() => campaign.id && handleForceSchedule(campaign.id)}
          disabled={actionLoading === `schedule-${campaign.id}`}
          className="text-yellow-600 hover:text-yellow-700 flex items-center space-x-1 disabled:opacity-50"
          title="Force Schedule Campaign"
        >
          <FiZap className="h-4 w-4" />
          <span>
            {actionLoading === `schedule-${campaign.id}`
              ? "Scheduling..."
              : "Schedule"}
          </span>
        </button>
      );
    }

    if (status === "scheduled") {
      actions.push(
        <button
          key="activate"
          onClick={() => campaign.id && handleActivateCampaign(campaign.id)}
          disabled={actionLoading === `activate-${campaign.id}`}
          className="text-green-600 hover:text-green-700 flex items-center space-x-1 disabled:opacity-50"
          title="Activate Campaign"
        >
          <FiPlay className="h-4 w-4" />
          <span>
            {actionLoading === `activate-${campaign.id}`
              ? "Activating..."
              : "Activate"}
          </span>
        </button>
      );
    }

    if (status === "active") {
      actions.push(
        <button
          key="pause"
          onClick={() => campaign.id && handlePauseCampaign(campaign.id)}
          disabled={actionLoading === `pause-${campaign.id}`}
          className="text-orange-600 hover:text-orange-700 flex items-center space-x-1 disabled:opacity-50"
          title="Pause Campaign"
        >
          <FiPause className="h-4 w-4" />
          <span>
            {actionLoading === `pause-${campaign.id}` ? "Pausing..." : "Pause"}
          </span>
        </button>
      );
    }

    return actions;
  };

  const handleFilterChange = (key: keyof CampaignFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  if (isLoading && campaigns.length === 0) {
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
        <div className="flex items-center justify-between">
          <h1 className="text-white font-bold text-2xl">Email Campaigns</h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCreateCampaign}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
            <button
              onClick={async () => {
                setIsLoading(true);
                await fetchCampaigns(currentPage);
                await fetchComprehensiveStats();
              }}
              disabled={isLoading}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await checkPendingCampaigns();
                  await fetchCampaigns(currentPage, filters);
                  await fetchComprehensiveStats();
                } catch (error) {
                  console.error("Error checking pending campaigns:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50"
              title="Check and schedule all pending campaigns"
            >
              <FiZap className="w-4 h-4" />
              <span>Fix All</span>
            </button>
          </div>
        </div>
        <p className="text-white text-sm mb-6 italic">
          This is our main control center where we can see all out email
          campaigns at a glance.
        </p>

        {/* Campaign Status Guide */}
        <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-2">Campaign Status Guide:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="font-medium">Draft:</span> Campaign created
                  but not scheduled.
                  <span className="text-yellow-600 font-medium">
                    {" "}
                    Click "Schedule" to start sending emails.
                  </span>
                </div>
                <div>
                  <span className="font-medium">Scheduled:</span> Campaign is
                  scheduled but not active.
                  <span className="text-green-600 font-medium">
                    {" "}
                    Click "Activate" to start sending emails.
                  </span>
                </div>
                <div>
                  <span className="font-medium">Active:</span> Campaign is
                  currently sending emails.
                  <span className="text-orange-600 font-medium">
                    {" "}
                    Click "Pause" to stop temporarily.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove this after fixing */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <FiInfo className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">
                  Debug Info (Development Only):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium">API Total:</span>{" "}
                    {totalCampaigns}
                  </div>
                  <div>
                    <span className="font-medium">Page Campaigns:</span>{" "}
                    {campaigns.length}
                  </div>
                  <div>
                    <span className="font-medium">Comprehensive Total:</span>{" "}
                    {campaignStats.totalCampaigns}
                  </div>
                  <div>
                    <span className="font-medium">Current Filters:</span>{" "}
                    {JSON.stringify(filters)}
                  </div>
                </div>
                <button
                  onClick={fetchComprehensiveStats}
                  className="mt-2 px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-xs"
                >
                  Refresh Stats
                </button>
                <button
                  onClick={calculateStatsFromVisibleCampaigns}
                  className="mt-2 ml-2 px-2 py-1 bg-green-200 hover:bg-green-300 rounded text-xs"
                >
                  Use Visible Campaigns
                </button>
                <button
                  onClick={async () => {
                    console.log("Testing API directly...");
                    try {
                      const response = await getCampaigns(1, 100, {});
                      console.log("Direct API test:", response);
                    } catch (error) {
                      console.error("Direct API test failed:", error);
                    }
                  }}
                  className="mt-2 ml-2 px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-xs"
                >
                  Test API
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-90 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiMail className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : campaignStats.totalCampaigns}
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
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaignStats.activeCampaigns}
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
              <FiUsers className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaignStats.totalEmailsSent}
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
              <FiAlertCircle className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaignStats.totalEmailsFailed}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white bg-opacity-90 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value || undefined)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filters.template || ""}
                onChange={(e) =>
                  handleFilterChange("template", e.target.value || undefined)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Templates</option>
                <option value="silver-jubilee-announcement">
                  Silver Jubilee
                </option>
                <option value="welcome">Welcome</option>
                <option value="newsletter">Newsletter</option>
                <option value="notification">Notification</option>
              </select>

              <input
                type="date"
                value={
                  filters.dateFrom
                    ? new Date(filters.dateFrom).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleFilterChange(
                    "dateFrom",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="From Date"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emails Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(campaigns || [])
                .filter((campaign) => campaign && campaign.id)
                .map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiMail className="h-5 w-5 text-primary mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.name || "Unnamed Campaign"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {campaign.subject || "No Subject"}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID:{" "}
                            {campaign.id
                              ? campaign.id.slice(0, 8) + "..."
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(campaign.status)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            campaign.status
                          )}`}
                        >
                          {campaign.status}
                        </span>
                        {campaign.status?.toLowerCase() === "draft" && (
                          <div
                            className="ml-2"
                            title="Campaign needs to be scheduled before emails will be sent"
                          >
                            <FiInfo className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.totalRecipients || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(campaign)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(campaign)}% complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">
                            ✓ {campaign.emailsSent || 0} sent
                          </span>
                          {(campaign.emailsFailed || 0) > 0 && (
                            <span className="text-red-600">
                              ✗ {campaign.emailsFailed || 0} failed
                            </span>
                          )}
                          {(campaign.emailsScheduled || 0) > 0 && (
                            <span className="text-yellow-600">
                              ⏰ {campaign.emailsScheduled || 0} scheduled
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        {getCampaignActions(campaign)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
