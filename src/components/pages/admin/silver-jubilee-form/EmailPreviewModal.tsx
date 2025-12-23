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
