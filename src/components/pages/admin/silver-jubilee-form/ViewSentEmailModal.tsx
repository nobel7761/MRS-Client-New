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
    <link href='https://fonts.googleapis.com/css2?family=Rubik:wght@400&display=swap' rel='stylesheet' />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
      .container {
        width: 100%;
        max-width: 600px;
        background-color: #ffffff;
        padding: 10px;
        border-radius: 10px;
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
      <img src='https://res.cloudinary.com/dfgghtrbn/image/upload/v1761478027/flxqsr9g7zd5hhe116xo.png' alt='Header' style='width: 100%; max-width: 600px; display: block; margin: 0 auto;' />

      <div class='content'>
        <!-- Main Content Section -->
        <div style='background: white'>
          <!-- Personal Message -->
          <div style='padding: 15px 10px 5px'>
            <p style="color: #333; font-size:16px; line-height:1.5; margin:0 0 15px 0; font-family:'Rubik',sans-serif; text-align:left;">
              <strong>Dear ${participantName},</strong>
            </p>
            <p style="color:#666; font-size:15px; line-height:1.5; margin:0 0 10px 0; font-family:'Rubik',sans-serif; text-align:left;">
              Thank you for your registration! We're thrilled to have you join us for this historic celebration.
            </p> 
            <p style="color:#666; font-size:15px; line-height:1.5; margin:0; font-family:'Rubik',sans-serif; text-align:left;">
              Join 1500+ alumni, distinguished guests, and community members as we celebrate 25 years of academic excellence and remarkable achievements. This milestone event features special presentations, networking opportunities, and a chance to reconnect with old friends and mentors.
            </p>
          </div>

          <!-- Entry Code Section -->
          <div style="background-image: url('https://res.cloudinary.com/dfgghtrbn/image/upload/v1760857690/bsfm2khj6werglhqndg4.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat; padding: 25px; border-radius: 15px; margin: 10px 0; text-align: center; position: relative; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">
            <div style='position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.4); z-index:1;'></div>
            <div style='position: relative; z-index:3'>
              <h3 style="color:white; font-size:22px; margin:0 0 15px 0; font-family:'Rubik',sans-serif; font-weight:700; text-shadow:0 2px 4px rgba(0,0,0,0.3);">
                🎫 Your Entry Verification Code
              </h3>
              <div style="background: rgba(0,0,0,0.4); color:#00ff88; padding:18px 30px; border-radius:12px; font-family:'Courier New', monospace; font-size:26px; font-weight:bold; letter-spacing:3px; margin:0 0 15px 0; border:2px solid rgba(0,255,136,0.4); text-shadow:0 0 12px rgba(0,255,136,0.6);">
                ${participant.secretCode || "N/A"}
              </div>
              <div style='background: rgba(255,255,255,0.15); padding:10px 20px; border-radius:20px; display:inline-block; margin:0 0 10px 0;'>
                <p style="color:white; font-size:13px; margin:0; font-family:'Rubik',sans-serif; font-weight:500;">
                  🚪 Show this code to security at the entrance
                </p>
              </div>
              <div style='background: rgba(255,0,0,0.2); padding:8px 15px; border-radius:15px; display:inline-block; border:1px solid rgba(255,0,0,0.3);'>
                <p style="color:#ffcccb; font-size:12px; margin:0; font-family:'Rubik',sans-serif; font-weight:600;">
                  ⚠️ Do not share this code with anyone
                </p>
              </div>
            </div>
          </div>

          <!-- Event Information -->
          <div style='margin:5px 0'>
            <div style="background-image: url('https://res.cloudinary.com/dfgghtrbn/image/upload/v1760857690/bsfm2khj6werglhqndg4.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat; padding:25px; border-radius:15px; position:relative; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.2);">
              <div style='position:absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.4); z-index:1;'></div>
              <h3 style="color:white; font-size:22px; margin:0 0 15px 0; font-family:'Rubik',sans-serif; font-weight:700; position:relative; z-index:2;">🎉 Event Details</h3>
              <div style='margin-bottom:15px; position:relative; z-index:2;'>
                <div style='flex:1;'>
                  <p style="color:white; font-size:14px; margin:0 0 10px 0; font-family:'Rubik',sans-serif; font-weight:500;">📅 December 27, 2025</p>
                  <p style="color:white; font-size:14px; margin:0 0 10px 0; font-family:'Rubik',sans-serif; font-weight:500;">⏰ Reporting Time: 8:30 AM</p>
                </div>
                <div style='flex:1;'>
                  <p style="color:white; font-size:14px; margin:0 0 5px 0; font-family:'Rubik',sans-serif; font-weight:500;">📍 Khilgaon High School (Jagoroni Sangsad Field)</p>
                  <p style="color:#90ee90; font-size:13px; margin:0 0 8px 0; font-family:'Rubik',sans-serif; font-weight:500;">⏱️ Only 2 minutes walking distance from NIC Building #1</p>
                  <a href='https://www.google.com/maps/place/Khilgaon+High+School+Playground,+Dhaka/@23.7500046,90.4180586,17z/data=!3m1!4b1!4m6!3m5!1s0x3755b86fe843310f:0xa362fbb5e1b2a797!8m2!3d23.7498775!4d90.4229755!16s%2Fg%2F11bvtbdxk5?entry=ttu&g_ep=EgoyMDI1MDkxNC4wIKXMDSoASAFQAw%3D%3D' target='_blank' style="color:white; text-decoration:none; font-size:13px; font-family:'Rubik',sans-serif; font-weight:500; background: rgba(255,255,255,0.2); padding:6px 12px; border-radius:15px; display:inline-block;">🗺️ View on Map</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Closing Message -->
          <div style='padding:15px 10px 5px'>
            <p style="color:#666; font-size:15px; line-height:1.5; margin:0 0 10px 0; font-family:'Rubik',sans-serif; text-align:left;">
              We can't wait to celebrate this milestone with you! Get ready for an amazing day filled with memories, laughter, and joy. This special occasion will bring together our alumni community for a day of celebration, networking, and reconnection.
            </p>
          </div>
          
          <!-- Bottom Footer Top Section -->
          <img src='https://res.cloudinary.com/dfgghtrbn/image/upload/v1761478027/urniivaufi3fbwpnfmmb.png' alt='Footer Top' style='width: 100%; max-width: 600px; display: block; margin: 0 auto;' />
        </div>

        <!-- Bottom Footer Bottom Section -->
        <img src='https://res.cloudinary.com/dfgghtrbn/image/upload/v1761478319/qlvxywldmhd7ooub8tcj.png' alt='Footer' style='width: 100%; max-width: 600px; display: block; margin: 0 auto;' />
      </div>
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
