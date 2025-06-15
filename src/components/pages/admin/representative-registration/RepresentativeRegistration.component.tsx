"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "@/public/background.jpg";
import { MUIDataTableColumnDef, MUIDataTableOptions } from "mui-datatables";
// Force default import with type assertion
import MUIDataTableImport from "mui-datatables";
const MUIDataTable = MUIDataTableImport as unknown as React.ComponentType<any>;
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

export function getMuiDatatableOptions(
  downloadFileName: string,
  more?: MUIDataTableOptions
): MUIDataTableOptions {
  return {
    print: false,
    selectableRows: undefined,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 75, 100],
    downloadOptions: {
      filename: downloadFileName,
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    textLabels: {
      body: {
        noMatch: "No matching record found",
      },
      pagination: {
        rowsPerPage: "Rows per page",
      },
    },
    ...more,
  };
}

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

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "hscYear",
      label: "HSC Year",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "hscGroup",
      label: "HSC Group",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "phone",
      label: "Phone",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "facebookUrl",
      label: "Facebook",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View Profile
          </a>
        ),
      },
    },
    {
      name: "comments",
      label: "Comments",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRender: (value: string) => value || "-",
      },
    },
  ];

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
          <div className="bg-white rounded-lg">
            {data && (
              <MUIDataTable
                title="Representative Submission List"
                data={data}
                columns={columns}
                options={getMuiDatatableOptions("representative-list.csv")}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RepresentativeRegistrationComponent;
