"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Pagination,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
} from "@mui/icons-material";
import {
  Event,
  EventStatus,
  EventVisibility,
  EventFilters,
  CreateEventData,
  CreateEventFormData,
} from "@/types/event";
import { eventApiService } from "@/lib/eventApi";
import { useAuth } from "@/contexts/AuthContext";
import EventForm from "@/components/pages/admin/events/EventForm";
import EventCard from "@/components/pages/admin/events/EventCard";

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 10,
    sortBy: "date",
    sortOrder: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");
  const [visibilityFilter, setVisibilityFilter] = useState<
    EventVisibility | ""
  >("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventApiService.getEvents(filters);
      setEvents(response.events);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      visibility: visibilityFilter || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setDeleteConfirmationText("");
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    if (deleteConfirmationText.trim() !== eventToDelete.title) {
      setError(
        "Event title does not match. Please enter the exact event title to confirm deletion."
      );
      return;
    }

    try {
      console.log("Attempting to delete event:", eventToDelete._id);
      await eventApiService.deleteEvent(eventToDelete._id);
      console.log("Event deleted successfully");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      setDeleteConfirmationText("");
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event");
    }
  };

  const handleCreateEvent = async (
    eventData: CreateEventData | CreateEventFormData
  ) => {
    try {
      setCreateLoading(true);

      // Check if it's a file upload (CreateEventFormData) or URL input (CreateEventData)
      if ("bannerImage" in eventData && eventData.bannerImage instanceof File) {
        await eventApiService.createEventWithFile(
          eventData as CreateEventFormData
        );
      } else {
        await eventApiService.createEvent(eventData as CreateEventData);
      }

      setCreateDialogOpen(false);
      fetchEvents();
    } catch (err) {
      setError("Failed to create event");
      console.error("Error creating event:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleUpdateEvent = async (
    eventData: CreateEventData | CreateEventFormData
  ) => {
    if (!selectedEvent) return;

    try {
      setEditLoading(true);

      // Check if it's a file upload (CreateEventFormData) or URL input (CreateEventData)
      if ("bannerImage" in eventData && eventData.bannerImage instanceof File) {
        await eventApiService.updateEventWithFile(
          selectedEvent._id,
          eventData as CreateEventFormData
        );
      } else {
        await eventApiService.updateEvent(
          selectedEvent._id,
          eventData as CreateEventData
        );
      }

      setEditDialogOpen(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      setError("Failed to update event");
      console.error("Error updating event:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseDialogs = () => {
    setViewDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

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
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Events Management
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Box display="flex" border={1} borderColor="divider" borderRadius={1}>
            <Button
              variant={viewMode === "cards" ? "contained" : "text"}
              onClick={() => setViewMode("cards")}
              startIcon={<ViewModuleIcon />}
              size="small"
              sx={{ minWidth: "auto", px: 2 }}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "contained" : "text"}
              onClick={() => setViewMode("table")}
              startIcon={<ViewListIcon />}
              size="small"
              sx={{ minWidth: "auto", px: 2 }}
            >
              Table
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              md: "2fr 1fr 1fr 1fr",
            }}
            gap={2}
            alignItems="center"
          >
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as EventStatus | "")
                }
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={EventStatus.UPCOMING}>Upcoming</MenuItem>
                <MenuItem value={EventStatus.ONGOING}>Ongoing</MenuItem>
                <MenuItem value={EventStatus.COMPLETED}>Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Visibility</InputLabel>
              <Select
                value={visibilityFilter}
                onChange={(e) =>
                  setVisibilityFilter(e.target.value as EventVisibility | "")
                }
                label="Visibility"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={EventVisibility.PUBLIC}>Public</MenuItem>
                <MenuItem value={EventVisibility.PRIVATE}>Private</MenuItem>
                <MenuItem value={EventVisibility.ALUMNI_ONLY}>
                  Alumni Only
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<FilterIcon />}
              fullWidth
            >
              Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Events Display */}
      {viewMode === "cards" ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={3}
        >
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={(eventId) => {
                const event = events.find((e) => e._id === eventId);
                if (event) handleDeleteEvent(event);
              }}
              onView={handleViewEvent}
            />
          ))}
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={event.bannerImage}
                          alt={event.title}
                          sx={{ width: 60, height: 60 }}
                          variant="rounded"
                        >
                          <EventIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.shortDescription}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={0.5}
                          >
                            <PeopleIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {event.organizerName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(event.date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(event.startsTime)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">{event.venue}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.status}
                        color={getStatusColor(event.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.visibility}
                        color={getVisibilityColor(event.visibility)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {event.registeredCount || 0} / {event.seatLimit}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewEvent(event)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Event">
                          <IconButton
                            size="small"
                            onClick={() => handleEditEvent(event)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Event">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteEvent(event)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Create Event Dialog */}
      <EventForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateEvent}
        loading={createLoading}
      />

      {/* Edit Event Dialog */}
      <EventForm
        open={editDialogOpen}
        onClose={handleCloseDialogs}
        onSubmit={handleUpdateEvent}
        loading={editLoading}
        event={selectedEvent}
        mode="edit"
      />

      {/* View Event Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            p: 3,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
              opacity: 0.3,
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Event Details
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Complete information about this event
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseDialogs}
              size="small"
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedEvent && (
            <Box>
              {/* Event Image */}
              <Box
                sx={{
                  mb: 4,
                  textAlign: "center",
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                <img
                  src={selectedEvent.bannerImage}
                  alt={selectedEvent.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
                {/* Overlay gradient */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  }}
                />
              </Box>

              {/* Event Title */}
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                {selectedEvent.title}
              </Typography>

              {/* Event Description */}
              <Box
                sx={{
                  mb: 3,
                  lineHeight: 1.6,
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    marginTop: 2,
                    marginBottom: 1,
                    fontWeight: "bold",
                  },
                  "& p": {
                    marginBottom: 1,
                  },
                  "& ul, & ol": {
                    marginLeft: 2,
                    marginBottom: 1,
                  },
                  "& a": {
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedEvent.fullDescription,
                }}
              />

              {/* Event Details Grid */}
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                gap={3}
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Date & Time
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ScheduleIcon color="action" />
                    <Typography>
                      {formatDate(selectedEvent.date)} at{" "}
                      {formatTime(selectedEvent.startsTime)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Venue
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationIcon color="action" />
                    <Typography>{selectedEvent.venue}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Organizer
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PeopleIcon color="action" />
                    <Typography>{selectedEvent.organizerName}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Seats Available
                  </Typography>
                  <Typography>
                    {selectedEvent.registeredCount || 0} /{" "}
                    {selectedEvent.seatLimit}
                  </Typography>
                </Box>
              </Box>

              {/* Status and Visibility */}
              <Box display="flex" gap={2} mb={3}>
                <Chip
                  label={selectedEvent.status}
                  color={getStatusColor(selectedEvent.status)}
                  sx={{ fontWeight: "bold" }}
                />
                <Chip
                  label={selectedEvent.visibility}
                  color={getVisibilityColor(selectedEvent.visibility)}
                  variant="outlined"
                />
                {selectedEvent.isPaidEvent && (
                  <Chip
                    label="৳ Paid Event"
                    color="secondary"
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>

              {/* Special Guests */}
              {selectedEvent.specialGuests &&
                selectedEvent.specialGuests.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      Special Guests
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {selectedEvent.specialGuests.map((guest, index) => (
                        <Chip key={index} label={guest} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

              {/* Pricing Info */}
              {selectedEvent.isPaidEvent &&
                selectedEvent.pricingRanges &&
                selectedEvent.pricingRanges.length > 0 && (
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        mb: 3,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      ৳ Pricing Plans
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {selectedEvent.pricingRanges.map((pricing, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 3,
                            backgroundColor: pricing.isPopular
                              ? "primary.50"
                              : "grey.50",
                            borderRadius: 3,
                            border: "2px solid",
                            borderColor: pricing.isPopular
                              ? "primary.200"
                              : "grey.200",
                            position: "relative",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              borderColor: pricing.isPopular
                                ? "primary.300"
                                : "grey.300",
                            },
                          }}
                        >
                          {pricing.isPopular && (
                            <Chip
                              label="Most Popular"
                              color="primary"
                              sx={{
                                position: "absolute",
                                top: -12,
                                right: 20,
                                fontWeight: "bold",
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
                                variant="h5"
                                fontWeight="bold"
                                sx={{
                                  mb: 1,
                                  color: pricing.isPopular
                                    ? "primary.main"
                                    : "text.primary",
                                }}
                              >
                                {pricing.batchRange}
                              </Typography>
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ lineHeight: 1.5 }}
                              >
                                {pricing.description}
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography
                                variant="h4"
                                color="primary"
                                fontWeight="bold"
                                sx={{ lineHeight: 1 }}
                              >
                                ৳{pricing.fee}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

              {/* Social Media Links */}
              {selectedEvent.socialMediaLinks && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PeopleIcon />
                    Follow Us
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {selectedEvent.socialMediaLinks.facebook && (
                      <Tooltip title="Facebook">
                        <IconButton
                          onClick={() =>
                            window.open(
                              selectedEvent.socialMediaLinks?.facebook,
                              "_blank"
                            )
                          }
                          sx={{
                            color: "#1877F2",
                            backgroundColor: "rgba(24, 119, 242, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(24, 119, 242, 0.2)",
                              transform: "scale(1.1)",
                            },
                            width: 48,
                            height: 48,
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <FacebookIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {selectedEvent.socialMediaLinks.instagram && (
                      <Tooltip title="Instagram">
                        <IconButton
                          onClick={() =>
                            window.open(
                              selectedEvent.socialMediaLinks?.instagram,
                              "_blank"
                            )
                          }
                          sx={{
                            color: "#E4405F",
                            backgroundColor: "rgba(228, 64, 95, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(228, 64, 95, 0.2)",
                              transform: "scale(1.1)",
                            },
                            width: 48,
                            height: 48,
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <InstagramIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {selectedEvent.socialMediaLinks.twitter && (
                      <Tooltip title="Twitter">
                        <IconButton
                          onClick={() =>
                            window.open(
                              selectedEvent.socialMediaLinks?.twitter,
                              "_blank"
                            )
                          }
                          sx={{
                            color: "#1DA1F2",
                            backgroundColor: "rgba(29, 161, 242, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(29, 161, 242, 0.2)",
                              transform: "scale(1.1)",
                            },
                            width: 48,
                            height: 48,
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <TwitterIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {selectedEvent.socialMediaLinks.linkedin && (
                      <Tooltip title="LinkedIn">
                        <IconButton
                          onClick={() =>
                            window.open(
                              selectedEvent.socialMediaLinks?.linkedin,
                              "_blank"
                            )
                          }
                          sx={{
                            color: "#0077B5",
                            backgroundColor: "rgba(0, 119, 181, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 119, 181, 0.2)",
                              transform: "scale(1.1)",
                            },
                            width: 48,
                            height: 48,
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {selectedEvent.socialMediaLinks.website && (
                      <Tooltip title="Website">
                        <IconButton
                          onClick={() =>
                            window.open(
                              selectedEvent.socialMediaLinks?.website,
                              "_blank"
                            )
                          }
                          sx={{
                            color: "primary.main",
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.2)",
                              transform: "scale(1.1)",
                            },
                            width: 48,
                            height: 48,
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <WebsiteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleCloseDialogs();
              handleEditEvent(selectedEvent!);
            }}
            startIcon={<EditIcon />}
          >
            Edit Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
            color: "white",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            ⚠️ Delete Event
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            This action cannot be undone
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {eventToDelete && (
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Are you sure you want to delete this event?
              </Typography>

              <Box
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  borderRadius: 2,
                  mb: 3,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  {eventToDelete.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {eventToDelete.shortDescription}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                To confirm deletion, please type the event title exactly as
                shown above:
              </Typography>

              <TextField
                fullWidth
                label="Event Title"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder={`Type "${eventToDelete.title}" to confirm`}
                error={
                  deleteConfirmationText.trim() !== "" &&
                  deleteConfirmationText.trim() !== eventToDelete.title
                }
                helperText={
                  deleteConfirmationText.trim() !== "" &&
                  deleteConfirmationText.trim() !== eventToDelete.title
                    ? "Event title does not match"
                    : "Enter the exact event title to confirm deletion"
                }
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteEvent}
            variant="contained"
            color="error"
            disabled={deleteConfirmationText.trim() !== eventToDelete?.title}
            fullWidth
            sx={{
              fontWeight: "bold",
              "&:disabled": {
                backgroundColor: "grey.300",
                color: "grey.500",
              },
            }}
          >
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventsPage;
