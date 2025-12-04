"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheckCircle, HiSelector } from "react-icons/hi";
import backgroundImage from "@/public/background.jpg";
import dynamic from "next/dynamic";
import {
  validateFile,
  createImagePreview,
  revokeImagePreview,
  SUPPORTED_IMAGE_TYPES,
} from "@/utils/imageUpload";
import ReactHookFormPhoneNumberField from "@/components/shared/Forms/ReactHookFormPhoneNumberField";
import heic2any from "heic2any";
import { souvenirApi } from "@/lib/souvenirApi";

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // @ts-ignore
    await import("react-quill/dist/quill.snow.css");
    return RQ;
  },
  { ssr: false }
);

// Quill editor configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
];

type FormValues = {
  category: string;
  name: string;
  batch: string;
  group: string;
  phoneNumber: string;
  email: string;
  professionalDetails: string;
  photo: File | null;
  photos: File[] | null; // For photo gallery
  content: string;
};

const defaultFormValues: FormValues = {
  category: "",
  name: "",
  batch: "",
  group: "",
  phoneNumber: "",
  email: "",
  professionalDetails: "",
  photo: null,
  photos: null,
  content: "",
};

const categoryOptions = [
  { value: "memory-writeup", label: "স্মৃতিচারণ (Memory Write-up)" },
  { value: "story", label: "গল্প (Story)" },
  { value: "poem", label: "কবিতা (Poem)" },
  { value: "article", label: "প্রবন্ধ/নিবন্ধ (Article)" },
  { value: "batch-message", label: "শুভেচ্ছা বার্তা (Batch Message)" },
  { value: "one-liner", label: "এক লাইনের বার্তা (One-Liner)" },
  { value: "humor-comic", label: "Humor / Comic Corner" },
  { value: "quote-thought", label: "Quote / Thought" },
  { value: "alumni-spotlight", label: "Alumni Spotlight Profile" },
  { value: "teacher-tribute", label: "Teacher Tribute" },
  { value: "sponsor-message", label: "Sponsor Message (For Sponsors)" },
  { value: "photo-gallery", label: "Photo Gallery" },
];

const groupOptions = [
  { value: "science", label: "Science" },
  { value: "business-studies", label: "Business Studies" },
  { value: "humanities", label: "Humanities" },
];

