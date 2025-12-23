"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
} from "@mui/material";
import { MdClose, MdEmail } from "react-icons/md";
import { SilverJubileeParticipant } from "@/types/silverJubilee";

interface ViewSentEmailModalProps {
  open: boolean;
  onClose: () => void;
  participant: SilverJubileeParticipant | null;
}

const ViewSentEmailModal: React.FC<ViewSentEmailModalProps> = ({
  open,
  onClose,
  participant,
}) => {
  if (!participant) return null;

  // Format date to "20th June, 2025 4:52 PM" format
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Get ordinal suffix for day
      const getOrdinalSuffix = (day: number): string => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      // Format time
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

      return `${day}${getOrdinalSuffix(
        day
      )} ${month}, ${year} ${hours}:${minutesStr} ${ampm}`;
    } catch (error) {
      return "N/A";
    }
  };

  // Get formatted names from objects
  const getFullName = (person: any): string => {
    if (!person) return "N/A";
    if (typeof person === "string") return person;
    const firstName = person.firstName || "";
    const lastName = person.lastName || "";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  // Generate email content based on the .hbs template (same as EmailPreviewModal)
  const getEmailContent = () => {
    const participantName =
      participant.participantCategory === "Guest"
        ? participant.guestName
        : participant.participantCategory === "Baby"
        ? participant.babyName
        : participant.fullName;

    // Get recipient email from emailSendingDetails if available (this is the actual email that was sent)
    const emailSendingDetails = (participant as any).emailSendingDetails;
    let recipientEmail = "N/A";
    let emailSubject = `Silver Jubilee Registration Confirmation - ${participantName}`;

    if (
      emailSendingDetails &&
      Array.isArray(emailSendingDetails) &&
      emailSendingDetails.length > 0
    ) {
      const latestEmail = emailSendingDetails[emailSendingDetails.length - 1]; // Get the most recent email
      if (latestEmail?.emailMetadata?.to) {
        recipientEmail = latestEmail.emailMetadata.to;
      }
      if (latestEmail?.emailMetadata?.subject) {
        emailSubject = latestEmail.emailMetadata.subject;
      }
    } else {
      // Fallback to participant.email if emailSendingDetails is not available
      recipientEmail =
        participant.email ||
        (participant as any).guestEmail ||
        (participant as any).babyEmail ||
        (participant as any).sentToEmail ||
        "N/A";
    }

    return {
      subject: emailSubject,
      recipientEmail,
      content: `
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>National Ideal College Silver Jubilee</title>
    <link
      href='https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap'
      rel='stylesheet'
    />
    <style>
      /* Email-safe CSS - removed animations for better compatibility */
      /* @keyframes shimmer {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      } */
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        /* min-height: 100vh; */
        /* display: flex; */
        /* align-items: center; */
        /* justify-content: center; */
      }
      .container {
        width: 100%;
        max-width: 600px;
        background-color: #ffffff;
        padding: 10px;
        border-radius: 10px;
        /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
        text-align: center;
        margin: 0 auto;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        padding: 15px;
        background-image: url('https://res.cloudinary.com/dfgghtrbn/image/upload/v1760857690/bsfm2khj6werglhqndg4.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 8px 8px 0 0;
        margin: -10px -10px 1px -10px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      }
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1;
      }
      .header > * {
        position: relative;
        z-index: 2;
      }
      .logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
        flex-shrink: 0;
      }
      .header-text {
        flex: 1;
        text-align: left;
        margin: 0 10px;
        min-width: 0;
      }
      .header-text h1 {
        margin: 0;
        font-size: 28px;
        color: #ffffff;
        font-weight: 400;
        white-space: nowrap;
        font-family: 'Rubik', sans-serif;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        letter-spacing: 1px;
        text-transform: uppercase;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .organized-by {
        margin-top: 3px;
        font-size: 14px;
        color: #ffffff;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        font-family: 'Rubik', sans-serif;
        font-weight: 400;
      }
      .organized-by a {
        color: #0066cc;
        text-decoration: none;
      }
      .organized-by a:hover {
        text-decoration: underline;
      }
      .content {
        color: #333;
        line-height: 1.6;
      }
      @media (max-width: 768px) {
        .container {
          width: 90%;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class='container'>

      
<!-- Header Section -->
      <img src='https://res.cloudinary.com/dfgghtrbn/image/upload/v1766519465/bsbrm9drqnyqzm843hkf.png' alt='Header' style='width: 100%; max-width: 600px; display: block; margin: 0 auto;' />

      <div class='content'>
        <!-- Main Content Section -->
        <div style='background: white'>
          <!-- Personal Message -->
          <div style='padding: 15px 10px 5px'>
            <p
              style="color: #333; font-size:16px; line-height:1.5; margin:0 0 15px 0; font-family:'Rubik',sans-serif; text-align:left;"
            >
              <strong>Dear ${participantName},</strong>
            </p>
            <p
              style="color:#666; font-size:15px; line-height:1.5; margin:0 0 10px 0; font-family:'Rubik',sans-serif; text-align:left;"
            >
              Thank you for your registration! We're thrilled to have you join
              us for this historic celebration.
            </p> 
            <p
              style="color:#666; font-size:15px; line-height:1.5; margin:0 0 10px 0; font-family:'Rubik',sans-serif; text-align:left;"
            >
              We can't wait to celebrate this milestone with you! Get ready for
              an amazing day filled with memories, laughter, and joy. This
              special occasion will bring together our alumni community for a
              day of celebration, networking, and reconnection. This milestone
              event features special presentations, networking opportunities, and
              a chance to reconnect with old friends and mentors.
            </p>
            <p
              style="color:#666; font-size:15px; line-height:1.5; margin:0; font-family:'Rubik',sans-serif; text-align:left;"
            >
              The celebration will take place at the Institution of Engineers, Bangladesh (IEB). To ensure a smooth and comfortable journey for our participants, dedicated bus services will be provided by the National Ideal College Alumni Association. The buses will depart from National Ideal College (Building No. 1) to the event venue and, after the conclusion of the program, will drop participants back at the same location. The detailed bus schedule will be announced on the official National Ideal College Alumni Association Facebook page. <a href='https://maps.app.goo.gl/2AZdZMk9VubUkyNU9' target='_blank' style='color:#667eea; text-decoration:none; font-weight:600;'>View our venue on map</a>.
            </p>
          </div>

          <!-- Entry Code Section -->
          <div style='background:#f8f9fa; padding:20px; margin:20px 10px; border-radius:8px; border-left:4px solid #667eea;'>
            <p
              style="color:#333; font-size:15px; line-height:1.6; margin:0 0 15px 0; font-family:'Rubik',sans-serif; text-align:left;"
            >
              Your Entry Verification Code: 
            </p>
            <div style='background:#fff; border:2px solid #e0e7ff; border-radius:6px; padding:15px; margin-bottom:15px; text-align:center;'>
              <strong style="font-size:20px; font-family:'Courier New', monospace; color:#667eea; letter-spacing:2px;">${participant.secretCode || "N/A"}</strong>
            </div>
            <p
              style="color:#666; font-size:14px; line-height:1.6; margin:0; font-family:'Rubik',sans-serif; text-align:left;"
            >
              🚪 Show this code to security at the entrance. ⚠️ Do not share this code with anyone.
            </p>
          </div>

          <!-- Closing Message -->
          <div style='padding:15px 10px 5px'>
          </div>
        </div>

        <!-- Bottom Footer Bottom Section -->
        <img src='https://res.cloudinary.com/dfgghtrbn/image/upload/v1766519465/yq4x3qw8lfy2wkqzq0ow.png' alt='Footer' style='width: 100%; max-width: 600px; display: block; margin: 0 auto;' />

    </div>
  </body>
</html>
      `.trim(),
    };
  };

  const emailContent = getEmailContent();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MdEmail className="text-blue-600 text-xl" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
              Sent Email
            </Typography>
          </Box>
          <Button
            onClick={onClose}
            sx={{
              minWidth: "auto",
              padding: "8px",
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            <MdClose className="text-gray-600" />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ padding: "24px" }}>
          <Box sx={{ marginBottom: 3 }}>
            {/* Information Section */}
            <Box
              sx={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                padding: 2,
                marginBottom: 3,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#6b7280",
                      minWidth: "140px",
                    }}
                  >
                    Registered on:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1f2937" }}>
                    {formatDate(participant.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#6b7280",
                      minWidth: "140px",
                    }}
                  >
                    Sent on:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1f2937" }}>
                    {(() => {
                      // Get sent date from emailSendingDetails if available
                      const emailSendingDetails = (participant as any)
                        .emailSendingDetails;
                      let sentDate: string | undefined;

                      if (
                        emailSendingDetails &&
                        Array.isArray(emailSendingDetails) &&
                        emailSendingDetails.length > 0
                      ) {
                        const latestEmail =
                          emailSendingDetails[emailSendingDetails.length - 1];
                        sentDate = latestEmail?.sentAt;
                      }

                      // Fallback to emailSentAt or updatedAt
                      return formatDate(
                        sentDate ||
                          (participant as any).emailSentAt ||
                          participant.updatedAt
                      );
                    })()}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#6b7280",
                      minWidth: "140px",
                    }}
                  >
                    Registered Under:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1f2937" }}>
                    {getFullName(participant.registeredUnder)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#6b7280",
                      minWidth: "140px",
                    }}
                  >
                    Form Filled Up By:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1f2937" }}>
                    {getFullName((participant as any).formFilledUpBy)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#6b7280",
                      minWidth: "140px",
                    }}
                  >
                    To:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1f2937" }}>
                    {emailContent.recipientEmail}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#6b7280",
                      minWidth: "140px",
                    }}
                  >
                    Subject:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#1f2937", fontWeight: 500 }}
                  >
                    {emailContent.subject}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "#6b7280",
                marginBottom: 1,
                marginTop: 2,
              }}
            >
              Message:
            </Typography>
            <Box
              sx={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              <iframe
                srcDoc={emailContent.content}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                  borderRadius: "4px",
                }}
                title="Sent Email View"
              />
            </Box>
          </Box>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default ViewSentEmailModal;
