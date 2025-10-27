"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { MdClose, MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { directApi } from "@/lib/directApi";
import { SilverJubileeParticipant } from "@/types/silverJubilee";

interface EmailPreviewModalProps {
  open: boolean;
  onClose: () => void;
  participant: SilverJubileeParticipant | null;
  onEmailSent: () => void;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  open,
  onClose,
  participant,
  onEmailSent,
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!participant) return;

    try {
      setIsSending(true);

      // Call the backend API to send email
      await directApi.post(`/silver-jubilee/${participant._id}/send-email`, {});

      // Show success toast
      toast.success("Email sent successfully!");

      // Close modal and refresh data
      onClose();
      onEmailSent();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!participant) return null;

  // Generate email preview content based on the .hbs template
  const getEmailContent = () => {
    const participantName =
      participant.participantCategory === "Guest"
        ? participant.guestName
        : participant.participantCategory === "Baby"
        ? participant.babyName
        : participant.fullName;

    // For Guest and Baby, use their own email or fallback to a default
    // Note: The main participant's email should be fetched separately if needed
    const recipientEmail = participant.email;

    return {
      subject: `Silver Jubilee Registration Confirmation - ${participantName}`,
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
      onClose={handleCancel}
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
              Email Preview
            </Typography>
          </Box>
          <Button
            onClick={handleCancel}
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
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#6b7280", marginBottom: 1 }}
            >
              To:
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {emailContent.recipientEmail}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#6b7280", marginBottom: 1 }}
            >
              Subject:
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: 3, fontWeight: 500 }}
            >
              {emailContent.subject}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#6b7280", marginBottom: 1 }}
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
                title="Email Preview"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#f8fafc",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            disabled={isSending}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              padding: "8px 24px",
              borderColor: "#d1d5db",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            disabled={isSending}
            startIcon={
              isSending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <MdEmail />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 500,
              padding: "8px 24px",
              backgroundColor: "#3b82f6",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
              "&:disabled": {
                backgroundColor: "#9ca3af",
              },
            }}
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default EmailPreviewModal;
