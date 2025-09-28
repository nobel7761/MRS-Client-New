"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Button,
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
} from "@mui/icons-material";
import { Event, EventStatus, EventVisibility } from "@/types/event";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onView?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return "primary";
      case EventStatus.ONGOING:
        return "success";
      case EventStatus.COMPLETED:
        return "default";
      default:
        return "default";
    }
  };

  const getVisibilityColor = (visibility: EventVisibility) => {
    switch (visibility) {
      case EventVisibility.PUBLIC:
        return "success";
      case EventVisibility.PRIVATE:
        return "warning";
      case EventVisibility.ALUMNI_ONLY:
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getSeatAvailabilityColor = () => {
    const percentage = ((event.registeredCount || 0) / event.seatLimit) * 100;
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "success";
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Event Banner with Tags */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={event.bannerImage}
          alt={event.title}
          sx={{
            objectFit: "cover",
          }}
        />

        {/* Status and Visibility Chips */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Chip
            label={event.status}
            color={getStatusColor(event.status)}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
          <Chip
            label={event.visibility}
            color={getVisibilityColor(event.visibility)}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Paid Event Badge */}
        {event.isPaidEvent && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            <Chip
              label="৳ Paid Event"
              color="secondary"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Event Title */}
        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.3,
          }}
        >
          {event.title}
        </Typography>

        {/* Short Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          {event.shortDescription}
        </Typography>

        {/* Event Details */}
        <Box sx={{ mb: 2 }}>
          {/* Date and Time */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight="medium">
              {formatDate(event.date)} at {formatTime(event.startsTime)}
            </Typography>
          </Box>

          {/* Venue */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocationIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.venue}
            </Typography>
          </Box>

          {/* Organizer */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.organizerName}
            </Typography>
          </Box>
        </Box>

        {/* Seat Availability */}
        <Box sx={{ mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
          >
            <Typography variant="body2" fontWeight="medium">
              Seats Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.registeredCount || 0} / {event.seatLimit}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: 6,
              backgroundColor: "grey.200",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${
                  ((event.registeredCount || 0) / event.seatLimit) * 100
                }%`,
                height: "100%",
                backgroundColor:
                  getSeatAvailabilityColor() === "error"
                    ? "error.main"
                    : getSeatAvailabilityColor() === "warning"
                    ? "warning.main"
                    : "success.main",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>

        {/* Special Guests */}
        {event.specialGuests && event.specialGuests.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" mb={0.5}>
              Special Guests
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {event.specialGuests.slice(0, 2).map((guest, index) => (
                <Chip
                  key={index}
                  label={guest}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
              {event.specialGuests.length > 2 && (
                <Chip
                  label={`+${event.specialGuests.length - 2} more`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Pricing Info for Paid Events */}
        {event.isPaidEvent &&
          event.pricingRanges &&
          event.pricingRanges.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                fontWeight="bold"
                mb={1.5}
                sx={{
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                ৳ Pricing Plans
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {event.pricingRanges.slice(0, 3).map((pricing, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      backgroundColor: pricing.isPopular
                        ? "primary.50"
                        : "grey.50",
                      borderRadius: 2,
                      border: "2px solid",
                      borderColor: pricing.isPopular
                        ? "primary.200"
                        : "grey.200",
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        borderColor: pricing.isPopular
                          ? "primary.300"
                          : "grey.300",
                      },
                    }}
                  >
                    {pricing.isPopular && (
                      <Chip
                        label="Popular"
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: 8,
                          fontSize: "0.6rem",
                          height: 16,
                        }}
                      />
                    )}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            fontSize: "0.8rem",
                            color: pricing.isPopular
                              ? "primary.main"
                              : "text.primary",
                            mb: 0.5,
                          }}
                        >
                          {pricing.batchRange}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.7rem",
                            display: "block",
                            lineHeight: 1.2,
                          }}
                        >
                          {pricing.description}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                          sx={{
                            fontSize: "0.9rem",
                            lineHeight: 1,
                          }}
                        >
                          ৳{pricing.fee}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
                {event.pricingRanges.length > 3 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      mt: 0.5,
                      p: 1,
                      backgroundColor: "grey.100",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    >
                      +{event.pricingRanges.length - 3} more pricing options
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

        {/* Social Media Links */}
        {event.socialMediaLinks && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              mb={1}
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              Follow Us
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {event.socialMediaLinks.facebook && (
                <Tooltip title="Facebook">
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(event.socialMediaLinks?.facebook, "_blank")
                    }
                    sx={{
                      color: "#1877F2",
                      backgroundColor: "rgba(24, 119, 242, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(24, 119, 242, 0.2)",
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <FacebookIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {event.socialMediaLinks.instagram && (
                <Tooltip title="Instagram">
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(event.socialMediaLinks?.instagram, "_blank")
                    }
                    sx={{
                      color: "#E4405F",
                      backgroundColor: "rgba(228, 64, 95, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(228, 64, 95, 0.2)",
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {event.socialMediaLinks.twitter && (
                <Tooltip title="Twitter">
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(event.socialMediaLinks?.twitter, "_blank")
                    }
                    sx={{
                      color: "#1DA1F2",
                      backgroundColor: "rgba(29, 161, 242, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(29, 161, 242, 0.2)",
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <TwitterIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {event.socialMediaLinks.linkedin && (
                <Tooltip title="LinkedIn">
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(event.socialMediaLinks?.linkedin, "_blank")
                    }
                    sx={{
                      color: "#0077B5",
                      backgroundColor: "rgba(0, 119, 181, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 119, 181, 0.2)",
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {event.socialMediaLinks.website && (
                <Tooltip title="Website">
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(event.socialMediaLinks?.website, "_blank")
                    }
                    sx={{
                      color: "primary.main",
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.2)",
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <WebsiteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => onView?.(event)}
            size="small"
          >
            View
          </Button>
          <Box>
            <Tooltip title="Edit Event">
              <IconButton
                size="small"
                onClick={() => onEdit?.(event)}
                sx={{ mr: 0.5 }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Event">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  onDelete?.(event._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard;
