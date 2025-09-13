"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignDashboard from "@/components/pages/admin/email/CampaignDashboard";
import CampaignForm from "@/components/pages/admin/email/CampaignForm";
import CampaignDetails from "@/components/pages/admin/email/CampaignDetails";
import { useEmailManagement } from "@/hooks/useEmailManagement";
import { CampaignCreationRequest } from "@/types/email";

type ViewType = "dashboard" | "create" | "details";

export default function EmailCampaignsPage() {
  const router = useRouter();
  const { createCampaign } = useEmailManagement();
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );

  const handleCreateCampaign = () => {
    setCurrentView("create");
  };

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setCurrentView("details");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCampaignId(null);
  };

  const handleCancelCreate = () => {
    setCurrentView("dashboard");
  };

  const handleSubmitCampaign = async (data: CampaignCreationRequest) => {
    try {
      const response = await createCampaign(data);

      if (response && response.success) {
        // Show success message
        console.log("Campaign created successfully:", response.campaignId);
        setCurrentView("dashboard");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return (
          <CampaignForm
            onSubmit={handleSubmitCampaign}
            onCancel={handleCancelCreate}
          />
        );
      case "details":
        return (
          <CampaignDetails
            campaignId={selectedCampaignId!}
            onBack={handleBackToDashboard}
          />
        );
      default:
        return (
          <CampaignDashboard
            onCreateCampaign={handleCreateCampaign}
            onViewCampaign={handleViewCampaign}
          />
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
}
