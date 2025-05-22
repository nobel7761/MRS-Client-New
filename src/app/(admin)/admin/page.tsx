"use client";

import { motion } from "framer-motion";
import { FiUsers, FiDollarSign, FiShoppingCart } from "react-icons/fi";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboard() {
  const { data: dashboardData, loading: dashboardLoading } =
    useApi<DashboardStats>({
      url: "/representative-collection/dashboard",
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

  const hscGroupData = dashboardData
    ? Object.entries(dashboardData.hscGroupStats).map(([group, count]) => ({
        name: group,
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
                  <FiDollarSign className="h-6 w-6 text-primary" />
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
                  <FiDollarSign className="h-6 w-6 text-primary" />
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