const batchOptions = Array.from({ length: 2027 - 2003 + 1 }, (_, index) => {
  const year = 2003 + index;
  return { value: year.toString(), label: year.toString() };
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Word limits for specific categories
const categoryWordLimits: Record<string, number> = {
  "memory-writeup": 200, // স্মৃতিচারণ
  story: 200, // গল্প
  article: 200, // প্রবন্ধ/নিবন্ধ
};

// Function to count words from HTML content
const countWords = (html: string): number => {
  if (!html) return 0;
  // Remove HTML tags and decode HTML entities
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .trim();
  // Split by whitespace and filter out empty strings
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  return words.length;
};

const ShronikaSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animateSuccessModal, setAnimateSuccessModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValidContentRef = useRef<string>("");
  const quillWrapperRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const selectedCategory = watch("category");
  const contentValue = watch("content");

  // Get word limit for selected category
  const wordLimit = selectedCategory
    ? categoryWordLimits[selectedCategory]
    : null;
  const currentWordCount = countWords(contentValue || "");

  const closeSuccessModal = useCallback(() => {
    setAnimateSuccessModal(false);
    if (modalCloseTimeout.current) {
      clearTimeout(modalCloseTimeout.current);
    }
    modalCloseTimeout.current = setTimeout(() => {
      setShowSuccessModal(false);
      modalCloseTimeout.current = null;
    }, 200);
  }, []);

  useEffect(() => {
    if (!showSuccessModal) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      setAnimateSuccessModal(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [showSuccessModal]);

  useEffect(() => {
    if (!showSuccessModal) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSuccessModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuccessModal, closeSuccessModal]);

  useEffect(() => {
    return () => {
      if (modalCloseTimeout.current) {
        clearTimeout(modalCloseTimeout.current);
      }
      if (photoPreview) {
        revokeImagePreview(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a supported image type (no videos)
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        "শুধুমাত্র ছবি (Image) ফাইল গ্রহণযোগ্য। ভিডিও ফাইল গ্রহণযোগ্য নয়।"
      );
      return;
    }

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid file");
      return;
    }

    // Handle HEIC/HEIF files - convert to JPEG for preview
    let fileToUse = file;
    let previewUrl = "";

    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      try {
        toast.info("HEIC ফাইল convert করা হচ্ছে...");
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        // heic2any returns an array, get the first element
        const convertedFile = Array.isArray(convertedBlob)
          ? convertedBlob[0]
          : convertedBlob;

        // Create a File object from the converted blob
        fileToUse = new File(
          [convertedFile],
          file.name.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg"),
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        );

        previewUrl = URL.createObjectURL(convertedFile);
        toast.success("HEIC ফাইল সফলভাবে convert করা হয়েছে");
      } catch (error) {
        console.error("HEIC conversion error:", error);
        toast.error(
          "HEIC ফাইল convert করতে সমস্যা হয়েছে। দয়া করে অন্য format ব্যবহার করুন।"
        );
        return;
      }
    } else {
      // For other image types, use normal preview
      previewUrl = createImagePreview(file);
    }

    setSelectedPhoto(file); // Keep original file for submission
    setValue("photo", file); // Keep original file in form
    setPhotoPreview(previewUrl);
    // Reset position and scale for new image
    setImagePosition({ x: 50, y: 50 });
    setImageScale(1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!photoPreview) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setDragStart({
      x: e.clientX - centerX - (imagePosition.x * rect.width) / 100,
      y: e.clientY - centerY - (imagePosition.y * rect.height) / 100,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !photoPreview) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate new position relative to center
    const deltaX = e.clientX - centerX - dragStart.x;
    const deltaY = e.clientY - centerY - dragStart.y;

    // Convert to percentage (allowing more movement for larger images)
    const maxMove = 50 * imageScale; // Allow more movement when zoomed in
    const newX = Math.max(
      -maxMove,
      Math.min(maxMove, (deltaX / rect.width) * 100)
    );
    const newY = Math.max(
      -maxMove,
      Math.min(maxMove, (deltaY / rect.height) * 100)
    );

    setImagePosition({
      x: 50 + newX,
      y: 50 + newY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!photoPreview) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setImageScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const adjustImagePosition = (direction: "up" | "down" | "left" | "right") => {
    const step = 3;
    const maxMove = 50 * imageScale;
    setImagePosition((prev) => {
      const currentX = prev.x - 50; // Convert to offset from center
      const currentY = prev.y - 50;
      switch (direction) {
        case "up":
          return { x: prev.x, y: Math.max(50 - maxMove, prev.y - step) };
        case "down":
          return { x: prev.x, y: Math.min(50 + maxMove, prev.y + step) };
        case "left":
          return { x: Math.max(50 - maxMove, prev.x - step), y: prev.y };
        case "right":
          return { x: Math.min(50 + maxMove, prev.x + step), y: prev.y };
        default:
          return prev;
      }
    });
  };

  const removePhoto = () => {
    if (photoPreview) {
      revokeImagePreview(photoPreview);
    }
    setSelectedPhoto(null);
    setPhotoPreview("");
    setValue("photo", null);
    setImagePosition({ x: 50, y: 50 });
    setImageScale(1);
  };

  const handleMultiplePhotosChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check total count (existing + new)
    const totalCount = selectedPhotos.length + files.length;
    if (totalCount > 10) {
      toast.error("সর্বোচ্চ ১০টি ছবি আপলোড করা যাবে");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    for (const file of files) {
      // Check file type
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          `${file.name}: শুধুমাত্র ছবি (Image) ফাইল গ্রহণযোগ্য। ভিডিও ফাইল গ্রহণযোগ্য নয়।`
        );
        continue;
      }

      // Check file size (5 MB max)
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: ফাইলের আকার ৫ MB এর বেশি হতে পারবে না`);
        continue;
      }

      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.error || "Invalid file"}`);
        continue;
      }

      // Handle HEIC/HEIF files
      let fileToUse = file;
      let previewUrl = "";

      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
          });

          const convertedFile = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;

          fileToUse = new File(
            [convertedFile],
            file.name.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg"),
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            }
          );

          previewUrl = URL.createObjectURL(convertedFile);
        } catch (error) {
          console.error("HEIC conversion error:", error);
          toast.error(
            `${file.name}: HEIC ফাইল convert করতে সমস্যা হয়েছে। দয়া করে অন্য format ব্যবহার করুন।`
          );
          continue;
        }
      } else {
        previewUrl = createImagePreview(file);
      }

      validFiles.push(fileToUse);
      validPreviews.push(previewUrl);
    }

    if (validFiles.length > 0) {
      const newPhotos = [...selectedPhotos, ...validFiles];
      const newPreviews = [...photoPreviews, ...validPreviews];
      setSelectedPhotos(newPhotos);
      setPhotoPreviews(newPreviews);
      setValue("photos", newPhotos);
    }

    // Reset input
    e.target.value = "";
  };

  const removePhotoFromGallery = (index: number) => {
    // Revoke preview URL
    if (photoPreviews[index]) {
      revokeImagePreview(photoPreviews[index]);
    }

    const newPhotos = selectedPhotos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setSelectedPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
    setValue("photos", newPhotos.length > 0 ? newPhotos : null);
  };

  const resetForm = () => {
    reset();
    setSelectedPhoto(null);
    if (photoPreview) {
      revokeImagePreview(photoPreview);
    }
    setPhotoPreview("");
    // Reset multiple photos
    selectedPhotos.forEach(() => {
      // Previews will be cleaned up
    });
    photoPreviews.forEach((preview) => {
      revokeImagePreview(preview);
    });
    setSelectedPhotos([]);
    setPhotoPreviews([]);
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.category) {
      toast.error("বিভাগ নির্বাচন করা আবশ্যক");
      return;
    }

    // Check photo requirements based on category
    if (values.category === "photo-gallery") {
      if (!values.photos || values.photos.length === 0) {
        toast.error("অন্তত একটি ছবি আপলোড করা আবশ্যক");
        return;
      }
      if (values.photos.length > 10) {
        toast.error("সর্বোচ্চ ১০টি ছবি আপলোড করা যাবে");
        return;
      }
    } else {
      if (!values.photo) {
        toast.error("ছবি আপলোড করা আবশ্যক");
        return;
      }
    }

    // Content is optional for photo gallery
    if (values.category !== "photo-gallery") {
      if (!values.content || values.content.trim().length === 0) {
        toast.error("বিষয়বস্তু প্রদান করা আবশ্যক");
        return;
      }

      // Check word limit if category has one
      const categoryLimit = categoryWordLimits[values.category];
      if (categoryLimit) {
        const wordCount = countWords(values.content);
        if (wordCount > categoryLimit) {
          toast.error(
            `শব্দ সংখ্যা ${categoryLimit} এর বেশি হতে পারবে না। বর্তমান: ${wordCount}`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const response = await souvenirApi.create(
        {
          category: values.category,
          name: values.name.trim(),
          batch: values.batch.trim(),
          group: values.group,
          phoneNumber: values.phoneNumber,
          email: values.email.trim(),
          ...(values.professionalDetails.trim() && {
            professionalDetails: values.professionalDetails.trim(),
          }),
          content: values.content || "",
        },
        // Single photo for non-photo-gallery categories
        values.category !== "photo-gallery"
          ? values.photo || undefined
          : undefined,
        // Multiple photos for photo-gallery category
        values.category === "photo-gallery"
          ? values.photos || undefined
          : undefined
      );

      console.log("Souvenir created successfully:", response);

      resetForm();
      setImagePosition({ x: 50, y: 50 });
      setImageScale(1);
      setShowSuccessModal(true);
      toast.success("আপনার লেখা সফলভাবে জমা দেওয়া হয়েছে!");
    } catch (error: any) {
      console.error("Submission error", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "জমা দেওয়া ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseInputClasses =
    "w-full rounded-xl border border-primary/20 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-slate-400";

  return (
    <div className="relative min-h-screen bg-cover bg-center lg:bg-fixed">
      {/* Header Section */}
      <div
        className="relative flex flex-col items-center justify-center gap-8 bg-cover bg-center px-6 py-12 text-center sm:px-8 md:py-16 lg:bg-fixed lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10 lg:py-20 lg:text-left"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="max-w-2xl space-y-6 text-white lg:text-left">
          <p className="inline-flex items-center justify-center rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            National Ideal College Alumni Association
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            স্মরণিকা - স্মৃতিচারণ ও সৃজনশীল প্রকাশ
          </h1>
          <p className="text-lg text-white/85">
            আপনার স্মৃতি, গল্প, কবিতা, ছবি এবং চিন্তাভাবনা আমাদের সাথে শেয়ার
            করুন। ন্যাশনাল আইডিয়াল কলেজ রজতজয়ন্তী ২০২৫ এর স্মারক প্রকাশনায় আপনার
            লেখা যুক্ত করুন।
          </p>
        </div>
      </div>

      {/* Form Section */}
      <section className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="rounded-[44px] border border-gray-200 bg-white p-4 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.4)] sm:p-8 lg:p-12">
          <div className="border-b border-primary/20 bg-white/70 p-6 backdrop-blur sm:p-8">
            <h2 className="text-3xl font-semibold text-brandColorSecondary">
              আপনার লেখা জমা দিন
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-brandColorSecondary/70">
              নিচের ফর্মটি পূরণ করে আপনার সৃজনশীল কাজটি আমাদের সাথে শেয়ার করুন।
              আপনার প্রদত্ত তথ্য সঠিক হওয়া নিশ্চিত করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10 p-4 sm:space-y-12 sm:p-6 lg:p-8"
          >
            {/* Category Selection */}
            <div className="rounded-3xl border border-primary/15 bg-white/95 p-5 shadow-sm shadow-primary/10 sm:p-6">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-lg shadow-primary/40">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-brandColorSecondary">
                    বিভাগ নির্বাচন করুন
                  </h3>
                  <p className="text-sm text-brandColorSecondary/70">
                    আপনার লেখার ধরন অনুযায়ী একটি বিভাগ নির্বাচন করুন
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "বিভাগ নির্বাচন করা আবশ্যক" }}
                  render={({ field }) => {
                    const selectedOption =
                      categoryOptions.find(
                        (opt) => opt.value === field.value
                      ) ?? null;

                    return (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-brandColorSecondary">
                          Select Category{" "}
                          <span className="text-red-500" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <Listbox
                          value={selectedOption}
                          onChange={(option) => {
                            field.onChange(option?.value ?? "");
                          }}
                        >
                          <div className="relative">
                            <Listbox.Button
                              className={`relative w-full rounded-xl border bg-white/90 px-4 py-3 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 pr-10 ${
                                errors.category
                                  ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                  : "border-primary/20 cursor-pointer hover:border-primary/60 hover:shadow-md"
                              }`}
                            >
                              <span
                                className={`block truncate ${
                                  selectedOption
                                    ? "text-brandColorSecondary"
                                    : "text-slate-400"
                                }`}
                              >
                                {selectedOption?.label ?? "Select a category"}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                <HiSelector
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-primary/15 bg-white/95 py-2 shadow-xl ring-1 ring-black/5 backdrop-blur focus:outline-none">
                                {categoryOptions.map((option) => (
                                  <Listbox.Option
                                    key={option.value}
                                    value={option}
                                    className={({ active, selected }) =>
                                      [
                                        "relative cursor-pointer select-none rounded-lg px-4 py-2 text-sm transition",
                                        active
                                          ? "bg-primary/15 text-primary"
                                          : "text-brandColorSecondary",
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                      ].join(" ")
                                    }
                                  >
                                    {({ selected }) => (
                                      <span className="block truncate">
                                        {option.label}
                                      </span>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                        {errors.category && (
                          <p className="text-xs text-red-500">
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* Form Fields - Show after category selection */}
            {selectedCategory ? (
              <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
                  <div className="flex w-full items-center justify-center gap-4 sm:w-auto sm:justify-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white sm:h-12 sm:w-12">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        আপনার তথ্য প্রদান করুন
                      </h3>
                      <p className="text-sm text-slate-600">
                        আপনার ব্যক্তিগত তথ্য এবং লেখার বিষয়বস্তু প্রদান করুন
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "নাম প্রদান করা আবশ্যক",
                        minLength: {
                          value: 3,
                          message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে",
                        },
                      })}
                      className={`${baseInputClasses} ${
                        errors.name
                          ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                          : ""
                      }`}
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      ব্যাচ <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="batch"
                      control={control}
                      rules={{ required: "ব্যাচ নির্বাচন করা আবশ্যক" }}
                      render={({ field }) => {
                        const selectedOption =
                          batchOptions.find(
                            (opt) => opt.value === field.value
                          ) ?? null;

                        return (
                          <div>
                            <Listbox
                              value={selectedOption}
                              onChange={(option) => {
                                field.onChange(option?.value ?? "");
                              }}
                            >
                              <div className="relative">
                                <Listbox.Button
                                  className={`relative w-full rounded-xl border bg-white/90 px-4 py-3 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 pr-10 ${
                                    errors.batch
                                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                      : "border-primary/20 cursor-pointer hover:border-primary/60 hover:shadow-md"
                                  }`}
                                >
                                  <span
                                    className={`block truncate ${
                                      selectedOption
                                        ? "text-brandColorSecondary"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {selectedOption?.label ?? "Select batch"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                    <HiSelector
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-primary/15 bg-white/95 py-2 shadow-xl ring-1 ring-black/5 backdrop-blur focus:outline-none">
                                    {batchOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.value}
                                        value={option}
                                        className={({ active, selected }) =>
                                          [
                                            "relative cursor-pointer select-none rounded-lg px-4 py-2 text-sm transition",
                                            active
                                              ? "bg-primary/15 text-primary"
                                              : "text-brandColorSecondary",
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                          ].join(" ")
                                        }
                                      >
                                        {({ selected }) => (
                                          <span className="block truncate">
                                            {option.label}
                                          </span>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                            {errors.batch && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.batch.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      গ্রুপ <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="group"
                      control={control}
                      rules={{ required: "গ্রুপ নির্বাচন করা আবশ্যক" }}
                      render={({ field }) => {
                        const selectedOption =
                          groupOptions.find(
                            (opt) => opt.value === field.value
                          ) ?? null;

                        return (
                          <div>
                            <Listbox
                              value={selectedOption}
                              onChange={(option) => {
                                field.onChange(option?.value ?? "");
                              }}
                            >
                              <div className="relative">
                                <Listbox.Button
                                  className={`relative w-full rounded-xl border bg-white/90 px-4 py-3 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 pr-10 ${
                                    errors.group
                                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                                      : "border-primary/20 cursor-pointer hover:border-primary/60 hover:shadow-md"
                                  }`}
                                >
                                  <span
                                    className={`block truncate ${
                                      selectedOption
                                        ? "text-brandColorSecondary"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {selectedOption?.label ?? "Select group"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                    <HiSelector
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-primary/15 bg-white/95 py-2 shadow-xl ring-1 ring-black/5 backdrop-blur focus:outline-none">
                                    {groupOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.value}
                                        value={option}
                                        className={({ active, selected }) =>
                                          [
                                            "relative cursor-pointer select-none rounded-lg px-4 py-2 text-sm transition",
                                            active
                                              ? "bg-primary/15 text-primary"
                                              : "text-brandColorSecondary",
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                          ].join(" ")
                                        }
                                      >
                                        {({ selected }) => (
                                          <span className="block truncate">
                                            {option.label}
                                          </span>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                            {errors.group && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.group.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      ফোন নম্বর <span className="text-red-500">*</span>
                    </label>
                    <ReactHookFormPhoneNumberField
                      name="phoneNumber"
                      control={control}
                      muiTelInputProps={{}}
                      rules={{
                        required: "ফোন নম্বর প্রদান করা আবশ্যক",
                      }}
                      apiErrors={
                        errors.phoneNumber?.message
                          ? [errors.phoneNumber.message as string]
                          : undefined
                      }
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      ইমেইল ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "ইমেইল প্রদান করা আবশ্যক",
                        pattern: {
                          value: emailRegex,
                          message: "সঠিক ইমেইল ঠিকানা প্রদান করুন",
                        },
                      })}
                      className={`${baseInputClasses} ${
                        errors.email
                          ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                          : ""
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      প্রফেশনাল ডিটেইলস
                    </label>
                    <input
                      type="text"
                      {...register("professionalDetails")}
                      className={baseInputClasses}
                      placeholder="প্রফেশনাল ডিটেইলস"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                {selectedCategory === "photo-gallery" ? (
                  <div className="mt-6">
                    <label className="text-sm font-semibold text-slate-800">
                      ছবি গ্যালারি <span className="text-red-500">*</span>
                      <span className="text-xs text-slate-500 ml-2">
                        (সর্বোচ্চ ১০টি ছবি, প্রতিটি সর্বোচ্চ ৫ MB)
                      </span>
                    </label>
                    <div className="mt-2">
                      {selectedPhotos.length === 0 ? (
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="photos-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/20 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-white/80 transition"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-10 h-10 mb-3 text-primary/50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-slate-500">
                                <span className="font-semibold">
                                  ক্লিক করুন
                                </span>{" "}
                                অথবা ছবি টেনে আনুন
                              </p>
                              <p className="text-xs text-slate-500">
                                PNG, JPG, GIF, HEIC (সর্বোচ্চ ১০টি, প্রতিটি ৫
                                MB)
                              </p>
                            </div>
                            <input
                              id="photos-upload"
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/ico,image/heic,image/heif,.heic,.heif"
                              multiple
                              onChange={handleMultiplePhotosChange}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedPhotos.map((photo, index) => (
                              <div
                                key={index}
                                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-primary/20 bg-white shadow-sm"
                              >
                                <img
                                  src={photoPreviews[index]}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhotoFromGallery(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove photo"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                  {(photo.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                              </div>
                            ))}
                          </div>
                          {selectedPhotos.length < 10 && (
                            <label
                              htmlFor="photos-upload-add"
                              className="flex items-center justify-center w-full h-20 border-2 border-primary/20 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-white/80 transition"
                            >
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                <span>
                                  আরও ছবি যোগ করুন ({selectedPhotos.length}/10)
                                </span>
                              </div>
                              <input
                                id="photos-upload-add"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/ico,image/heic,image/heif,.heic,.heif"
                                multiple
                                onChange={handleMultiplePhotosChange}
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <label className="text-sm font-semibold text-slate-800">
                      আপনার ছবি
                    </label>
                    <div className="mt-2">
                      {!photoPreview ? (
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="photo-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/20 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-white/80 transition"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-10 h-10 mb-3 text-primary/50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-slate-500">
                                <span className="font-semibold">
                                  ক্লিক করুন
                                </span>{" "}
                                অথবা ছবি টেনে আনুন
                              </p>
                              <p className="text-xs text-slate-500">
                                PNG, JPG, GIF, HEIC (MAX. 10MB)
                              </p>
                            </div>
                            <input
                              id="photo-upload"
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/ico,image/heic,image/heif,.heic,.heif"
                              onChange={handlePhotoChange}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          {/* Simple Circular Image Preview */}
                          <div className="relative group">
                            <div
                              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-300 bg-white cursor-move shadow-lg"
                              onMouseDown={handleMouseDown}
                              onMouseMove={handleMouseMove}
                              onMouseUp={handleMouseUp}
                              onMouseLeave={handleMouseUp}
                              onWheel={handleWheel}
                            >
                              <div
                                className="absolute"
                                style={{
                                  width: `${100 * imageScale}%`,
                                  height: `${100 * imageScale}%`,
                                  left: `50%`,
                                  top: `50%`,
                                  transform: `translate(calc(-50% + ${
                                    ((imagePosition.x - 50) / 100) * 256
                                  }px), calc(-50% + ${
                                    ((imagePosition.y - 50) / 100) * 256
                                  }px))`,
                                  transition: isDragging
                                    ? "none"
                                    : "transform 0.1s ease-out",
                                }}
                              >
                                <img
                                  src={photoPreview}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                  draggable={false}
                                  style={{
                                    display: "block",
                                  }}
                                />
                              </div>

                              {/* Reposition hint overlay */}
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-full flex items-center justify-center pointer-events-none">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">
                                  টেনে সরান বা স্ক্রল করে জুম করুন
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Image adjustment controls */}
                          {photoPreview && (
                            <div className="mt-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-white to-brandColorSecondary/10 border-2 border-primary/30 shadow-xl backdrop-blur-sm w-full max-w-md">
                              <p className="text-xs sm:text-sm font-bold text-brandColorSecondary mb-3 text-center flex items-center justify-center gap-2">
                                <svg
                                  className="w-4 h-4 text-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                  />
                                </svg>
                                ছবির অবস্থান সামঞ্জস্য করুন
                              </p>
                              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                                {/* Zoom controls */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImageScale((prev) =>
                                      Math.max(0.5, prev - 0.1)
                                    )
                                  }
                                  className="p-1.5 sm:p-2 rounded-lg bg-white border border-primary/20 hover:bg-primary/10 transition"
                                  title="ছোট করুন"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                                    />
                                  </svg>
                                </button>
                                <span className="text-xs text-brandColorSecondary min-w-[50px] sm:min-w-[60px] text-center">
                                  {Math.round(imageScale * 100)}%
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImageScale((prev) =>
                                      Math.min(3, prev + 0.1)
                                    )
                                  }
                                  className="p-1.5 sm:p-2 rounded-lg bg-white border border-primary/20 hover:bg-primary/10 transition"
                                  title="বড় করুন"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                    />
                                  </svg>
                                </button>

                                <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-primary/30 to-transparent mx-1 sm:mx-2"></div>

                                {/* Enhanced Position controls */}
                                <button
                                  type="button"
                                  onClick={() => adjustImagePosition("up")}
                                  className="p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-primary/30 hover:border-primary/50 hover:from-primary/10 hover:to-primary/5 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                                  title="উপরে"
                                >
                                  <svg
                                    className="w-4 h-4 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                </button>
                                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => adjustImagePosition("left")}
                                    className="p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-primary/30 hover:border-primary/50 hover:from-primary/10 hover:to-primary/5 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                                    title="বামে"
                                  >
                                    <svg
                                      className="w-4 h-4 text-primary"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M15 19l-7-7 7-7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePosition({ x: 50, y: 50 });
                                      setImageScale(1);
                                    }}
                                    className="p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-brandColorSecondary/20 border-2 border-primary/40 hover:border-primary/60 hover:from-primary/30 hover:to-brandColorSecondary/30 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                                    title="রিসেট"
                                  >
                                    <svg
                                      className="w-4 h-4 text-primary"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => adjustImagePosition("right")}
                                    className="p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-primary/30 hover:border-primary/50 hover:from-primary/10 hover:to-primary/5 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                                    title="ডানে"
                                  >
                                    <svg
                                      className="w-4 h-4 text-primary"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => adjustImagePosition("down")}
                                  className="p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-primary/30 hover:border-primary/50 hover:from-primary/10 hover:to-primary/5 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                                  title="নিচে"
                                >
                                  <svg
                                    className="w-4 h-4 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                          {/* File info below image */}
                          {selectedPhoto && (
                            <div className="mt-4 w-full max-w-md p-4 rounded-xl bg-primary/5 border border-primary/20">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-brandColorSecondary truncate">
                                    {selectedPhoto.name}
                                  </p>
                                  <p className="text-xs text-brandColorSecondary/70 mt-1">
                                    {(
                                      selectedPhoto.size /
                                      (1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    MB •{" "}
                                    {selectedPhoto.type
                                      .split("/")[1]
                                      ?.toUpperCase() || "IMAGE"}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={removePhoto}
                                  className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  সরান
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rich Text Editor */}
                {selectedCategory !== "photo-gallery" && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-800">
                        আপনার লেখা / বিষয়বস্তু{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {wordLimit && (
                        <span
                          className={`text-xs font-medium ${
                            currentWordCount > wordLimit
                              ? "text-red-500"
                              : currentWordCount > wordLimit * 0.9
                              ? "text-orange-500"
                              : "text-slate-600"
                          }`}
                        >
                          {currentWordCount} / {wordLimit} শব্দ
                        </span>
                      )}
                    </div>
                    <Controller
                      name="content"
                      control={control}
                      rules={{
                        required:
                          selectedCategory !== "photo-gallery"
                            ? "বিষয়বস্তু প্রদান করা আবশ্যক"
                            : false,
                        validate: (value) => {
                          if (selectedCategory === "photo-gallery") {
                            return true; // Content is optional for photo gallery
                          }
                          const text = value.replace(/<[^>]*>/g, "").trim();
                          if (text.length === 0) {
                            return "বিষয়বস্তু প্রদান করা আবশ্যক";
                          }

                          // Check word limit if category has one
                          if (wordLimit) {
                            const wordCount = countWords(value);
                            if (wordCount > wordLimit) {
                              return `শব্দ সংখ্যা ${wordLimit} এর বেশি হতে পারবে না। বর্তমান: ${wordCount}`;
                            }
                          }

                          return true;
                        },
                      }}
                      render={({ field }) => {
                        // Set up Quill editor keyboard and text-change handlers
                        useEffect(() => {
                          if (!wordLimit || !quillWrapperRef.current) return;

                          let quillInstance: any = null;
                          let textChangeHandler:
                            | ((
                                delta: any,
                                oldDelta: any,
                                source: string
                              ) => void)
                            | null = null;
                          let spaceBinding: any = null;
                          let limitBinding: any = null;

                          // Wait for Quill editor to be ready
                          const checkInterval = setInterval(() => {
                            const editorElement =
                              quillWrapperRef.current?.querySelector(
                                ".ql-editor"
                              ) as HTMLElement;
                            if (!editorElement) return;

                            // @ts-ignore - Quill stores instance on the element
                            const quill = editorElement.__quill;
                            if (!quill) return;

                            clearInterval(checkInterval);
                            quillInstance = quill;

                            // Intercept text changes
                            textChangeHandler = (
                              delta: any,
                              oldDelta: any,
                              source: string
                            ) => {
                              if (source !== "user") return; // Only handle user input

                              const content = quill.root.innerHTML;
                              const wordCount = countWords(content);

                              if (wordCount > wordLimit) {
                                // Get plain text and truncate to word limit
                                const text = quill.getText();
                                const words = text
                                  .trim()
                                  .split(/\s+/)
                                  .slice(0, wordLimit);
                                const truncatedText = words.join(" ");

                                // Update with truncated text
                                quill.setText(truncatedText, "silent");
                                field.onChange(truncatedText);

                                // Restore cursor at end
                                setTimeout(() => {
                                  const length = quill.getLength();
                                  quill.setSelection(
                                    Math.max(0, length - 1),
                                    "silent"
                                  );
                                }, 0);
                              } else {
                                field.onChange(content);
                              }
                            };

                            // Prevent space when at word limit
                            spaceBinding = {
                              key: " ",
                              handler: () => {
                                const content = quill.root.innerHTML;
                                const wordCount = countWords(content);
                                return wordCount < wordLimit; // Allow space only if under limit
                              },
                            };

                            // Prevent typing when at limit (but allow backspace/delete)
                            limitBinding = {
                              key: /./,
                              handler: (range: any, context: any) => {
                                const content = quill.root.innerHTML;
                                const wordCount = countWords(content);
                                if (wordCount >= wordLimit) {
                                  // Allow backspace and delete
                                  if (
                                    context.event &&
                                    (context.event.key === "Backspace" ||
                                      context.event.key === "Delete")
                                  ) {
                                    return true;
                                  }
                                  return false; // Block other keys
                                }
                                return true;
                              },
                            };

                            quill.keyboard.addBinding(spaceBinding);
                            quill.keyboard.addBinding(limitBinding);
                            quill.on("text-change", textChangeHandler);
                          }, 50);

                          // Cleanup
                          return () => {
                            clearInterval(checkInterval);
                            if (quillInstance) {
                              if (textChangeHandler) {
                                quillInstance.off(
                                  "text-change",
                                  textChangeHandler
                                );
                              }
                              try {
                                if (spaceBinding) {
                                  quillInstance.keyboard.removeBinding(
                                    spaceBinding
                                  );
                                }
                                if (limitBinding) {
                                  quillInstance.keyboard.removeBinding(
                                    limitBinding
                                  );
                                }
                              } catch (e) {
                                // Ignore cleanup errors
                              }
                            }
                          };
                        }, [wordLimit, field]);

                        return (
                          <div>
                            <div
                              ref={quillWrapperRef}
                              className={`${
                                errors.content
                                  ? "border-red-400 focus-within:border-red-400"
                                  : "border-primary/20"
                              } rounded-xl overflow-hidden [&_.ql-editor]:min-h-[300px]`}
                            >
                              <ReactQuill
                                theme="snow"
                                value={field.value || ""}
                                onChange={(value) => {
                                  if (wordLimit) {
                                    const newWordCount = countWords(value);
                                    if (newWordCount <= wordLimit) {
                                      field.onChange(value);
                                    }
                                    // If exceeds limit, text-change handler will truncate it
                                  } else {
                                    field.onChange(value);
                                  }
                                }}
                                modules={quillModules}
                                formats={quillFormats}
                                style={{
                                  backgroundColor: "white",
                                  borderRadius: "8px",
                                }}
                                placeholder="আপনার লেখা এখানে লিখুন..."
                              />
                            </div>
                            {errors.content && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.content.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white/90 text-sm text-brandColorSecondary shadow-sm p-4">
                  <p>
                    জমা দেওয়ার মাধ্যমে আপনি নিশ্চিত করছেন যে প্রদত্ত তথ্য সঠিক
                    এবং NICAA আপনার লেখা ন্যাশনাল আইডিয়াল কলেজ রজতজয়ন্তী ২০২৫ এর
                    স্মারক প্রকাশনায় ব্যবহার করতে পারবে।
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-brandColorSecondary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                  >
                    {isSubmitting ? "জমা দেওয়া হচ্ছে..." : "জমা দিন"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center text-sm text-brandColorSecondary sm:p-8">
                <p className="font-semibold">
                  একটি বিভাগ নির্বাচন করুন ফর্মটি দেখার জন্য
                </p>
                <p className="mt-2 text-brandColorSecondary/70">
                  বিভাগ নির্বাচন করলে প্রাসঙ্গিক ফর্মটি প্রদর্শিত হবে
                </p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm transition-opacity duration-300 ${
            animateSuccessModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeSuccessModal}
        >
          <div
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/10 bg-white/95 p-10 text-center shadow-[0_55px_140px_-65px_rgba(15,23,42,0.55)] transition-all duration-300 ease-out ${
              animateSuccessModal
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-brandColorSecondary/10 blur-3xl" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner shadow-primary/40">
              <HiCheckCircle className="h-9 w-9" />
            </div>
            <h3 className="relative mt-6 text-2xl font-semibold text-brandColorSecondary">
              জমা দেওয়া সফল!
            </h3>
            <p className="relative mt-3 text-sm text-brandColorSecondary/70">
              আপনার লেখা সফলভাবে জমা দেওয়া হয়েছে। আমাদের টিম শীঘ্রই আপনার সাথে
              যোগাযোগ করবে।
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={closeSuccessModal}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-brandColorSecondary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShronikaSubmission;
