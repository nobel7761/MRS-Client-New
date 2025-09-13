"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
interface EmailTemplatePreviewProps {
  templateName: string;
  templateData?: Record<string, any>;
  subject?: string;
  recipientName?: string;
}

export default function EmailTemplatePreview({
  templateName,
  templateData = {},
  subject = "Email Subject",
  recipientName = "User",
}: EmailTemplatePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);

  const renderTemplateContent = () => {
    const data: any = {
      recipientName,
      ...templateData,
    };

    switch (templateName) {
      case "welcome":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center mb-6">
              <FiMail className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Our Platform!
              </h1>
              <p className="text-gray-600">
                We're excited to have you on board,{" "}
                {data.recipientName || "there"}!
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Thank you for joining us. We're committed to providing you with
                the best experience possible.
              </p>

              {data.companyName && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    About {data.companyName}
                  </h3>
                  <p className="text-gray-600">
                    {data.companyDescription ||
                      "We are dedicated to excellence and innovation."}
                  </p>
                </div>
              )}

              <div className="text-center">
                <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
                  Get Started
                </button>
              </div>

              <div className="text-sm text-gray-500 text-center mt-6">
                <p>
                  If you have any questions, feel free to reach out to our
                  support team.
                </p>
                <p className="mt-2">
                  Best regards,
                  <br />
                  The Team
                </p>
              </div>
            </div>
          </div>
        );

      case "newsletter":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {data.newsletterTitle || "Monthly Newsletter"}
              </h1>
              <p className="text-gray-600">
                Stay updated with our latest news and updates
              </p>
            </div>

            <div className="space-y-6">
              {data.featuredArticle && (
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Featured Article
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {data.featuredArticle.title}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {data.featuredArticle.excerpt}
                  </p>
                </div>
              )}

              {data.updates && data.updates.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Latest Updates
                  </h3>
                  <ul className="space-y-2">
                    {data.updates.map((update: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-gray-700">{update}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-primary">
                      {data.stats?.users || "1,234"}
                    </div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">
                      {data.stats?.growth || "15%"}
                    </div>
                    <div className="text-gray-600">Growth Rate</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
                  Read More
                </button>
              </div>
            </div>
          </div>
        );

      case "notification":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {data.notificationTitle || "Important Notification"}
              </h1>
              <p className="text-gray-600">
                {data.notificationSubtitle ||
                  "Please review the following information"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiMail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      {data.message ||
                        "This is an important notification that requires your attention."}
                    </p>
                  </div>
                </div>
              </div>

              {data.details && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    {Object.entries(data.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.actionUrl && (
                <div className="text-center">
                  <a
                    href={data.actionUrl}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors inline-block"
                  >
                    {data.actionText || "Take Action"}
                  </a>
                </div>
              )}

              <div className="text-sm text-gray-500 text-center mt-6">
                <p>
                  This is an automated notification. Please do not reply to this
                  email.
                </p>
              </div>
            </div>
          </div>
        );

      case "silver-jubilee-announcement":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center mb-6">
              <FiMail className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Silver Jubilee Celebration
              </h1>
              <p className="text-gray-600">
                National Ideal College - 25 Years of Excellence
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Dear {data.recipientName || "Valued Community Member"},
              </p>

              <p className="text-gray-700">
                We are thrilled to announce the celebration of our Silver
                Jubilee! This milestone marks 25 years of excellence in
                education and community service.
              </p>

              {data.announcementDate && (
                <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-400">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Event Date
                  </h3>
                  <p className="text-yellow-700">{data.announcementDate}</p>
                </div>
              )}

              {data.openingCeremony && (
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Opening Ceremony
                  </h3>
                  <p className="text-blue-700">{data.openingCeremony}</p>
                </div>
              )}

              {data.registrationLink && (
                <div className="text-center">
                  <a
                    href={data.registrationLink}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors inline-block"
                  >
                    Register Now
                  </a>
                </div>
              )}

              <div className="text-sm text-gray-500 text-center mt-6">
                <p>
                  We look forward to celebrating this special occasion with you!
                </p>
                <p className="mt-2">
                  Best regards,
                  <br />
                  The National Ideal College Team
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <FiMail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Template preview not available</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Preview</h3>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          {showPreview ? (
            <FiEyeOff className="h-4 w-4" />
          ) : (
            <FiEye className="h-4 w-4" />
          )}
          <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
        </button>
      </div>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          {/* Email Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">To:</span> {recipientName} &lt;
                {recipientName.toLowerCase().replace(/\s+/g, ".")}
                @example.com&gt;
              </div>
              <div>
                <span className="font-medium">Subject:</span> {subject}
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="max-w-2xl mx-auto">{renderTemplateContent()}</div>
        </motion.div>
      )}
    </div>
  );
}
