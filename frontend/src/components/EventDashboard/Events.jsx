import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Fab,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Badge,
  Divider,
  Fade,
  Grow,
  Slide,
  Zoom
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { getAllEvents, registerForEvent, getRegisteredEvents } from "../../services/eventService";
import Header from "../EventDashboard/Header";
import CustSidebar from "../EventDashboard/CustSidebar";
import { motion } from "framer-motion";
import { styled } from "@mui/system";

// Custom styled components
const ModernCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.primary.light,
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  borderRadius: '12px',
  padding: '8px 20px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  }
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }
  },
});

const StyledSelect = styled(Select)({
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  '&.Mui-focused': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
});

const EventsPage = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();

        let registeredData = [];
        if (user) {
          try {
            registeredData = await getRegisteredEvents();
          } catch (regError) {
            console.error("Error fetching registered events:", regError);
          }
        }

        const allEvents = eventsData.events || eventsData;
        setEvents(allEvents);
        setRegisteredEvents(registeredData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setViewModalOpen(true);
  };

  const handleRegister = async (eventId) => {
    try {
      setRegistrationError(null);
      await registerForEvent(eventId);
      setEvents(events.map(event =>
        event.id === eventId
          ? { ...event, registered: (event.registered || 0) + 1 }
          : event
      ));
      const eventToAdd = events.find(e => e.id === eventId);
      setRegisteredEvents([...registeredEvents, eventToAdd]);
    } catch (error) {
      setRegistrationError(error.message);
      console.error("Registration failed:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDate = !selectedDate ||
      (event.startDate && new Date(event.startDate).toDateString() === new Date(selectedDate).toDateString());

    const matchesStatus =
      status === "All Status" ||
      (status === "Upcoming" && event.startDate && new Date(event.startDate) > new Date()) ||
      (status === "Past" && event.endDate && new Date(event.endDate) <= new Date()) ||
      (status === "Featured" && event.featured);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const isRegistered = (eventId) => {
    return registeredEvents.some(event => event.id === eventId);
  };

  if (error) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}>
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <CustSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <Box sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Error loading events
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
                {error}
              </Typography>
              <GradientButton
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Try Again
              </GradientButton>
            </motion.div>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <CustSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {loading ? (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CircularProgress size={60} thickness={5} sx={{ color: "#8b5cf6" }} />
            </motion.div>
          </Box>
        ) : (
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 4,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(0,0,0,0.3)',
            }
          }}>
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
              flexWrap: 'wrap',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              pt: 2,
              pb: 2,
              backdropFilter: 'blur(8px)'
            }}>
              <StyledTextField
                placeholder="Search events..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flexGrow: 1,
                  minWidth: '250px'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl sx={{ minWidth: 150 }}>
                <StyledSelect
                  value={status}
                  onChange={handleStatusChange}
                  displayEmpty
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                  <MenuItem value="Past">Past</MenuItem>
                  <MenuItem value="Featured">Featured</MenuItem>
                </StyledSelect>
              </FormControl>

              <StyledTextField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            {filteredEvents.length > 0 ? (
              <>
                <Typography variant="h5" component="h2" fontWeight="bold" sx={{
                  mb: 3,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
                    borderRadius: '2px'
                  }
                }}>
                  All Events ({filteredEvents.length})
                </Typography>

                <Grid container spacing={3}>
                  {filteredEvents.map((event, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                      <Grow in={true} timeout={(index % 10) * 200}>
                        <div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onHoverStart={() => setHoveredCard(event.id)}
                            onHoverEnd={() => setHoveredCard(null)}
                          >
                            <ModernCard>
                              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                <motion.div
                                  animate={{
                                    scale: hoveredCard === event.id ? 1.05 : 1
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CardMedia
                                    component="img"
                                    height="180"
                                    image={event.image || '/default-event.jpg'}
                                    alt={event.title}
                                    sx={{
                                      objectFit: 'cover',
                                      filter: hoveredCard === event.id ? 'brightness(1.05)' : 'brightness(1)',
                                      transition: 'filter 0.3s ease'
                                    }}
                                  />
                                </motion.div>
                                {isRegistered(event.id) && (
                                  <Chip
                                    icon={<CheckCircleIcon fontSize="small" />}
                                    label="Registered"
                                    sx={{
                                      position: 'absolute',
                                      top: 12,
                                      right: 12,
                                      background: 'linear-gradient(45deg, #4caf50, #81c784)',
                                      color: 'white',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                      zIndex: 1
                                    }}
                                  />
                                )}
                                {event.featured && (
                                  <Box sx={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    zIndex: 1
                                  }}>
                                    <StarIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                    Featured
                                  </Box>
                                )}
                              </Box>

                              <CardContent sx={{
                                flexGrow: 1,
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(4px)'
                              }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                                  {event.title}
                                </Typography>

                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1.5,
                                  background: 'rgba(0, 0, 0, 0.02)',
                                  p: 1,
                                  borderRadius: '8px'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: 'primary.light',
                                    color: 'primary.dark',
                                    width: 28,
                                    height: 28,
                                    mr: 1.5
                                  }}>
                                    <CalendarIcon sx={{ fontSize: '1rem' }} />
                                  </Avatar>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(event.startDate)}
                                  </Typography>
                                </Box>

                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1.5,
                                  background: 'rgba(0, 0, 0, 0.02)',
                                  p: 1,
                                  borderRadius: '8px'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: 'secondary.light',
                                    color: 'secondary.dark',
                                    width: 28,
                                    height: 28,
                                    mr: 1.5
                                  }}>
                                    <TimeIcon sx={{ fontSize: '1rem' }} />
                                  </Avatar>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatTime(event.time || event.startDate)}
                                  </Typography>
                                </Box>

                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1.5,
                                  background: 'rgba(0, 0, 0, 0.02)',
                                  p: 1,
                                  borderRadius: '8px'
                                }}>
                                  <Avatar sx={{
                                    bgcolor: 'error.light',
                                    color: 'error.dark',
                                    width: 28,
                                    height: 28,
                                    mr: 1.5
                                  }}>
                                    <LocationIcon sx={{ fontSize: '1rem' }} />
                                  </Avatar>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {event.location}
                                  </Typography>
                                </Box>
                              </CardContent>

                              <CardActions sx={{
                                px: 2,
                                pb: 2,
                                pt: 0,
                                justifyContent: 'space-between',
                                background: 'rgba(255, 255, 255, 0.9)'
                              }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                                  {event.price > 0 ? `$${event.price}` : 'Free'}
                                </Typography>

                                <Box>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      borderRadius: '12px',
                                      textTransform: 'none',
                                      mr: 1,
                                      fontWeight: 600,
                                      borderWidth: '2px',
                                      '&:hover': {
                                        borderWidth: '2px'
                                      }
                                    }}
                                    onClick={() => handleView(event)}
                                  >
                                    Details
                                  </Button>

                                  {user && (
                                    <GradientButton
                                      size="small"
                                      onClick={() => handleRegister(event.id)}
                                      disabled={isRegistered(event.id)}
                                      sx={{
                                        opacity: isRegistered(event.id) ? 0.7 : 1,
                                        background: isRegistered(event.id)
                                          ? 'linear-gradient(45deg, #4caf50, #81c784)'
                                          : 'linear-gradient(45deg, #3f51b5, #2196f3)'
                                      }}
                                    >
                                      {isRegistered(event.id) ? 'Registered' : 'Register'}
                                    </GradientButton>
                                  )}
                                </Box>
                              </CardActions>
                            </ModernCard>
                          </motion.div>
                        </div>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '16px',
                p: 4,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
              }}>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                </motion.div>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  No events found
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, maxWidth: '500px' }}>
                  Try adjusting your search or filters to find what you're looking for
                </Typography>
                <GradientButton
                  onClick={() => {
                    setSearchTerm('');
                    setStatus('All Status');
                    setSelectedDate('');
                  }}
                >
                  Clear all filters
                </GradientButton>
              </Box>
            )}

            {/* Event Details Modal */}
            <Dialog
              open={viewModalOpen}
              onClose={() => setViewModalOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '20px',
                  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
                },
              }}
            >
              {selectedEvent && (
                <>
                  <DialogTitle sx={{
                    background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
                    color: 'white',
                    py: 2,
                    px: 3
                  }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight="bold">{selectedEvent.title}</Typography>
                      <IconButton
                        onClick={() => setViewModalOpen(false)}
                        sx={{
                          color: 'white',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)'
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </DialogTitle>

                  <DialogContent dividers sx={{ p: 0 }}>
                    <Box sx={{
                      mb: 3,
                      position: 'relative',
                      height: '300px',
                      overflow: 'hidden'
                    }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={selectedEvent.image || '/default-event.jpg'}
                        alt={selectedEvent.title}
                        sx={{
                          objectFit: 'cover',
                          width: '100%',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      {selectedEvent.featured && (
                        <Box sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: '16px',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          zIndex: 1
                        }}>
                          <StarIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                          Featured Event
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ p: 4 }}>
                      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                        {selectedEvent.title}
                      </Typography>

                      <Typography variant="body1" sx={{
                        mb: 3,
                        lineHeight: 1.8,
                        fontSize: '1.1rem'
                      }}>
                        {selectedEvent.description || 'No description available.'}
                      </Typography>

                      <Divider sx={{
                        my: 3,
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                        borderWidth: '1px'
                      }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                            Event Details
                          </Typography>

                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(63, 81, 181, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(63, 81, 181, 0.1)',
                              transform: 'translateX(4px)'
                            }
                          }}>
                            <Avatar sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              mr: 2,
                              width: 40,
                              height: 40
                            }}>
                              <CalendarIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Date
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(63, 81, 181, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(63, 81, 181, 0.1)',
                              transform: 'translateX(4px)'
                            }
                          }}>
                            <Avatar sx={{
                              bgcolor: 'secondary.light',
                              color: 'secondary.dark',
                              mr: 2,
                              width: 40,
                              height: 40
                            }}>
                              <TimeIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Time
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {formatTime(selectedEvent.time || selectedEvent.startDate)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(63, 81, 181, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(63, 81, 181, 0.1)',
                              transform: 'translateX(4px)'
                            }
                          }}>
                            <Avatar sx={{
                              bgcolor: 'error.light',
                              color: 'error.dark',
                              mr: 2,
                              width: 40,
                              height: 40
                            }}>
                              <LocationIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Location
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedEvent.location}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(63, 81, 181, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(63, 81, 181, 0.1)',
                              transform: 'translateX(4px)'
                            }
                          }}>
                            <Avatar sx={{
                              bgcolor: 'success.light',
                              color: 'success.dark',
                              mr: 2,
                              width: 40,
                              height: 40
                            }}>
                              <PeopleIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Attendees
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {(selectedEvent.registered || 0).toLocaleString()} registered
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Card elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '16px',
                            p: 3,
                            position: 'sticky',
                            top: 20,
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                          }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              Registration
                            </Typography>

                            <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ mb: 3 }}>
                              {selectedEvent.price > 0 ? `$${selectedEvent.price}` : 'Free'}
                            </Typography>

                            {user ? (
                              <GradientButton
                                fullWidth
                                size="large"
                                sx={{
                                  py: 1.5,
                                  mb: 2,
                                  background: isRegistered(selectedEvent.id)
                                    ? 'linear-gradient(45deg, #4caf50, #81c784)'
                                    : 'linear-gradient(45deg, #3f51b5, #2196f3)'
                                }}
                                onClick={() => handleRegister(selectedEvent.id)}
                                disabled={isRegistered(selectedEvent.id)}
                                startIcon={isRegistered(selectedEvent.id) ? <CheckCircleIcon /> : null}
                              >
                                {isRegistered(selectedEvent.id) ? 'Registered' : 'Register Now'}
                              </GradientButton>
                            ) : (
                              <GradientButton
                                fullWidth
                                size="large"
                                sx={{
                                  py: 1.5,
                                  mb: 2
                                }}
                                href="/login"
                              >
                                Login to Register
                              </GradientButton>
                            )}

                            {registrationError && (
                              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {registrationError}
                              </Typography>
                            )}

                            <Box sx={{
                              mt: 3,
                              p: 2,
                              borderRadius: '12px',
                              background: 'rgba(0, 0, 0, 0.02)'
                            }}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Event Highlights
                              </Typography>
                              <Box component="ul" sx={{
                                pl: 2,
                                '& li': {
                                  mb: 1,
                                  fontSize: '0.9rem'
                                }
                              }}>
                                <li>Networking opportunities</li>
                                <li>Expert speakers</li>
                                <li>Interactive sessions</li>
                                <li>Refreshments provided</li>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </DialogContent>
                </>
              )}
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EventsPage;