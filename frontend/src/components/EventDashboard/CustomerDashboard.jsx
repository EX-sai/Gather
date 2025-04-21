import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  CircularProgress,
  alpha,
  IconButton,
  Divider,
  Avatar,
  Container,
} from "@mui/material";
import Sidebar from "../EventDashboard/CustSidebar";
import Header from "../EventDashboard/Header";
import {
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  LocalActivity as TicketIcon,
  AccountBalanceWallet as WalletIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  FilterList as FilterIcon,
  Share as ShareIcon,
  FavoriteBorder as FavoriteIcon,
} from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    personalStats: [],
    myTickets: [],
    recommendedEvents: [],
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchCustomerDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/customer/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDashboard();
  }, []);

  const statCardStyle = {
    borderRadius: 12,
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
    color: "#111827",
    position: "relative",
    overflow: "hidden",
    p: 2,
    height: "100%",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  };

  const ticketCardStyle = {
    borderRadius: 12,
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
    color: "#111827",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  };

  const eventCardStyle = {
    borderRadius: 12,
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
    color: "#111827",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: "100%",
  };

  const searchBoxStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    p: 1,
    mb: 4,
    border: "1px solid rgba(0, 0, 0, 0.1)",
  };

  const iconMap = {
    "My Events": {
      icon: <CalendarIcon fontSize="large" />,
      color: "#06b6d4",
      bgGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 100%)",
    },
    "Tickets Purchased": {
      icon: <TicketIcon fontSize="large" />,
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 100%)",
    },
    "Total Spent": {
      icon: <WalletIcon fontSize="large" />,
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0) 100%)",
    },
    "Friends Invited": {
      icon: <PeopleIcon fontSize="large" />,
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 100%)",
    },
  };

  if (error) {
    return (
      <Box sx={{ p: 4, color: "text.primary", background: "#f9fafb", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#f9fafb",
        color: "text.primary",
      }}
    >
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", position: "relative" }}>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {loading && (
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
        )}

        <MotionBox
          component="main"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            overflow: "auto",
            transition: "all 0.25s ease-in-out",
            ml: 0,
            backgroundColor: "#f9fafb",
          }}
        >
          <Container maxWidth="xl" sx={{ mb: 4 }}>
            {/* Personal Stats Cards */}
            <MotionBox
              variants={slideUp}
              sx={{ mb: 5 }}
            >
              <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                  Your Activity
                </Typography>
              </Box>

              <MotionGrid
                container
                spacing={3}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {dashboardData.personalStats.map((stat, index) => {
                  const iconData = iconMap[stat.title] || {};
                  return (
                    <MotionGrid item xs={6} sm={3} key={index} variants={fadeIn}>
                      <MotionCard
                        sx={statCardStyle}
                        whileHover={{
                          y: -5,
                          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Box sx={{
                          background: iconData.bgGradient,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 0,
                        }} />

                        <CardContent sx={{ position: "relative", zIndex: 1, p: 2 }}>
                          <Box sx={{ mb: 1.5 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                backgroundColor: alpha(iconData.color, 0.1),
                                color: iconData.color,
                                mb: 2,
                              }}
                            >
                              {iconData.icon}
                            </Box>
                          </Box>
                          <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {stat.title}
                          </Typography>
                        </CardContent>
                      </MotionCard>
                    </MotionGrid>
                  );
                })}
              </MotionGrid>
            </MotionBox>

            {/* My Tickets */}
            <MotionBox
              variants={slideUp}
              sx={{ mb: 5 }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                  My Tickets
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="text" 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: "#8b5cf6" }}
                  >
                    View All
                  </Button>
                </motion.div>
              </Box>
              
              <MotionGrid 
                container 
                spacing={3}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {dashboardData.myTickets.map((ticket) => (
                  <MotionGrid item xs={12} md={6} key={ticket.id} variants={fadeIn}>
                    <MotionCard 
                      sx={ticketCardStyle}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                        <CardMedia
                          component="img"
                          sx={{ 
                            width: { xs: "100%", sm: 140 }, 
                            height: { xs: 140, sm: "auto" },
                            borderRadius: { xs: "12px 12px 0 0", sm: "12px 0 0 12px" },
                          }}
                          image={ticket.image}
                          alt={ticket.title}
                        />
                        <CardContent sx={{ p: 3, flex: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                              {ticket.title}
                            </Typography>
                            <Chip
                              label={ticket.ticketType}
                              size="small"
                              sx={{
                                bgcolor: "#8b5cf6",
                                color: "white",
                                fontWeight: 500,
                                borderRadius: "6px",
                              }}
                            />
                          </Box>
                            
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <TimeIcon fontSize="small" sx={{ mr: 1, color: "#8b5cf6" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {ticket.date} • {ticket.time}
                            </Typography>
                          </Box>
                            
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <LocationIcon fontSize="small" sx={{ mr: 1, color: "#8b5cf6" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {ticket.location}
                            </Typography>
                          </Box>
                            
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              sx={{ 
                                borderRadius: "8px", 
                                borderColor: "rgba(139, 92, 246, 0.5)",
                                color: "#8b5cf6",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": {
                                  backgroundColor: alpha("#8b5cf6", 0.05),
                                  borderColor: "#8b5cf6",
                                }
                              }}
                            >
                              View Ticket
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Box>
                    </MotionCard>
                  </MotionGrid>
                ))}
              </MotionGrid>
            </MotionBox>

            {/* Recommended Events
            <MotionBox variants={slideUp}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                  Recommended For You
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="text" 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: "#8b5cf6" }}
                  >
                    Browse All
                  </Button>
                </motion.div>
              </Box>
              
              <MotionGrid 
                container 
                spacing={3}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {dashboardData.recommendedEvents.map((event) => (
                  <MotionGrid item xs={12} sm={6} md={4} key={event.id} variants={fadeIn}>
                    <MotionCard 
                      sx={eventCardStyle}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          sx={{ height: 200, width: "100%", objectFit: "cover" }}
                          image={event.image}
                          alt={event.title}
                        />
                        <Box 
                          sx={{ 
                            position: "absolute", 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)" 
                          }} 
                        />
                        <Box sx={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 1 }}>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton sx={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#ffffff" }}>
                              <FavoriteIcon fontSize="small" />
                            </IconButton>
                          </motion.div>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {event.title}
                        </Typography>
                        
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <TimeIcon fontSize="small" sx={{ mr: 1, color: "#8b5cf6" }} />
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {event.date} • {event.time}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1, color: "#8b5cf6" }} />
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {event.location}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 2 }} />
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#8b5cf6" }}>
                            {event.price}
                          </Typography>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="contained" 
                              size="small"
                              sx={{ 
                                borderRadius: "8px", 
                                background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                              }}
                            >
                              Get Tickets
                            </Button>
                          </motion.div>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </MotionGrid>
                ))}
              </MotionGrid>
            </MotionBox> */}


            {/* Recommended Events */}
            <MotionBox variants={slideUp}>
              {/* Header row */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                  Recommended For You
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: "#8b5cf6" }}
                  >
                    Browse All
                  </Button>
                </motion.div>
              </Box>

              <MotionGrid
                container
                spacing={3}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {dashboardData.recommendedEvents.length > 0
                  ? dashboardData.recommendedEvents.map((event) => (
                    <MotionGrid item xs={12} sm={6} md={4} key={event.id} variants={fadeIn}>
                      <MotionCard
                        sx={eventCardStyle}
                        whileHover={{
                          y: -5,
                          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                          transition: { duration: 0.3 }
                        }}
                      >
                        {/* Image + overlay + favorite button */}
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            sx={{ height: 200, width: "100%", objectFit: "cover" }}
                            image={event.image}
                            alt={event.title}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0, left: 0, right: 0, bottom: 0,
                              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)"
                            }}
                          />
                          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton sx={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#fff" }}>
                                <FavoriteIcon fontSize="small" />
                              </IconButton>
                            </motion.div>
                          </Box>
                        </Box>

                        {/* Content */}
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {event.title}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: "#8b5cf6" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {new Date(event.date).toLocaleDateString()} • {event.time}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "#8b5cf6" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {event.location}
                            </Typography>
                          </Box>

                          <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 2 }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#8b5cf6" }}>
                              {event.price}
                            </Typography>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
                                  textTransform: "none",
                                  fontWeight: 600,
                                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                                }}
                              >
                                Get Tickets
                              </Button>
                            </motion.div>
                          </Box>
                        </CardContent>
                      </MotionCard>
                    </MotionGrid>
                  ))
                  : (
                    <Grid item xs={12}>
                      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                        No new recommendations at this time.
                      </Typography>
                    </Grid>
                  )
                }
              </MotionGrid>
            </MotionBox>

          </Container>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;

































