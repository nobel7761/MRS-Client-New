"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { souvenirApi, Souvenir } from "@/lib/souvenirApi";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    "memory-writeup": "স্মৃতিচারণ (Memory Write-up)",
    story: "গল্প (Story)",
    poem: "কবিতা (Poem)",
    article: "প্রবন্ধ/নিবন্ধ (Article)",
    "batch-message": "শুভেচ্ছা বার্তা (Batch Message)",
    "one-liner": "এক লাইনের বার্তা (One-Liner)",
    artwork: "চিত্র/আর্টवर्क (Artwork)",
    "batch-photo": "ব্যাচ গ্রুপ ছবি (Batch Photo)",
    "old-campus-photo": "ক্যাম্পাস পুরোনো ছবি (Old Campus Photo)",
    "new-campus-photo": "ক্যাম্পাস নতুন ছবি (New Photos)",
    "humor-comic": "Humor / Comic Corner",
    "quote-thought": "Quote / Thought",
    "alumni-spotlight": "Alumni Spotlight Profile",
    "teacher-tribute": "Teacher Tribute",
    "interview-suggestion": "Interview Suggestion",
    "sponsor-message": "Sponsor Message (For Sponsors)",
  };
  return categoryMap[category] || category;
};

const getGroupLabel = (group: string) => {
  const groupMap: Record<string, string> = {
    science: "Science",
    "business-studies": "Business Studies",
    humanities: "Humanities",
  };
  return groupMap[group] || group;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SouvenirView = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [souvenir, setSouvenir] = useState<Souvenir | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSouvenir = async () => {
      try {
        setLoading(true);
        const data = await souvenirApi.getById(id);
        setSouvenir(data);
      } catch (error: any) {
        console.error("Error fetching souvenir:", error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch souvenir"
        );
        router.push("/admin/silver-jubilee/souvenir-management");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSouvenir();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!souvenir) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Souvenir not found</p>
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={() =>
              router.push("/admin/silver-jubilee/souvenir-management")
            }
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Souvenir Details
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            View souvenir submission details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={() =>
              router.push("/admin/silver-jubilee/souvenir-management")
            }
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<FaEdit />}
            onClick={() =>
              router.push(
                `/admin/silver-jubilee/souvenir-management/${id}/edit`
              )
            }
            sx={{
              backgroundColor: "#6366f1",
              "&:hover": {
                backgroundColor: "#4f46e5",
              },
            }}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Photo Section */}
        {souvenir.photoUrl && (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-8 flex justify-center">
            <div className="relative">
              <img
                src={souvenir.photoUrl}
                alt={souvenir.name}
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Name */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Name
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {souvenir.name}
              </p>
            </div>

            {/* Category */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Category
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {getCategoryLabel(souvenir.category)}
              </p>
            </div>

            {/* Batch */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Batch
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {souvenir.batch}
              </p>
            </div>

            {/* Group */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Group
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {getGroupLabel(souvenir.group)}
              </p>
            </div>

            {/* Phone Number */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Phone Number
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {souvenir.phoneNumber}
              </p>
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Email
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1 break-all">
                {souvenir.email}
              </p>
            </div>

            {/* Submission Date */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Submission Date
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {formatDate(souvenir.createdAt)}
              </p>
            </div>

            {/* Last Updated */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Last Updated
              </label>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {formatDate(souvenir.updatedAt)}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
              Content
            </label>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: souvenir.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SouvenirView;
