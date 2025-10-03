"use client";

import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { useApi } from "@/hooks/useApi";
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
} from "recharts";
import { ResponsiveContainer } from "recharts";
import { FaMale, FaFemale, FaUsers, FaGraduationCap } from "react-icons/fa";
import Link from "next/link";
import AnimatedButton from "@/components/shared/custom-components/animated-button";

interface SilverJubileeStats {
  totalParticipants: number;
  genderStats: {
    male: number;
    female: number;
  };
  hscYearStats: {
    [key: string]: number;
  };
  groupStats: {
    [key: string]: number;
  };
  paymentStats: {
    [key: string]: number;
  };
  amountStats: {
    [key: string]: number;
  };
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function SilverJubileeDashboard() {
  const { data: dashboardData, loading: dashboardLoading } =
    useApi<SilverJubileeStats>({
      url: "/silver-jubilee/dashboard",
    });

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

  const groupData = dashboardData
    ? Object.entries(dashboardData.groupStats).map(([group, count]) => ({
        name: group,
        value: count,
      }))
    : [];

  const paymentData = dashboardData
    ? Object.entries(dashboardData.paymentStats).map(([payment, count]) => ({
        name: payment,
        value: count,
      }))
    : [];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="bg-cover bg-center bg-no-repeat p-5 rounded-lg"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white font-bold text-3xl mb-2">
              Silver Jubilee Dashboard
            </h1>
            <p className="text-blue-100 text-lg">
              25th Anniversary Celebration Statistics
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/silver-jubilee/submit">
              <AnimatedButton
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                text="Add Participant"
              />
            </Link>
            <Link href="/admin/silver-jubilee/participants">
              <AnimatedButton
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                text="View All Participants"
              />
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary truncate">
                      Total Participants
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-primary">
                        {dashboardData?.totalParticipants}
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
                      Male Participants
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
            transition={{ duration: 0.5, delay: 0.3 }}
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
                      Female Participants
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaGraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary truncate">
                      Science Group
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-primary">
                        {dashboardData?.groupStats.Science}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {/* Gender Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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

          {/* Group Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 mt-5">
          {/* HSC Year Distribution Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
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