// import { useState, useEffect } from "react";
// import { Box, Typography, Button, Card, CardContent, CardMedia, Grid, Chip, CircularProgress } from "@mui/material";
// import Sidebar from "../EventDashboard/CustSidebar";
// import Header from "../EventDashboard/Header";
// import {
//   CalendarToday as CalendarIcon,
//   People as PeopleIcon,
//   Theaters as TheatersIcon,
//   AttachMoney as MoneyIcon,
// } from "@mui/icons-material";
// import axios from "axios";

// const CustomerDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dashboardData, setDashboardData] = useState({
//     personalStats: [],
//     myTickets: [],
//     recommendedEvents: [],
//   });

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   useEffect(() => {
//     const fetchCustomerDashboard = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:3000/api/customer/dashboard", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDashboardData(response.data);
//       } catch {
//         setError("Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomerDashboard();
//   }, []);

//   const cardStyle = {
//     borderRadius: 16,
//     boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
//     transition: "transform 0.2s, box-shadow 0.2s",
//     "&:hover": {
//       transform: "translateY(-4px)",
//       boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
//     },
//   };

//   const iconMap = {
//     "My Events": { icon: <CalendarIcon />, color: "#e3f2fd", iconColor: "#1976d2" },
//     "Tickets Purchased": { icon: <TheatersIcon />, color: "#e8f5e9", iconColor: "#388e3c" },
//     "Total Spent": { icon: <MoneyIcon />, color: "#ffebee", iconColor: "#d32f2f" },
//     "Friends Invited": { icon: <PeopleIcon />, color: "#fff8e1", iconColor: "#ffa000" },
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         width: "100vw",
//         overflow: "hidden",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         bgcolor: "#f9fafb",
//       }}
//     >
//       <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//       <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
//         <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: 3,
//             overflow: "auto",
//             transition: "all 0.25s ease-in-out",
//             ml: 0,
//           }}
//         >
//           <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
//             My Dashboard
//           </Typography>

//           {/* Personal Stats Cards */}
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             {dashboardData.personalStats.map((stat, index) => {
//               const iconData = iconMap[stat.title] || {};
//               return (
//                 <Grid item xs={12} sm={6} md={3} key={index}>
//                   <Card sx={{ ...cardStyle }}>
//                     <CardContent sx={{ p: 3 }}>
//                       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary" gutterBottom>
//                             {stat.title}
//                           </Typography>
//                           <Typography variant="h4" component="div" fontWeight="bold">
//                             {stat.value}
//                           </Typography>
//                         </Box>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             bgcolor: iconData.color,
//                             borderRadius: "50%",
//                             width: 48,
//                             height: 48,
//                             color: iconData.iconColor,
//                           }}
//                         >
//                           {iconData.icon}
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>

//           {/* My Tickets */}
//           <Box sx={{ mb: 4 }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography variant="h6" fontWeight="bold">
//                 My Tickets
//               </Typography>
//               <Button variant="outlined" size="small">
//                 View All
//               </Button>
//             </Box>
//             <Grid container spacing={3}>
//               {dashboardData.myTickets.map((ticket) => (
//                 <Grid item xs={12} md={6} key={ticket.id}>
//                   <Card sx={{ ...cardStyle, display: "flex", flexDirection: { xs: "column", sm: "row" }, height: "100%" }}>
//                     <CardMedia
//                       component="img"
//                       sx={{ width: { xs: "100%", sm: 140 }, height: { xs: 140, sm: "auto" } }}
//                       image={ticket.image}
//                       alt={ticket.title}
//                     />
//                     <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
//                       <Typography variant="h6" fontWeight="bold">
//                         {ticket.title}
//                       </Typography>
//                       <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 1 }}>
//                         <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
//                         <Typography variant="body2" color="text.secondary">
//                           {ticket.date} • {ticket.time}
//                         </Typography>
//                       </Box>
//                       <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                         {ticket.location}
//                       </Typography>
//                       <Chip
//                         label={ticket.ticketType}
//                         size="small"
//                         sx={{
//                           bgcolor: "primary.main",
//                           color: "white",
//                           fontWeight: "medium",
//                         }}
//                       />
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>

//           {/* Recommended Events */}
//           <Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography variant="h6" fontWeight="bold">
//                 Recommended For You
//               </Typography>
//               <Button variant="outlined" size="small">
//                 Browse All
//               </Button>
//             </Box>
//             <Grid container spacing={3}>
//               {dashboardData.recommendedEvents.map((event) => (
//                 <Grid item xs={12} sm={6} md={4} key={event.id}>
//                   <Card sx={{ ...cardStyle, display: "flex", flexDirection: "column", height: "100%" }}>
//                     <CardMedia
//                       component="img"
//                       sx={{ height: 200, width: "100%", objectFit: "cover" }}
//                       image={event.image}
//                       alt={event.title}
//                     />
//                     <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
//                       <Box sx={{ flexGrow: 1 }}>
//                         <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
//                           {event.title}
//                         </Typography>
//                         <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                           <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
//                           <Typography variant="body2" color="text.secondary">
//                             {event.date} • {event.time}
//                           </Typography>
//                         </Box>
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                           {event.location}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <Typography variant="subtitle1" fontWeight="bold" color="primary">
//                           {event.price}
//                         </Typography>
//                         <Button variant="contained" size="small">
//                           Get Tickets
//                         </Button>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CustomerDashboard;
