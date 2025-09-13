"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUsers,
  FiFileText,
  FiCalendar,
  FiPlus,
  FiX,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { IoMdCloudDownload, IoMdCloudUpload } from "react-icons/io";
import { toast } from "react-toastify";
import { useEmailManagement } from "@/hooks/useEmailManagement";
import {
  EmailRecipient,
  EmailTemplateInfo,
  CampaignCreationRequest,
  TemplatePreviewData,
} from "@/types/email";
import TemplatePreview from "@/components/shared/email/TemplatePreview";
import backgroundImage from "@/public/background.jpg";

interface CampaignFormProps {
  onSubmit: (data: CampaignCreationRequest) => void;
  onCancel: () => void;
}

export default function CampaignForm({
  onSubmit,
  onCancel,
}: CampaignFormProps) {
  const { loading, getTemplates, testBulkImmediate } = useEmailManagement();

  const [formData, setFormData] = useState<CampaignCreationRequest>({
    name: "",
    subject: "",
    templateName: "silver-jubilee-announcement",
    templateData: {},
    recipients: [],
    emailsPerDay: 50,
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [templates, setTemplates] = useState<EmailTemplateInfo[]>([]);
  const [bulkEmails, setBulkEmails] = useState("");
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewData, setPreviewData] = useState<TemplatePreviewData>({
    templateName: "silver-jubilee-announcement",
    templateData: {},
    sampleData: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTemplates();
    // Set default dates (start date: tomorrow, end date: 7 days from start)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // Set to 9:00 AM

    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(17, 0, 0, 0); // Set to 5:00 PM

    setFormData((prev) => ({
      ...prev,
      startDate: tomorrow.toISOString(),
      endDate: endDate.toISOString(),
    }));
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await getTemplates();
      if (response && Array.isArray(response)) {
        setTemplates(response);
      } else {
        console.warn("Invalid templates response, using empty templates");
        setTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      // Fallback to empty templates
      setTemplates([]);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseBulkEmails = (
    input: string
  ): Array<{
    email: string;
    firstName: string;
    lastName: string;
    hscPassingYear: number;
  }> => {
    const emails = input
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const recipients: Array<{
      email: string;
      firstName: string;
      lastName: string;
      hscPassingYear: number;
    }> = [];
    const seenEmails = new Set<string>();

    emails.forEach((email) => {
      if (validateEmail(email) && !seenEmails.has(email.toLowerCase())) {
        seenEmails.add(email.toLowerCase());
        // Provide blank fields for manual input
        recipients.push({
          email: email.toLowerCase(),
          firstName: "",
          lastName: "",
          hscPassingYear: 2010,
        });
      }
    });

    return recipients;
  };

  const handleBulkEmailsChange = (value: string) => {
    setBulkEmails(value);
  };

  const handleBulkEmailsSubmit = () => {
    if (!bulkEmails.trim()) {
      return;
    }

    const parsedRecipients = parseBulkEmails(bulkEmails);

    if (parsedRecipients.length === 0) {
      return;
    }

    // Add new recipients, avoiding duplicates
    const existingEmails = new Set(
      formData.recipients.map((r) => r.email.toLowerCase())
    );
    const newRecipients = parsedRecipients.filter(
      (r) => !existingEmails.has(r.email.toLowerCase())
    );

    setFormData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, ...newRecipients],
    }));

    // Clear the input after adding
    setBulkEmails("");
  };

  const handleCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please select a valid CSV file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setCsvFile(file);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("csvFile", file);

      // Send CSV to backend
      const response = await fetch("/api/email/upload-csv", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload CSV");
      }

      const result = await response.json();

      if (result.success && result.recipients) {
        // Convert CSV recipients to new format
        const newRecipients = result.recipients.map(
          (r: {
            email: string;
            firstName?: string;
            lastName?: string;
            name?: string;
            hscPassingYear?: number;
          }) => ({
            email: r.email,
            firstName: r.firstName || r.name || r.email.split("@")[0],
            lastName: r.lastName || "",
            hscPassingYear: r.hscPassingYear || 2010,
          })
        );

        // Add recipients from CSV to the form
        const existingEmails = new Set(
          formData.recipients.map((r) => r.email.toLowerCase())
        );
        const uniqueNewRecipients = newRecipients.filter(
          (r: {
            email: string;
            firstName?: string;
            lastName?: string;
            hscPassingYear?: number;
          }) => !existingEmails.has(r.email.toLowerCase())
        );

        setFormData((prev) => ({
          ...prev,
          recipients: [...prev.recipients, ...uniqueNewRecipients],
        }));

        toast.success(
          `${uniqueNewRecipients.length} recipients added from CSV`
        );
      } else {
        toast.error(result.message || "Failed to process CSV file");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to upload CSV file");
    }

    // Clear the file input
    event.target.value = "";
    setCsvFile(null);
  };

  const handleCsvDownload = () => {
    if (formData.recipients.length === 0) {
      toast.error("No recipients to download");
      return;
    }

    // Create CSV content with new structure
    const csvContent = [
      "Email,FirstName,LastName,HSCPassingYear", // Header
      ...formData.recipients.map((recipient) => {
        const email = recipient.email;
        const firstName = recipient.firstName || "";
        const lastName = recipient.lastName || "";
        const hscPassingYear = recipient.hscPassingYear || "";
        return `"${email}","${firstName}","${lastName}","${hscPassingYear}"`;
      }),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `email-recipients-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    toast.success(
      `${formData.recipients.length} recipients downloaded successfully`
    );
  };

  const addIndividualRecipient = () => {
    const newRecipient = {
      email: "",
      firstName: "",
      lastName: "",
      hscPassingYear: 2010,
    };
    setFormData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, newRecipient],
    }));
  };

  const updateRecipient = (
    index: number,
    field: "email" | "firstName" | "lastName" | "hscPassingYear",
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) =>
        i === index ? { ...recipient, [field]: value } : recipient
      ),
    }));
  };

  const removeRecipient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  };

  const removeDuplicateEmails = () => {
    const seenEmails = new Set<string>();
    const uniqueRecipients = formData.recipients.filter((recipient) => {
      if (seenEmails.has(recipient.email.toLowerCase())) {
        return false;
      }
      seenEmails.add(recipient.email.toLowerCase());
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      recipients: uniqueRecipients,
    }));

    toast.success(
      `Removed ${
        formData.recipients.length - uniqueRecipients.length
      } duplicate emails`
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (formData.recipients.length === 0) {
      newErrors.recipients = "At least one recipient is required";
    }

    const invalidEmails = formData.recipients.filter(
      (r) => !validateEmail(r.email)
    );
    if (invalidEmails.length > 0) {
      newErrors.recipients = `${invalidEmails.length} invalid email(s) found`;
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const now = new Date();

      if (startDate < now) {
        newErrors.startDate = "Start date cannot be in the past";
      }

      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.emailsPerDay <= 0) {
      newErrors.emailsPerDay = "Emails per day must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Remove invalid emails
    const validRecipients = formData.recipients.filter((r) =>
      validateEmail(r.email)
    );

    const submitData: CampaignCreationRequest = {
      ...formData,
      recipients: validRecipients,
    };

    onSubmit(submitData);
  };

  const handleTestSend = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const validRecipients = formData.recipients.filter((r) =>
        validateEmail(r.email)
      );
      const testData = {
        recipients: validRecipients.slice(0, 5).map((r) => ({
          email: r.email,
          name: `${r.firstName} ${r.lastName}`.trim(),
          context: {
            firstName: r.firstName,
            lastName: r.lastName,
            hscPassingYear: r.hscPassingYear,
          },
        })),
        subject: formData.subject,
        templateName: formData.templateName,
        templateData: formData.templateData,
      };

      const success = await testBulkImmediate(testData);
      if (success) {
        toast.success("Test email sent successfully!");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
    }
  };

  const getEstimatedCompletionDate = (): Date => {
    if (!formData.startDate || !formData.endDate) {
      return new Date();
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    return endDate;
  };

  const updatePreviewData = () => {
    setPreviewData({
      templateName: formData.templateName,
      templateData: formData.templateData,
      sampleData: {
        name: "John Doe",
        email: "john@example.com",
        company: "Example Corp",
        ...formData.templateData,
      },
    });
  };

  useEffect(() => {
    updatePreviewData();
  }, [formData.templateName, formData.templateData]);

  // Helper function to convert datetime-local to ISO string
  const datetimeLocalToISO = (datetimeLocal: string): string => {
    if (!datetimeLocal) return "";
    // Create a new Date object from the datetime-local value
    // This preserves the local time without timezone conversion
    const date = new Date(datetimeLocal);
    return date.toISOString();
  };

  // Helper function to convert ISO string to datetime-local format
  const isoToDatetimeLocal = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Format as YYYY-MM-DDTHH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="bg-cover bg-center bg-no-repeat p-5 rounded-lg"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-bold text-2xl">
            Create Email Campaign
          </h1>
          <button
            onClick={onCancel}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
          >
            <FiX className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FiFileText className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Campaign Details
              </h2>
            </div>

            {/* Campaign Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter campaign name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Subject Line */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Enter email subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add any notes about this campaign..."
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Recipients Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FiUsers className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Recipients
              </h2>
            </div>

            {/* Bulk Email Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Bulk Email Input
                </label>
                <div className="flex items-center space-x-4">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <IoMdCloudUpload className="text-4xl text-primary hover:text-whatsapp transition-colors" />
                  </label>
                  <button
                    type="button"
                    onClick={handleCsvDownload}
                    className="cursor-pointer"
                  >
                    <IoMdCloudDownload className="text-4xl text-primary hover:text-whatsapp transition-colors" />
                  </button>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </div>
              <textarea
                value={bulkEmails}
                onChange={(e) => handleBulkEmailsChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleBulkEmailsSubmit();
                  }
                }}
                onBlur={() => {
                  if (bulkEmails.trim()) {
                    handleBulkEmailsSubmit();
                  }
                }}
                placeholder="Enter email addresses and press Enter to add them"
                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Individual Recipients */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Individual Recipients
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={addIndividualRecipient}
                    className="flex items-center space-x-1 text-primary  hover:text-red-800"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Recipient</span>
                  </button>
                  {formData.recipients.length >= 2 && (
                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          recipients: [],
                        }));
                        toast.success("All recipients cleared");
                      }}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                    >
                      <FiX className="w-4 h-4" />
                      <span>Clear All Recipients</span>
                    </button>
                  )}
                </div>
              </div>

              {formData.recipients.map((recipient, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="email"
                    value={recipient.email}
                    onChange={(e) =>
                      updateRecipient(index, "email", e.target.value)
                    }
                    placeholder="Email *"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={recipient.firstName}
                    onChange={(e) =>
                      updateRecipient(index, "firstName", e.target.value)
                    }
                    placeholder="First Name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={recipient.lastName}
                    onChange={(e) =>
                      updateRecipient(index, "lastName", e.target.value)
                    }
                    placeholder="Last Name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={recipient.hscPassingYear}
                    onChange={(e) =>
                      updateRecipient(
                        index,
                        "hscPassingYear",
                        parseInt(e.target.value) || 2010
                      )
                    }
                    placeholder="HSC Year"
                    min="1990"
                    max="2030"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={() => removeRecipient(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Recipient Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Total Recipients: {formData.recipients.length}
                </span>
              </div>
              <button
                onClick={removeDuplicateEmails}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Remove Duplicates
              </button>
            </div>

            {errors.recipients && (
              <p className="text-red-600 text-sm mt-2">{errors.recipients}</p>
            )}
          </motion.div>

          {/* Email Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FiFileText className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Email Content
              </h2>
            </div>

            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template
              </label>
              <select
                value={formData.templateName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    templateName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {templates.map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name.charAt(0).toUpperCase() +
                      template.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Data */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Data (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.templateData, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData((prev) => ({ ...prev, templateData: parsed }));
                  } catch (error) {
                    // Invalid JSON, keep the string value
                  }
                }}
                placeholder='{"key": "value"}'
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter JSON data for template variables
              </p>
            </div>

            {/* Template Preview */}
            <TemplatePreview
              templateName={formData.templateName}
              templateData={formData.templateData}
              sampleData={previewData.sampleData}
              onDataChange={(data) =>
                setPreviewData((prev) => ({ ...prev, sampleData: data }))
              }
            />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Campaign Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold">
                  {formData.name || "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-semibold">
                  {formData.recipients.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Template:</span>
                <span className="font-semibold">{formData.templateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emails/Day:</span>
                <span className="font-semibold">{formData.emailsPerDay}</span>
              </div>
            </div>
          </motion.div>

          {/* Scheduling Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FiCalendar className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Scheduling Options
              </h3>
            </div>

            {/* Emails Per Day */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emails Per Day *
              </label>
              <input
                type="number"
                value={formData.emailsPerDay}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailsPerDay: parseInt(e.target.value) || 50,
                  }))
                }
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.emailsPerDay && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.emailsPerDay}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={
                  formData.startDate
                    ? isoToDatetimeLocal(formData.startDate)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: datetimeLocalToISO(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={
                  formData.endDate ? isoToDatetimeLocal(formData.endDate) : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: datetimeLocalToISO(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>

            {/* Estimated Completion */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Estimated Completion
              </h4>
              <p className="text-lg font-semibold text-gray-900">
                {getEstimatedCompletionDate().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {formData.recipients.length > 0 && formData.emailsPerDay > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  ⏱️ This campaign will take{" "}
                  {Math.ceil(
                    formData.recipients.length / formData.emailsPerDay
                  )}{" "}
                  days to complete
                </p>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="space-y-3">
              <button
                onClick={handleTestSend}
                disabled={loading || formData.recipients.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span>Send Test Email</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || formData.recipients.length === 0}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FiCheckCircle className="w-4 h-4" />
                )}
                <span>{loading ? "Creating..." : "Create Campaign"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
