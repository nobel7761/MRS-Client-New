"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";
import { TemplatePreviewData } from "@/types/email";

interface TemplatePreviewProps {
  templateName: string;
  templateData?: Record<string, any>;
  sampleData?: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
}

export default function TemplatePreview({
  templateName,
  templateData = {},
  sampleData = {},
  onDataChange,
}: TemplatePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<TemplatePreviewData>({
    templateName,
    templateData,
    sampleData: {
      name: "John Doe",
      email: "john@example.com",
      company: "Example Corp",
      ...sampleData,
    },
  });

  useEffect(() => {
    setPreviewData({
      templateName,
      templateData,
      sampleData: {
        name: "John Doe",
        email: "john@example.com",
        company: "Example Corp",
        ...sampleData,
      },
    });
  }, [templateName, templateData, sampleData]);

  const renderTemplate = () => {
    const data = { ...previewData.sampleData, ...previewData.templateData };

    switch (templateName) {
      case "welcome":
        return (
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-primary text-white p-6 rounded-t-lg">
              <h1 className="text-2xl font-bold">Welcome to Our Platform!</h1>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Dear <strong>{data.name}</strong>,
              </p>
              <p className="text-gray-700 mb-4">
                Welcome to our platform! We're excited to have you on board.
                Your account has been successfully created with the email
                address: <strong>{data.email}</strong>.
              </p>
              <p className="text-gray-700 mb-4">
                {data.company &&
                  `We noticed you're from ${data.company}. We have special features tailored for your industry.`}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Getting Started:
                </h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Complete your profile</li>
                  <li>• Explore our features</li>
                  <li>• Connect with other users</li>
                </ul>
              </div>
              <p className="text-gray-700 mb-4">
                If you have any questions, feel free to reach out to our support
                team.
              </p>
              <p className="text-gray-700">
                Best regards,
                <br />
                The Team
              </p>
            </div>
          </div>
        );

      case "newsletter":
        return (
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-blue-600 text-white p-6 rounded-t-lg">
              <h1 className="text-2xl font-bold">Monthly Newsletter</h1>
              <p className="text-blue-100">Stay updated with our latest news</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Hello <strong>{data.name}</strong>,
              </p>
              <p className="text-gray-700 mb-6">
                Here's what's new this month:
              </p>

              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">
                    New Features Released
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We've added exciting new features to enhance your
                    experience.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">
                    Community Updates
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our community has grown to over 10,000 active users!
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">
                    Upcoming Events
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Join us for our next webinar on advanced features.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quick Stats:
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      1,234
                    </div>
                    <div className="text-xs text-gray-600">New Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">567</div>
                    <div className="text-xs text-gray-600">Active Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-xs text-gray-600">Success Stories</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700">
                Thank you for being part of our community!
                <br />
                Best regards,
                <br />
                The Newsletter Team
              </p>
            </div>
          </div>
        );

      case "notification":
        return (
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-yellow-500 text-white p-6 rounded-t-lg">
              <h1 className="text-2xl font-bold">Important Notification</h1>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Dear <strong>{data.name}</strong>,
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Important Update
                </h3>
                <p className="text-yellow-700">
                  {data.message ||
                    "We have an important update regarding your account that requires your immediate attention."}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Action Required:
                </h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Review the information below</li>
                  <li>• Take necessary action if required</li>
                  <li>• Contact support if you have questions</li>
                </ul>
              </div>

              {data.details && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Details:</h4>
                  <p className="text-gray-700">{data.details}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-blue-700 text-sm">
                  If you have any questions or need assistance, please don't
                  hesitate to contact our support team.
                </p>
              </div>

              <p className="text-gray-700 mt-4">
                Best regards,
                <br />
                The Support Team
              </p>
            </div>
          </div>
        );

      case "silver-jubilee-announcement":
        return (
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
              <h1 className="text-2xl font-bold">Silver Jubilee Celebration</h1>
              <p className="text-purple-100">National Ideal College</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Dear <strong>{data.name || "Valued Community Member"}</strong>,
              </p>
              <p className="text-gray-700 mb-4">
                We are thrilled to announce the celebration of our Silver
                Jubilee! This milestone marks{" "}
                {data.establishmentYear
                  ? `${new Date().getFullYear() - data.establishmentYear} years`
                  : "25 years"}
                of excellence in education and community service.
              </p>

              {data.announcementDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Event Date:
                  </h4>
                  <p className="text-yellow-700">{data.announcementDate}</p>
                </div>
              )}

              {data.openingCeremony && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Opening Ceremony:
                  </h4>
                  <p className="text-blue-700">{data.openingCeremony}</p>
                </div>
              )}

              {data.culturalEvent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Cultural Events:
                  </h4>
                  <p className="text-green-700">{data.culturalEvent}</p>
                </div>
              )}

              {data.registrationLink && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Registration:
                  </h4>
                  <a
                    href={data.registrationLink}
                    className="text-purple-700 hover:underline"
                  >
                    Click here to register
                  </a>
                </div>
              )}

              <p className="text-gray-700 mt-4">
                We look forward to celebrating this special occasion with you!
                <br />
                <br />
                Best regards,
                <br />
                The National Ideal College Team
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <p className="text-gray-500 text-center">
              Template preview not available
            </p>
          </div>
        );
    }
  };

  const updateSampleData = (key: string, value: string) => {
    const newSampleData = { ...previewData.sampleData, [key]: value };
    setPreviewData((prev) => ({ ...prev, sampleData: newSampleData }));
    onDataChange?.(newSampleData);
  };

  return (
    <div className="space-y-4">
      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          {showPreview ? (
            <FiEyeOff className="w-4 h-4" />
          ) : (
            <FiEye className="w-4 h-4" />
          )}
          <span>{showPreview ? "Hide" : "Show"} Template Preview</span>
        </button>

        {showPreview && (
          <button
            onClick={() => {
              setPreviewData((prev) => ({
                ...prev,
                sampleData: {
                  name: "John Doe",
                  email: "john@example.com",
                  company: "Example Corp",
                  ...sampleData,
                },
              }));
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sample Data Editor */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <h4 className="font-medium text-gray-900 mb-3">Sample Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={previewData.sampleData?.name || ""}
                onChange={(e) => updateSampleData("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={previewData.sampleData?.email || ""}
                onChange={(e) => updateSampleData("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={previewData.sampleData?.company || ""}
                onChange={(e) => updateSampleData("company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Example Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <input
                type="text"
                value={previewData.sampleData?.message || ""}
                onChange={(e) => updateSampleData("message", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Custom message"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Template Preview */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Email Preview</h4>
            <div className="text-sm text-gray-500">
              Template: <span className="font-medium">{templateName}</span>
            </div>
          </div>
          {renderTemplate()}
        </motion.div>
      )}
    </div>
  );
}
