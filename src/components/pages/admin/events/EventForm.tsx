"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Event,
  CreateEventData,
  CreateEventFormData,
  EventStatus,
  EventVisibility,
  PricingRange,
} from "@/types/event";
import {
  validateFileForUpload,
  createImagePreview,
  revokeImagePreview,
  SUPPORTED_FILE_TYPES,
  FILE_SIZE_LIMITS,
} from "@/utils/imageUpload";

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: CreateEventData | CreateEventFormData) => void;
  loading?: boolean;
  event?: Event | null;
  mode?: "create" | "edit";
}

const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  event = null,
  mode = "create",
}) => {
  const [formData, setFormData] = useState<CreateEventData>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    bannerImage: "",
    date: "",
    startsTime: "",
    venue: "",
    googleMapLink: "",
    organizerName: "",
    organizerContactInfo: "",
    specialGuests: [],
    isPaidEvent: false,
    pricingRanges: [],
    seatLimit: 1,
    socialMediaLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
    status: EventStatus.UPCOMING,
    visibility: EventVisibility.PUBLIC,
  });

  const [newGuest, setNewGuest] = useState("");
  const [newPricingRange, setNewPricingRange] = useState<PricingRange>({
    batchRange: "",
    fee: 0,
    description: "",
    isPopular: false,
  });

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [fileValidation, setFileValidation] = useState<{
    isValid: boolean;
    error?: string;
    fileType: "image" | "video" | "unknown";
    fileSize: string;
    fileSizeMB: number;
  } | null>(null);
  const [useFileUpload, setUseFileUpload] = useState(true); // Toggle between file upload and URL input

  // Helper function to format date for HTML date input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    // Try to parse the date string
    let date: Date;

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try to parse as a date
    date = new Date(dateString);

    // If that fails, try parsing with different formats
    if (isNaN(date.getTime())) {
      // Try parsing as ISO string
      date = new Date(dateString + "T00:00:00");
    }

    // If still fails, try parsing with timezone
    if (isNaN(date.getTime())) {
      date = new Date(dateString + "T00:00:00Z");
    }

    // If still fails, try parsing as local date
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-/]/);
      if (parts.length === 3) {
        // Try different date formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY
        if (parts[0].length === 4) {
          date = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2])
          );
        } else if (parts[2].length === 4) {
          date = new Date(
            parseInt(parts[2]),
            parseInt(parts[0]) - 1,
            parseInt(parts[1])
          ); // MM/DD/YYYY
        }
      }
    }

    if (isNaN(date.getTime())) {
      console.warn("Could not parse date:", dateString);
      return "";
    }

    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Helper function to format time for HTML time input
  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return "";
    // If time is already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    // If time is in HH:MM AM/PM format, convert to 24-hour format
    const time = new Date(`2000-01-01 ${timeString}`);
    if (isNaN(time.getTime())) return "";
    return time.toTimeString().slice(0, 5); // Returns HH:MM format
  };

  // Populate form when editing an existing event
  React.useEffect(() => {
    if (mode === "edit" && event) {
      console.log("Event date:", event.date);
      console.log("Formatted date:", formatDateForInput(event.date || ""));
      setFormData({
        title: event.title || "",
        shortDescription: event.shortDescription || "",
        fullDescription: event.fullDescription || "",
        bannerImage: event.bannerImage || "",
        date: formatDateForInput(event.date || ""),
        startsTime: formatTimeForInput(event.startsTime || ""),
        venue: event.venue || "",
        googleMapLink: event.googleMapLink || "",
        organizerName: event.organizerName || "",
        organizerContactInfo: event.organizerContactInfo || "",
        specialGuests: event.specialGuests || [],
        isPaidEvent: event.isPaidEvent || false,
        pricingRanges: event.pricingRanges || [],
        seatLimit: event.seatLimit || 1,
        socialMediaLinks: event.socialMediaLinks || {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          website: "",
        },
        status: event.status || EventStatus.UPCOMING,
        visibility: event.visibility || EventVisibility.PUBLIC,
      });
    } else if (mode === "create") {
      // Reset form for create mode
      setFormData({
        title: "",
        shortDescription: "",
        fullDescription: "",
        bannerImage: "",
        date: "",
        startsTime: "",
        venue: "",
        googleMapLink: "",
        organizerName: "",
        organizerContactInfo: "",
        specialGuests: [],
        isPaidEvent: false,
        pricingRanges: [],
        seatLimit: 1,
        socialMediaLinks: {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          website: "",
        },
        status: EventStatus.UPCOMING,
        visibility: EventVisibility.PUBLIC,
      });
    }
  }, [mode, event]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [platform]: value,
      },
    }));
  };

  const addGuest = () => {
    if (newGuest.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialGuests: [...(prev.specialGuests || []), newGuest.trim()],
      }));
      setNewGuest("");
    }
  };

  const removeGuest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialGuests: prev.specialGuests?.filter((_, i) => i !== index) || [],
    }));
  };

  const addPricingRange = () => {
    if (newPricingRange.batchRange.trim() && newPricingRange.fee >= 0) {
      // If this pricing is marked as popular, unmark all others
      const updatedPricingRanges = (formData.pricingRanges || []).map((p) => ({
        ...p,
        isPopular: false,
      }));

      setFormData((prev) => ({
        ...prev,
        pricingRanges: [...updatedPricingRanges, { ...newPricingRange }],
      }));
      setNewPricingRange({
        batchRange: "",
        fee: 0,
        description: "",
        isPopular: false,
      });
    }
  };

  const togglePopularPricing = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricingRanges: (prev.pricingRanges || []).map((pricing, i) => ({
        ...pricing,
        isPopular: i === index ? !pricing.isPopular : false, // Only one can be popular
      })),
    }));
  };

  const removePricingRange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricingRanges: prev.pricingRanges?.filter((_, i) => i !== index) || [],
    }));
  };

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFileForUpload(file);
    setFileValidation(validation);

    if (validation.isValid) {
      setSelectedFile(file);

      // Create preview for images
      if (validation.fileType === "image") {
        const previewUrl = createImagePreview(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview("");
      }
    } else {
      setSelectedFile(null);
      setImagePreview("");
    }
  };

  const handleRemoveFile = () => {
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }
    setSelectedFile(null);
    setImagePreview("");
    setFileValidation(null);
  };

  const toggleUploadMethod = () => {
    setUseFileUpload(!useFileUpload);
    if (useFileUpload) {
      // Switching to URL input, clear file data
      handleRemoveFile();
    } else {
      // Switching to file upload, clear URL
      setFormData((prev) => ({ ...prev, bannerImage: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = "Full description is required";
    if (useFileUpload) {
      if (!selectedFile) {
        newErrors.bannerImage = "Please select a banner image file";
      } else if (fileValidation && !fileValidation.isValid) {
        newErrors.bannerImage = fileValidation.error || "Invalid file";
      }
    } else {
      if (
        typeof formData.bannerImage === "string" &&
        !formData.bannerImage.trim()
      )
        newErrors.bannerImage = "Banner image URL is required";
    }
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startsTime.trim())
      newErrors.startsTime = "Start time is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.organizerName.trim())
      newErrors.organizerName = "Organizer name is required";
    if (!formData.organizerContactInfo.trim())
      newErrors.organizerContactInfo = "Organizer contact info is required";
    if (formData.seatLimit < 1)
      newErrors.seatLimit = "Seat limit must be at least 1";
    if (
      formData.isPaidEvent &&
      (!formData.pricingRanges || formData.pricingRanges.length === 0)
    ) {
      newErrors.pricingRanges = "Pricing ranges are required for paid events";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form validation passed");
      console.log("useFileUpload:", useFileUpload);
      console.log("selectedFile:", selectedFile);
      console.log("formData.bannerImage:", formData.bannerImage);
      console.log("typeof formData.bannerImage:", typeof formData.bannerImage);

      if (useFileUpload && selectedFile) {
        // Create form data with file
        const formDataWithFile: CreateEventFormData = {
          ...formData,
          bannerImage: selectedFile,
        };
        console.log("Sending data with file:", formDataWithFile);
        onSubmit(formDataWithFile);
      } else if (!useFileUpload && typeof formData.bannerImage === "string") {
        // Use regular form data with URL
        console.log("Sending data with URL:", formData);
        onSubmit(formData);
      } else {
        // This shouldn't happen if validation passes, but just in case
        console.error(
          "Invalid form state: useFileUpload=",
          useFileUpload,
          "selectedFile=",
          selectedFile,
          "bannerImage=",
          formData.bannerImage
        );
        setErrors({
          bannerImage: "Please select a banner image or provide a URL",
        });
      }
    }
  };

  const handleClose = () => {
    // Clean up file preview
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }

    setFormData({
      title: "",
      shortDescription: "",
      fullDescription: "",
      bannerImage: "",
      date: "",
      startsTime: "",
      venue: "",
      googleMapLink: "",
      organizerName: "",
      organizerContactInfo: "",
      specialGuests: [],
      isPaidEvent: false,
      pricingRanges: [],
      seatLimit: 1,
      socialMediaLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        website: "",
      },
      status: EventStatus.UPCOMING,
      visibility: EventVisibility.PUBLIC,
    });
    setErrors({});

    // Reset file upload states
    setSelectedFile(null);
    setImagePreview("");
    setFileValidation(null);
    setUseFileUpload(true);

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {mode === "edit" ? "Edit Event" : "Create New Event"}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            {/* Banner Image Upload Section */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Banner Image
              </Typography>

              {/* Toggle between file upload and URL input */}
              <FormControlLabel
                control={
                  <Switch
                    checked={useFileUpload}
                    onChange={toggleUploadMethod}
                    color="primary"
                  />
                }
                label={useFileUpload ? "Upload from device" : "Use URL"}
                sx={{ mb: 2 }}
              />

              {useFileUpload ? (
                <Box>
                  {/* File Upload Input */}
                  <input
                    accept={SUPPORTED_FILE_TYPES.join(",")}
                    style={{ display: "none" }}
                    id="banner-image-upload"
                    type="file"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="banner-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AddIcon />}
                      sx={{ mb: 2 }}
                    >
                      Select Banner Image/Video
                    </Button>
                  </label>

                  {/* File Info and Preview */}
                  {selectedFile && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Selected: {selectedFile.name} (
                          {fileValidation?.fileSize})
                        </Typography>
                        <IconButton size="small" onClick={handleRemoveFile}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      {/* Image Preview */}
                      {imagePreview && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={imagePreview}
                            alt="Banner preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              objectFit: "contain",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      )}

                      {/* File Type Info */}
                      {fileValidation && (
                        <Chip
                          label={`${fileValidation.fileType.toUpperCase()} - ${
                            fileValidation.fileSize
                          }`}
                          color={fileValidation.isValid ? "success" : "error"}
                          size="small"
                        />
                      )}
                    </Box>
                  )}

                  {/* File Validation Error */}
                  {fileValidation && !fileValidation.isValid && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {fileValidation.error}
                    </Alert>
                  )}

                  {/* File Requirements Info */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    Supported formats: Images (JPG, PNG, GIF, WebP, SVG, BMP,
                    TIFF, ICO) and Videos (MP4, MOV, AVI, WMV, FLV, WebM, 3GP,
                    MKV, M4V, MPG, MPEG, OGV, OGG)
                    <br />
                    Maximum file size: {FILE_SIZE_LIMITS.maxSizeInMB}MB
                  </Typography>
                </Box>
              ) : (
                <TextField
                  fullWidth
                  label="Banner Image URL"
                  value={formData.bannerImage}
                  onChange={(e) =>
                    handleInputChange("bannerImage", e.target.value)
                  }
                  error={!!errors.bannerImage}
                  helperText={
                    errors.bannerImage || "Enter the URL of the banner image"
                  }
                  required
                />
              )}

              {/* General Error Display */}
              {errors.bannerImage && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.bannerImage}
                </Alert>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Short Description"
            value={formData.shortDescription}
            onChange={(e) =>
              handleInputChange("shortDescription", e.target.value)
            }
            error={!!errors.shortDescription}
            helperText={errors.shortDescription}
            multiline
            rows={2}
            required
          />

          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                color: errors.fullDescription ? "error.main" : "text.primary",
              }}
            >
              Full Description *
            </Typography>
            <ReactQuill
              theme="snow"
              value={formData.fullDescription}
              onChange={(value) => handleInputChange("fullDescription", value)}
              modules={quillModules}
              formats={quillFormats}
              style={{
                backgroundColor: "white",
                borderRadius: "4px",
                border: errors.fullDescription
                  ? "1px solid #d32f2f"
                  : "1px solid rgba(0, 0, 0, 0.23)",
              }}
            />
            {errors.fullDescription && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, display: "block" }}
              >
                {errors.fullDescription}
              </Typography>
            )}
          </Box>

          {/* Date and Time */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Date & Time
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Event Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={formData.startsTime}
              onChange={(e) => handleInputChange("startsTime", e.target.value)}
              error={!!errors.startsTime}
              helperText={errors.startsTime}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>

          {/* Venue */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Venue Information
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Venue"
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              error={!!errors.venue}
              helperText={errors.venue}
              required
            />

            <TextField
              fullWidth
              label="Google Maps Link"
              value={formData.googleMapLink}
              onChange={(e) =>
                handleInputChange("googleMapLink", e.target.value)
              }
              placeholder="https://maps.google.com/..."
            />
          </Box>

          {/* Organizer Information */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Organizer Information
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Organizer Name"
              value={formData.organizerName}
              onChange={(e) =>
                handleInputChange("organizerName", e.target.value)
              }
              error={!!errors.organizerName}
              helperText={errors.organizerName}
              required
            />

            <TextField
              fullWidth
              label="Contact Information"
              value={formData.organizerContactInfo}
              onChange={(e) =>
                handleInputChange("organizerContactInfo", e.target.value)
              }
              error={!!errors.organizerContactInfo}
              helperText={errors.organizerContactInfo}
              required
            />
          </Box>

          {/* Special Guests */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Special Guests
            </Typography>
          </Box>

          <Box>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                label="Add Special Guest"
                value={newGuest}
                onChange={(e) => setNewGuest(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addGuest()}
              />
              <Button
                variant="contained"
                onClick={addGuest}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.specialGuests?.map((guest, index) => (
                <Chip
                  key={index}
                  label={guest}
                  onDelete={() => removeGuest(index)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
            </Box>
          </Box>

          {/* Event Settings */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Event Settings
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Seat Limit"
              type="number"
              value={formData.seatLimit}
              onChange={(e) =>
                handleInputChange("seatLimit", parseInt(e.target.value) || 1)
              }
              error={!!errors.seatLimit}
              helperText={errors.seatLimit}
              required
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                label="Status"
              >
                <MenuItem value={EventStatus.UPCOMING}>Upcoming</MenuItem>
                <MenuItem value={EventStatus.ONGOING}>Ongoing</MenuItem>
                <MenuItem value={EventStatus.COMPLETED}>Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Visibility</InputLabel>
              <Select
                value={formData.visibility}
                onChange={(e) =>
                  handleInputChange("visibility", e.target.value)
                }
                label="Visibility"
              >
                <MenuItem value={EventVisibility.PUBLIC}>Public</MenuItem>
                <MenuItem value={EventVisibility.PRIVATE}>Private</MenuItem>
                <MenuItem value={EventVisibility.ALUMNI_ONLY}>
                  Alumni Only
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Paid Event */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPaidEvent}
                  onChange={(e) =>
                    handleInputChange("isPaidEvent", e.target.checked)
                  }
                />
              }
              label="This is a paid event"
            />
          </Box>

          {/* Pricing Ranges */}
          {formData.isPaidEvent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Pricing Ranges
              </Typography>
              {errors.pricingRanges && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.pricingRanges}
                </Alert>
              )}

              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  md: "2fr 1fr 2fr auto",
                }}
                gap={2}
                sx={{ mb: 2 }}
              >
                <TextField
                  fullWidth
                  label="Batch Range"
                  value={newPricingRange.batchRange}
                  onChange={(e) =>
                    setNewPricingRange((prev) => ({
                      ...prev,
                      batchRange: e.target.value,
                    }))
                  }
                  placeholder="e.g., HSC Batch 2003-2021"
                />
                <TextField
                  fullWidth
                  label="Fee"
                  type="number"
                  value={newPricingRange.fee}
                  onChange={(e) =>
                    setNewPricingRange((prev) => ({
                      ...prev,
                      fee: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={newPricingRange.description}
                  onChange={(e) =>
                    setNewPricingRange((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newPricingRange.isPopular || false}
                      onChange={(e) =>
                        setNewPricingRange((prev) => ({
                          ...prev,
                          isPopular: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Mark as Popular"
                />
                <Button
                  variant="contained"
                  onClick={addPricingRange}
                  startIcon={<AddIcon />}
                  sx={{ height: "56px" }}
                >
                  Add
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                {formData.pricingRanges?.map((range, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    p={2}
                    border={1}
                    borderColor={range.isPopular ? "primary.main" : "divider"}
                    borderRadius={1}
                    sx={{
                      backgroundColor: range.isPopular
                        ? "primary.50"
                        : "transparent",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={range.isPopular || false}
                          onChange={() => togglePopularPricing(index)}
                          color="primary"
                        />
                      }
                      label="Popular"
                    />
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="bold">
                        {range.batchRange}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {range.description}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      ৳{range.fee}
                    </Typography>
                    <IconButton
                      onClick={() => removePricingRange(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Social Media Links */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Social Media Links
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "1fr 1fr",
            }}
            gap={2}
          >
            <TextField
              fullWidth
              label="Facebook"
              value={formData.socialMediaLinks?.facebook || ""}
              onChange={(e) =>
                handleSocialMediaChange("facebook", e.target.value)
              }
              placeholder="https://facebook.com/..."
            />

            <TextField
              fullWidth
              label="Instagram"
              value={formData.socialMediaLinks?.instagram || ""}
              onChange={(e) =>
                handleSocialMediaChange("instagram", e.target.value)
              }
              placeholder="https://instagram.com/..."
            />

            <TextField
              fullWidth
              label="Twitter"
              value={formData.socialMediaLinks?.twitter || ""}
              onChange={(e) =>
                handleSocialMediaChange("twitter", e.target.value)
              }
              placeholder="https://twitter.com/..."
            />

            <TextField
              fullWidth
              label="LinkedIn"
              value={formData.socialMediaLinks?.linkedin || ""}
              onChange={(e) =>
                handleSocialMediaChange("linkedin", e.target.value)
              }
              placeholder="https://linkedin.com/..."
            />
          </Box>

          <TextField
            fullWidth
            label="Website"
            value={formData.socialMediaLinks?.website || ""}
            onChange={(e) => handleSocialMediaChange("website", e.target.value)}
            placeholder="https://example.com"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
            ? "Update Event"
            : "Create Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;
