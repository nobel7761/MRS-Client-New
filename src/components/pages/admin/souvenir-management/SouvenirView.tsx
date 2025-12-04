"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { souvenirApi, Souvenir } from "@/lib/souvenirApi";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import {
  FaEdit,
  FaArrowLeft,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    "memory-writeup": "স্মৃতিচারণ (Memory Write-up)",
    story: "গল্প (Story)",
    poem: "কবিতা (Poem)",
    article: "প্রবন্ধ/নিবন্ধ (Article)",
    "batch-message": "শুভেচ্ছা বার্তা (Batch Message)",
    "one-liner": "এক লাইনের বার্তা (One-Liner)",
    "humor-comic": "Humor / Comic Corner",
    "quote-thought": "Quote / Thought",
    "alumni-spotlight": "Alumni Spotlight Profile",
    "teacher-tribute": "Teacher Tribute",
    "sponsor-message": "Sponsor Message (For Sponsors)",
    "photo-gallery": "Photo Gallery",
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [imageLoading, setImageLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [selectedImageIndex]);

  // Reset image loading state when image changes
  useEffect(() => {
    if (selectedImageIndex !== null) {
      setImageLoading(true);
    }
  }, [selectedImageIndex]);

  // Navigation function
  const navigateImage = useCallback(
    (direction: number) => {
      if (!souvenir?.photoUrls || selectedImageIndex === null) return;
      const newIndex =
        direction === 1
          ? selectedImageIndex < souvenir.photoUrls.length - 1
            ? selectedImageIndex + 1
            : 0
          : selectedImageIndex > 0
          ? selectedImageIndex - 1
          : souvenir.photoUrls.length - 1;
      setSelectedImageIndex(newIndex);
    },
    [souvenir?.photoUrls, selectedImageIndex]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedImageIndex === null || !souvenir?.photoUrls) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowLeft" && souvenir.photoUrls) {
        e.preventDefault();
        navigateImage(-1);
      } else if (e.key === "ArrowRight" && souvenir.photoUrls) {
        e.preventDefault();
        navigateImage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, souvenir, navigateImage]);

  // Touch handlers for swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateImage(1);
    } else if (isRightSwipe) {
      navigateImage(-1);
    }
  };

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
        {/* Photo Section - Single photo for non-photo-gallery */}
        {souvenir.photoUrl && souvenir.category !== "photo-gallery" && (
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

            {/* Professional Details */}
            {souvenir.professionalDetails && (
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Professional Details
                </label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {souvenir.professionalDetails}
                </p>
              </div>
            )}

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

          {/* Photo Gallery Section - For photo-gallery category */}
          {souvenir.category === "photo-gallery" &&
            souvenir.photoUrls &&
            souvenir.photoUrls.length > 0 && (
              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-4">
                  Photo Gallery
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {souvenir.photoUrls.map((photoUrl, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="aspect-square w-full overflow-hidden bg-gray-100">
                        <img
                          src={photoUrl}
                          alt={`${souvenir.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-medium">
                          Photo {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  {souvenir.photoUrls.length} photo
                  {souvenir.photoUrls.length !== 1 ? "s" : ""} in gallery
                </p>
              </div>
            )}

          {/* Image Lightbox Modal - Industry Standard Full Screen */}
          {selectedImageIndex !== null &&
            souvenir.photoUrls &&
            souvenir.photoUrls.length > 0 && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black animate-in fade-in duration-200"
                onClick={() => setSelectedImageIndex(null)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(null);
                  }}
                  className="absolute top-6 right-6 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 bg-black/40 hover:bg-black/60 rounded-full p-3 backdrop-blur-sm"
                  aria-label="Close"
                >
                  <FaTimes className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                {/* Navigation Buttons */}
                {souvenir.photoUrls.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage(-1);
                      }}
                      className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 bg-black/40 hover:bg-black/60 rounded-full p-3 md:p-4 backdrop-blur-sm"
                      aria-label="Previous"
                    >
                      <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage(1);
                      }}
                      className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110 bg-black/40 hover:bg-black/60 rounded-full p-3 md:p-4 backdrop-blur-sm"
                      aria-label="Next"
                    >
                      <FaChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}

                {/* Image Container - Full Screen */}
                <div
                  className="w-full h-full flex items-center justify-center p-4 md:p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgress
                        sx={{ color: "white" }}
                        size={60}
                        thickness={4}
                      />
                    </div>
                  )}
                  <img
                    src={souvenir.photoUrls[selectedImageIndex]}
                    alt={`${souvenir.name} - Photo ${selectedImageIndex + 1}`}
                    className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    draggable={false}
                  />
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm md:text-base font-medium">
                  {selectedImageIndex + 1} / {souvenir.photoUrls.length}
                </div>
              </div>
            )}

          {/* Content Section - For non-photo-gallery categories */}
          {souvenir.category !== "photo-gallery" && souvenir.content && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SouvenirView;
