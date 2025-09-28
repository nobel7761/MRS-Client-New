"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiSettings,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { emailApi } from "@/lib/emailApi";
import {
  EmailTemplate,
  EmailTemplatesResponse,
  HealthCheckResponse,
} from "@/types/email";
import backgroundImage from "@/public/background.jpg";

// Updated schema to match the API requirements
const schema = yup.object().shape({
  toEmail: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  subject: yup.string().required("Subject is required"),
  template: yup.string().required("Template is required"),
  templateData: yup.object().optional(),
});

// Interface for template information
interface TemplateInfo {
  name: string;
  description: string;
  contextFields: string[];
}

// Interface for the test email request
interface TestEmailRequest {
  toEmail: string;
  subject: string;
  template: string;
  templateData?: Record<string, any>;
}

// Interface for the test email response
interface TestEmailResponse {
  success: boolean;
  message: string;
  error?: string;
  sentAt?: Date;
}

export default function EmailTestPage() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(
    null
  );
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [testingConfig, setTestingConfig] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [lastTestResult, setLastTestResult] =
    useState<TestEmailResponse | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TestEmailRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      toEmail: "",
      subject: "",
      template: "",
      templateData: {},
    },
  });

  const selectedTemplate = watch("template");

  // Get the selected template info for displaying context fields
  const selectedTemplateInfo = templates.find(
    (t) => t.name === selectedTemplate
  );

  // Function to convert camelCase to readable format
  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim(); // Remove leading space
  };

  useEffect(() => {
    fetchTemplates();
    checkHealth(false); // Initial load without toast
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/email/templates`
      );
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      toast.error("Failed to fetch templates");
      console.error("Error fetching templates:", error);
    }
  };

  const checkHealth = async (showToast: boolean = false) => {
    try {
      setCheckingHealth(true);
      const response = await emailApi.healthCheck();
      setHealthStatus(response);

      if (showToast) {
        if (response.status === "healthy") {
          toast.success("Email service is healthy!");
        } else {
          toast.error("Email service is unhealthy");
        }
      }
    } catch (error) {
      if (showToast) {
        toast.error("Failed to check email service health");
      }
      console.error("Error checking health:", error);
    } finally {
      setCheckingHealth(false);
    }
  };

  const testConfiguration = async () => {
    try {
      setTestingConfig(true);
      const response = await emailApi.testConfiguration();
      if (response.success) {
        toast.success("Email configuration test passed!");
      } else {
        toast.error(response.message || "Email configuration test failed");
      }
    } catch (error) {
      toast.error("Failed to test email configuration");
      console.error("Error testing configuration:", error);
    } finally {
      setTestingConfig(false);
    }
  };

  const onSubmit = async (data: TestEmailRequest) => {
    try {
      setSendingTest(true);

      // Direct API call to the test endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/email/send-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result: TestEmailResponse = await response.json();
      setLastTestResult(result);

      if (result.success) {
        toast.success("Test email sent successfully!");
        // Reset form fields after successful submission
        reset();
      } else {
        toast.error(result.message || "Failed to send test email");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send test email";
      toast.error(errorMessage);
      console.error("Error sending test email:", error);

      // Set error result for display
      setLastTestResult({
        success: false,
        message: errorMessage,
        error: errorMessage,
      });
    } finally {
      setSendingTest(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    return status === "healthy" ? "text-green-600" : "text-red-600";
  };

  const getHealthStatusIcon = (status: string) => {
    return status === "healthy" ? FiCheckCircle : FiXCircle;
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-cover bg-center bg-no-repeat p-5 rounded-lg"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <h1 className="text-white font-bold text-2xl mb-6">
          Email Test Configuration
        </h1>

        {/* Health Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiActivity className="mr-2" />
              Service Health Status
            </h2>
            <button
              onClick={() => checkHealth(true)}
              disabled={checkingHealth}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {checkingHealth ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Checking...
                </>
              ) : (
                "Refresh"
              )}
            </button>
          </div>

          {healthStatus ? (
            <div className="space-y-4">
              {/* Health Status */}
              <div className="flex items-center space-x-3">
                {(() => {
                  const Icon = getHealthStatusIcon(healthStatus.status);
                  return (
                    <Icon
                      className={`h-6 w-6 ${getHealthStatusColor(
                        healthStatus.status
                      )}`}
                    />
                  );
                })()}
                <div>
                  <div
                    className={`font-semibold ${getHealthStatusColor(
                      healthStatus.status
                    )}`}
                  >
                    {healthStatus.status.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Last checked:{" "}
                    {new Date(healthStatus.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Service Stats */}
              {healthStatus.stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Campaigns Stats */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Campaigns
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">
                          {healthStatus.stats.campaigns?.total || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium text-green-600">
                          {healthStatus.stats.campaigns?.completed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {healthStatus.stats.campaigns?.pending || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Batches Stats */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Batches
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">
                          {healthStatus.stats.batches?.total || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium text-green-600">
                          {healthStatus.stats.batches?.completed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {healthStatus.stats.batches?.pending || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emails Stats */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      Emails
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Sent:</span>
                        <span className="font-medium text-green-600">
                          {healthStatus.stats.emails?.sent || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <span className="font-medium text-red-600">
                          {healthStatus.stats.emails?.failed || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agenda Stats */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Jobs</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">
                          {healthStatus.stats.agenda?.totalJobs || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Running:</span>
                        <span className="font-medium text-blue-600">
                          {healthStatus.stats.agenda?.runningJobs || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <span className="font-medium text-red-600">
                          {healthStatus.stats.agenda?.failedJobs || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {healthStatus.stats.agenda?.pendingJobs || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {healthStatus.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <strong>Error:</strong> {healthStatus.error}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiActivity className="mx-auto h-12 w-12 mb-4" />
              <p>Click "Refresh" to check email service health status</p>
            </div>
          )}
        </motion.div>

        {/* Configuration Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <FiSettings className="mr-2" />
            Configuration Test
          </h2>
          <p className="text-gray-600 mb-4">
            To test email configuration is working properly or not, click the
            button. Email will be sent to:{" "}
            <span className="text-indigo-600">
              nic.alumniassociation.official@gmail.com
            </span>
          </p>
          <button
            onClick={testConfiguration}
            disabled={testingConfig}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {testingConfig ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <FiSettings className="mr-2" />
                Test Configuration
              </>
            )}
          </button>
        </motion.div>

        {/* Send Test Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <FiSend className="mr-2" />
            Send Test Email
          </h2>
          <p className="text-gray-600 mb-6">
            Send an immediate test email to verify that the email system is
            working correctly using the test API endpoint.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FiMail className="w-4 h-4 mr-2 text-blue-500" />
                  To Email *
                </label>
                <Controller
                  name="toEmail"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      placeholder="test@example.com"
                    />
                  )}
                />
                {errors.toEmail && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiXCircle className="w-4 h-4 mr-1" />
                    {errors.toEmail.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FiSend className="w-4 h-4 mr-2 text-green-500" />
                  Subject *
                </label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                      placeholder="Test Email Subject"
                    />
                  )}
                />
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiXCircle className="w-4 h-4 mr-1" />
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FiSettings className="w-4 h-4 mr-2 text-purple-500" />
                Template *
              </label>
              <Controller
                name="template"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-purple-300"
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.name} value={template.name}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.template && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <FiXCircle className="w-4 h-4 mr-1" />
                  {errors.template.message}
                </p>
              )}
            </div>

            {selectedTemplate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Data (JSON)
                </label>

                {/* Dynamic form fields based on template context */}
                {selectedTemplateInfo && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <FiSettings className="text-white w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Template Fields
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {selectedTemplateInfo.contextFields.map(
                        (field, index) => {
                          const [fieldName, fieldType] = field.split(" (");
                          const cleanFieldName = fieldName;
                          const cleanFieldType = fieldType
                            ? fieldType.replace(")", "")
                            : "string";

                          return (
                            <div key={index} className="group">
                              <div className="relative">
                                <input
                                  type={
                                    cleanFieldType === "number"
                                      ? "number"
                                      : "text"
                                  }
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md group-hover:border-blue-300"
                                  placeholder={`Enter ${formatFieldName(
                                    cleanFieldName
                                  )}`}
                                  onChange={(e) => {
                                    const currentData =
                                      watch("templateData") || {};
                                    const newData = {
                                      ...currentData,
                                      [cleanFieldName]:
                                        cleanFieldType === "number"
                                          ? Number(e.target.value)
                                          : e.target.value,
                                    };
                                    setValue("templateData", newData);
                                  }}
                                />
                                <div className="absolute -top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {cleanFieldType}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* JSON Preview */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                      <FiCheckCircle className="text-white w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      JSON Preview
                    </h3>
                    <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Auto-generated
                    </span>
                  </div>

                  <textarea
                    value={JSON.stringify(watch("templateData") || {}, null, 2)}
                    readOnly
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 shadow-sm"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the fields above to generate your template data. The
                  JSON preview updates automatically.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => reset()}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={sendingTest}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {sendingTest ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Last Test Result */}
          {lastTestResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 rounded-md border"
              style={{
                backgroundColor: lastTestResult.success ? "#f0fdf4" : "#fef2f2",
                borderColor: lastTestResult.success ? "#bbf7d0" : "#fecaca",
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                {lastTestResult.success ? (
                  <FiCheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <FiXCircle className="h-5 w-5 text-red-600" />
                )}
                <h3 className="font-semibold text-gray-900">
                  Last Test Result
                </h3>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Status:</strong>{" "}
                  {lastTestResult.success ? "Success" : "Failed"}
                </p>
                <p>
                  <strong>Message:</strong> {lastTestResult.message}
                </p>
                {lastTestResult.sentAt && (
                  <p>
                    <strong>Sent At:</strong>{" "}
                    {new Date(lastTestResult.sentAt).toLocaleString()}
                  </p>
                )}
                {lastTestResult.error && (
                  <p>
                    <strong>Error:</strong> {lastTestResult.error}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
