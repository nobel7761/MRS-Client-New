"use client";

import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";

interface Representative {
  id: string;
  name: string;
  hscYear: number;
  hscGroup: string;
  gender: string;
  phone: string;
  facebookUrl: string;
  comments: string;
}

const columnHelper = createColumnHelper<Representative>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("hscYear", {
    header: "HSC Year",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("hscGroup", {
    header: "HSC Group",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("facebookUrl", {
    header: "Facebook URL",
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        View Profile
      </a>
    ),
  }),
  columnHelper.accessor("comments", {
    header: "Comments",
    cell: (info) => info.getValue() || "-",
  }),
];

const RepresentativeRegistrationComponent = () => {
  const [data, setData] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/representative-collection`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching representative data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 bg-cover bg-center bg-no-repeat rounded-lg"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-2xl font-medium text-white">
            Representative Submission List
          </h3>
          <div className="mt-4">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                          <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RepresentativeRegistrationComponent;
