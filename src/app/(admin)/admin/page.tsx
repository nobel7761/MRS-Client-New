"use client";

import { motion } from "framer-motion";
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiMail,
  FiUser,
} from "react-icons/fi";
import backgroundImage from "@/public/background.jpg";
import { useApi } from "@/hooks/useApi";
import RoleInfo from "@/components/shared/custom-components/RoleInfo";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import { FaFemale, FaMale } from "react-icons/fa";
import { silverJubileeApi } from "@/lib/silverJubileeApi";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalSubmissions: number;
  genderStats: {
    male: number;
    female: number;
  };
  hscYearStats: {
    [key: string]: number;
  };
  hscGroupStats: {
    [key: string]: number;
  };
}

interface SilverJubileeStatistics {
  overview: {
    totalParticipants: number;
    totalRevenue: number;
    averageAmountPerParticipant: number;
  };
  byCategory: {
    counts: { [key: string]: number };
    revenue: { [key: string]: number };
    averages: { [key: string]: number };
  };
  byAmountType: {
    counts: { [key: string]: number };
    revenue: { [key: string]: number };
  };
  byPaymentMethod: {
    counts: { [key: string]: number };
    revenue: { [key: string]: number };
  };
  demographics: {
    byGroup: {
      counts: { [key: string]: number };
      revenue: { [key: string]: number };
    };
    byGender: { [key: string]: number };
    byBloodGroup: { [key: string]: number };
  };
  emailStatistics: {
    totalSent: number;
    totalNotSent: number;
    totalEmailDetails: number;
  };
  guestBabyStatistics: {
    guestsWithMainParticipant: number;
    babiesWithMainParticipant: number;
  };
  registrationTrends: {
    byDate: { [key: string]: number };
    hourlyDistribution: { [key: string]: number };
  };
  topBatches: Array<{ batch: number; count: number }>;
  allBatches: Array<{ batch: number; count: number }>;
  paymentStatus: {
    paidParticipantsTotalCount: number;
    notPaidParticipantsTotalCount: number;
    paidAlumni: {
      count: number;
      amount: number;
    };
    notPaidAlumni: {
      count: number;
      amount: number;
    };
    paidStudent: {
      count: number;
      amount: number;
    };
    notPaidStudent: {
      count: number;
      amount: number;
    };
    paidLifetimeMembership: {
      count: number;
      amount: number;
    };
    notPaidLifetimeMembership: {
      count: number;
      amount: number;
    };
    paidGuest: {
      count: number;
      amount: number;
    };
    notPaidGuest: {
      count: number;
      amount: number;
    };
    paidBaby: {
      count: number;
      amount: number;
    };
    notPaidBaby: {
      count: number;
      amount: number;
    };
    paidDonation: {
      count: number;
      amount: number;
    };
    notPaidDonation: {
      count: number;
      amount: number;
    };
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const EXTENDED_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff6b6b",
];

export default function AdminDashboard() {
  const { isAdmin } = useRoleAccess();
  const { data: dashboardData, loading: dashboardLoading } =
    useApi<DashboardStats>({
      url: "/representative-collection/dashboard",
    });

  const [silverJubileeStats, setSilverJubileeStats] =
    useState<SilverJubileeStatistics | null>(null);
  const [sjLoading, setSjLoading] = useState(true);

  useEffect(() => {
    const fetchSilverJubileeStats = async () => {
      // Only fetch if user is Admin or Super Admin
      if (!isAdmin()) {
        setSjLoading(false);
        return;
      }

      try {
        const data = await silverJubileeApi.getStatistics();
        setSilverJubileeStats(data);
      } catch (error) {
        console.error("Error fetching Silver Jubilee statistics:", error);
      } finally {
        setSjLoading(false);
      }
    };

    fetchSilverJubileeStats();
  }, [isAdmin]);

  const genderData = dashboardData
    ? [
        { name: "Male", value: dashboardData.genderStats.male },
        { name: "Female", value: dashboardData.genderStats.female },
      ]
    : [];

  const hscYearData = dashboardData
    ? Object.entries(dashboardData.hscYearStats).map(([year, count]) => ({
        year,
        count,
      }))
    : [];

  const hscGroupData = dashboardData
    ? Object.entries(dashboardData.hscGroupStats).map(([group, count]) => ({
        name: group,
        value: count,
      }))
    : [];

  // Silver Jubilee data transformations
  const categoryData = silverJubileeStats
    ? Object.entries(silverJubileeStats.byCategory.counts).map(
        ([name, value]) => ({
          name,
          value,
        })
      )
    : [];

  const paymentMethodData = silverJubileeStats
    ? Object.entries(silverJubileeStats.byPaymentMethod.counts).map(
        ([name, value]) => ({
          name,
          value,
        })
      )
    : [];

  const genderDataSJ = silverJubileeStats
    ? Object.entries(silverJubileeStats.demographics.byGender).map(
        ([name, value]) => ({
          name,
          value,
        })
      )
    : [];

  const groupData = silverJubileeStats
    ? Object.entries(silverJubileeStats.demographics.byGroup.counts).map(
        ([name, value]) => ({
          name,
          value,
        })
      )
    : [];

  const topBatchesData = silverJubileeStats?.topBatches || [];
  // Sort all batches chronologically
  const allBatchesData = silverJubileeStats?.allBatches
    ? [...silverJubileeStats.allBatches].sort((a, b) => a.batch - b.batch)
    : [];

  // Blood group data
  const bloodGroupData = silverJubileeStats
    ? Object.entries(silverJubileeStats.demographics.byBloodGroup)
        .filter(([_, value]) => value > 0) // Only show blood groups with participants
        .map(([name, value]) => ({
          name,
          value,
        }))
    : [];

  // Hourly distribution data
  const hourlyDistributionData = silverJubileeStats
    ? Object.entries(
        silverJubileeStats.registrationTrends.hourlyDistribution
      ).map(([hour, value]) => ({
        hour: parseInt(hour),
        count: value,
      }))
    : [];

  // Revenue by category
  const revenueByCategoryData = silverJubileeStats
    ? Object.entries(silverJubileeStats.byCategory.revenue).map(
        ([name, revenue]) => ({
          name,
          revenue,
        })
      )
    : [];

  // Revenue by payment method
  const revenueByPaymentMethodData = silverJubileeStats
    ? Object.entries(silverJubileeStats.byPaymentMethod.revenue).map(
        ([name, revenue]) => ({
          name,
          revenue,
        })
      )
    : [];

  const registrationTrendsData = silverJubileeStats
    ? Object.entries(silverJubileeStats.registrationTrends.byDate).map(
        ([date, value]) => ({
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          count: value,
        })
      )
    : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (dashboardLoading || sjLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <RoleInfo /> */}

      {/* Silver Jubilee Dashboard - Only for Super Admin and Admin */}
      {isAdmin() && (
        <div
          className="bg-cover bg-center bg-no-repeat p-5 rounded-lg"
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
        >
          <h1 className="text-white font-bold text-2xl pb-10">
            Silver Jubilee Dashboard
          </h1>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiUsers className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-primary truncate">
                        Total Participants
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-primary">
                          {silverJubileeStats?.overview.totalParticipants || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiDollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-primary truncate">
                        Total Money
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-primary">
                          {formatCurrency(
                            silverJubileeStats?.overview.totalRevenue || 0
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 pt-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiMail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-primary truncate">
                        Emails Sent
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-primary">
                          {silverJubileeStats?.emailStatistics.totalSent || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiMail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-primary truncate">
                        Emails Not Sent
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-primary">
                          {silverJubileeStats?.emailStatistics.totalNotSent ||
                            0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Status Overview Cards */}
          {silverJubileeStats?.paymentStatus && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 my-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.85 }}
                  className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">
                      Paid Participants
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Count:</span>
                        <span className="font-semibold text-green-700">
                          {silverJubileeStats.paymentStatus
                            .paidParticipantsTotalCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Amount:
                        </span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(
                            (silverJubileeStats.paymentStatus.paidAlumni
                              ?.amount || 0) +
                              (silverJubileeStats.paymentStatus.paidStudent
                                ?.amount || 0) +
                              (silverJubileeStats.paymentStatus
                                .paidLifetimeMembership?.amount || 0) +
                              (silverJubileeStats.paymentStatus.paidGuest
                                ?.amount || 0) +
                              (silverJubileeStats.paymentStatus.paidBaby
                                ?.amount || 0) +
                              (silverJubileeStats.paymentStatus.paidDonation
                                ?.amount || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.86 }}
                  className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">
                      Not Paid Participants
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Count:</span>
                        <span className="font-semibold text-red-700">
                          {silverJubileeStats.paymentStatus
                            .notPaidParticipantsTotalCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Pending Amount:
                        </span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(
                            (silverJubileeStats.paymentStatus.notPaidAlumni
                              ?.amount || 0) +
                              (silverJubileeStats.paymentStatus.notPaidStudent
                                ?.amount || 0) +
                              (silverJubileeStats.paymentStatus
                                .notPaidLifetimeMembership?.amount || 0) +
                              (silverJubileeStats.paymentStatus.notPaidGuest
                                ?.amount || 0) +
                              (silverJubileeStats.paymentStatus.notPaidBaby
                                ?.amount || 0) +
                              (silverJubileeStats.paymentStatus.notPaidDonation
                                ?.amount || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Paid Participants by Category */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Paid Participants by Category
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.87 }}
                    className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">
                        Paid Alumni
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-green-700">
                            {silverJubileeStats.paymentStatus.paidAlumni
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.paidAlumni
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.97 }}
                    className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">
                        Paid Guest
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-green-700">
                            {silverJubileeStats.paymentStatus.paidGuest
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.paidGuest
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.07 }}
                    className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">
                        Paid Student
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-green-700">
                            {silverJubileeStats.paymentStatus.paidStudent
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.paidStudent
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.17 }}
                    className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">
                        Paid Lifetime Membership
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-green-700">
                            {silverJubileeStats.paymentStatus
                              .paidLifetimeMembership?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus
                                .paidLifetimeMembership?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.27 }}
                    className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">
                        Paid Baby
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-green-700">
                            {silverJubileeStats.paymentStatus.paidBaby?.count ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.paidBaby
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.37 }}
                    className="bg-green-50 overflow-hidden shadow rounded-lg border-2 border-green-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">
                        Paid Donation
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-green-700">
                            {silverJubileeStats.paymentStatus.paidDonation
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.paidDonation
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Not Paid Participants by Category */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Not Paid Participants by Category
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.37 }}
                    className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Not Paid Alumni
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-red-700">
                            {silverJubileeStats.paymentStatus.notPaidAlumni
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-red-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.notPaidAlumni
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.47 }}
                    className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Not Paid Guest
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-red-700">
                            {silverJubileeStats.paymentStatus.notPaidGuest
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-red-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.notPaidGuest
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.57 }}
                    className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Not Paid Student
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-red-700">
                            {silverJubileeStats.paymentStatus.notPaidStudent
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-red-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.notPaidStudent
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.67 }}
                    className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Not Paid Lifetime Membership
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-red-700">
                            {silverJubileeStats.paymentStatus
                              .notPaidLifetimeMembership?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-red-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus
                                .notPaidLifetimeMembership?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.77 }}
                    className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Not Paid Baby
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-red-700">
                            {silverJubileeStats.paymentStatus.notPaidBaby
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-red-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.notPaidBaby
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.87 }}
                    className="bg-red-50 overflow-hidden shadow rounded-lg border-2 border-red-200"
                  >
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Not Paid Donation
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Count:</span>
                          <span className="font-semibold text-red-700">
                            {silverJubileeStats.paymentStatus.notPaidDonation
                              ?.count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount:</span>
                          <span className="font-semibold text-red-700 text-sm">
                            {formatCurrency(
                              silverJubileeStats.paymentStatus.notPaidDonation
                                ?.amount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 py-5">
            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-white backdrop-blur-md rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Category Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
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
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Gender Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="bg-white backdrop-blur-md rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Gender Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDataSJ}
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
                      {genderDataSJ.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 py-5">
            {/* Payment Method Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="bg-white backdrop-blur-md rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Payment Method Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
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
                      {paymentMethodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Group Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-white backdrop-blur-md rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Group Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={groupData}
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
                      {groupData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 py-5">
            {/* Revenue by Category */}
            {revenueByCategoryData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.15 }}
                className="bg-white backdrop-blur-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Revenue by Category
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Revenue by Payment Method */}
            {revenueByPaymentMethodData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.16 }}
                className="bg-white backdrop-blur-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Revenue by Payment Method
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByPaymentMethodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 py-5">
            {/* Blood Group Distribution */}
            {bloodGroupData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.25 }}
                className="bg-white backdrop-blur-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Blood Group Distribution
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bloodGroupData}
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
                        {bloodGroupData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              EXTENDED_COLORS[index % EXTENDED_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Hourly Distribution */}
            {hourlyDistributionData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.26 }}
                className="bg-white backdrop-blur-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Registration by Hour of Day
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 py-5">
            {/* Top Batches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="bg-white backdrop-blur-md rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Top 10 Batches by Participation
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBatchesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="batch" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#D00101" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {allBatchesData.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 py-5">
              {/* All Batches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="bg-white backdrop-blur-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  All Batches by Participation
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={allBatchesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="batch"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {registrationTrendsData.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 py-5">
              {/* Registration Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="bg-white backdrop-blur-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Daily Registration Trends
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#D00101"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Representative Submission Dashboard */}
      <div
        className="bg-cover bg-center bg-no-repeat p-5 rounded-lg"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <h1 className="text-white font-bold text-2xl pb-10">
          Representative Submission Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary truncate">
                      Total Representative Submission
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-primary">
                        {dashboardData?.totalSubmissions}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaMale className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary truncate">
                      Male Count
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-primary">
                        {dashboardData?.genderStats.male}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaFemale className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary truncate">
                      Female Count
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-primary">
                        {dashboardData?.genderStats.female}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 py-5">
          {/* Gender Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white backdrop-blur-md rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Gender Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
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
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* HSC Group Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white backdrop-blur-md rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-primary">
              HSC Group Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hscGroupData}
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
                    {hscGroupData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1">
          {/* HSC Year Distribution Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white backdrop-blur-md rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-primary">
              HSC Year Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hscYearData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#D00101" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
