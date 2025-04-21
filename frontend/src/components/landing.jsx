import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  EventAvailable as EventIcon,
  Analytics as AnalyticsIcon,
  ConfirmationNumber as TicketIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const LandingPage = () => {
  // Common card style consistent with dashboard
  const cardStyle = {
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
    },
  };

  // Feature data
  const features = [
    {
      icon: <EventIcon color="primary" fontSize="large" />,
      title: "Event Creation",
      description: "Easily create and customize events of any size",
    },
    {
      icon: <TicketIcon color="primary" fontSize="large" />,
      title: "Ticket Management",
      description: "Streamline ticket sales and attendee registration",
    },
    {
      icon: <AnalyticsIcon color="primary" fontSize="large" />,
      title: "Advanced Analytics",
      description: "Gain insights with comprehensive reporting tools",
    },
    {
      icon: <DashboardIcon color="primary" fontSize="large" />,
      title: "Intuitive Dashboard",
      description: "Monitor all your events from a central location",
    },
  ];

  // Sample events data (consistent with dashboard)
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      category: "Technology",
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "July 1-3, 2024",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      category: "Entertainment",
    },
    {
      id: 3,
      title: "Modern Art Exhibition",
      date: "April 5, 2024",
      image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      category: "Arts",
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      title: "Basic",
      price: "$29",
      period: "/month",
      features: [
        "Up to 5 events",
        "Basic analytics",
        "Ticket management",
        "Email support",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      title: "Professional",
      price: "$79",
      period: "/month",
      features: [
        "Up to 20 events",
        "Advanced analytics",
        "Custom ticketing",
        "Priority support",
        "Marketing tools",
      ],
      buttonText: "Try Professional",
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: "$199",
      period: "/month",
      features: [
        "Unlimited events",
        "Real-time analytics",
        "White-label solution",
        "24/7 support",
        "API access",
        "Custom integrations",
      ],
      buttonText: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <Box sx={{ 
      overflow: "hidden", 
      minHeight: "100vh", 
      width: "100vw", 
      margin: 0, 
      padding: 0, 
      boxSizing: "border-box" 
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#f4f9ff",
          py: { xs: 6, md: 12 },
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                Simplify Your Event Management
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: "normal" }}
              >
                Create, manage, and track events with our intuitive platform.
                From registration to analytics, we've got you covered.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to="/signup"
                  sx={{
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "medium",
                    boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={Link}
                  to="/signin"
                  sx={{
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "medium",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
            <Box
                component="img"
                src="https://plus.unsplash.com/premium_photo-1661414423895-5854eb6b573a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Test image
                alt="Event Management Dashboard"
                sx={{
                width: "100%",
                borderRadius: 4,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                transform: "perspective(1500px) rotateY(-10deg) rotateX(5deg)",
                }}
            />
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth={false} sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Everything you need to manage events efficiently in one platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  ...cardStyle,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(25, 118, 210, 0.1)",
                      borderRadius: "50%",
                      width: 70,
                      height: 70,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Showcase Events Section */}
      <Box sx={{ bgcolor: "#f9fafb", py: { xs: 6, md: 10 }, width: "100%" }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h3" component="h2" fontWeight="bold">
              Upcoming Events
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              component={Link}
              to="/signin"
              sx={{
                borderRadius: 28,
                px: 3,
                py: 1,
                fontWeight: "medium",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              View All Events
            </Button>
          </Box>

          <Grid container spacing={3}>
            {upcomingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  sx={{
                    ...cardStyle,
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image}
                    alt={event.title}
                    sx={{
                      transition: "transform 0.5s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        fontWeight="bold"
                      >
                        {event.title}
                      </Typography>
                      <Paper
                        sx={{
                          bgcolor: "rgba(25, 118, 210, 0.1)",
                          color: "primary.main",
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 8,
                          fontSize: "0.75rem",
                          fontWeight: "medium",
                        }}
                      >
                        {event.category}
                      </Paper>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <EventNoteIcon fontSize="small" />
                      {event.date}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                      display: "flex",
                      justifyContent: "flex-end",
                      bgcolor: "rgba(0, 0, 0, 0.01)",
                    }}
                  >
                    <Button
                      color="primary"
                      component={Link}
                      to={`/event/${event.id}`}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        fontWeight: "medium",
                        borderRadius: 8,
                        "&:hover": {
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth={false} sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Simple Pricing
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Choose the plan that fits your event management needs
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  ...cardStyle,
                  height: "100%",
                  minHeight: "600px", // Added minimum height to ensure all cards have same height
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  position: "relative",
                  ...(plan.highlighted && {
                    border: "2px solid #1976d2",
                    boxShadow: "0 8px 32px rgba(25, 118, 210, 0.15)",
                  }),
                }}
              >
                {plan.highlighted && (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: 15,
                      right: 30,
                      bgcolor: "primary.main",
                      color: "white",
                      py: 0.5,
                      px: 2,
                      borderRadius: 8,
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
                    }}
                  >
                    Most Popular
                  </Paper>
                )}
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  {plan.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
                  <Typography variant="h3" fontWeight="bold">
                    {plan.price}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 0.8, ml: 0.5 }}
                  >
                    {plan.period}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List 
                  sx={{ 
                    flexGrow: 1, 
                    mb: 3,
                    minHeight: "250px", // Added minimum height for the feature list
                  }}
                >
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant={plan.highlighted ? "contained" : "outlined"}
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: 28,
                    py: 1.5,
                    fontWeight: "medium",
                    mt: "auto", // Push button to bottom of card
                    ...(plan.highlighted
                      ? {
                          boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                          "&:hover": {
                            boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                          },
                        }
                      : {
                          borderWidth: 2,
                          "&:hover": {
                            borderWidth: 2,
                          },
                        }),
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          py: { xs: 6, md: 8 },
          textAlign: "center",
          width: "100%"
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Ready to Streamline Your Events?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of event organizers who trust our platform
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/signup"
            sx={{
              borderRadius: 28,
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "medium",
              bgcolor: "white",
              color: "#1976d2",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#f9fafb",
          py: 5,
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          width: "100%"
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Event Management System
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 300, mb: 2 }}
              >
                The all-in-one platform for creating and managing successful
                events of any size.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {/* Social media icons could go here */}
                <IconButton
                  sx={{
                    bgcolor: "#f4f9ff",
                    "&:hover": { bgcolor: "#e6f2ff" },
                  }}
                >
                  <PersonIcon />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: "#f4f9ff",
                    "&:hover": { bgcolor: "#e6f2ff" },
                  }}
                >
                  <EventIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Features
              </Typography>
              <List disablePadding>
                {["Dashboard", "Events", "Tickets", "Reports"].map(
                  (item, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{ pb: 1, pl: 0 }}
                    >
                      <Link
                        to={`/${item.toLowerCase()}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {item}
                        </Typography>
                      </Link>
                    </ListItem>
                  )
                )}
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Company
              </Typography>
              <List disablePadding>
                {["About", "Careers", "Blog", "Contact"].map((item, index) => (
                  <ListItem key={index} disablePadding sx={{ pb: 1, pl: 0 }}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {item}
                      </Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Resources
              </Typography>
              <List disablePadding>
                {["Help", "Documentation", "Pricing", "FAQ"].map(
                  (item, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{ pb: 1, pl: 0 }}
                    >
                      <Link
                        to={`/${item.toLowerCase()}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {item}
                        </Typography>
                      </Link>
                    </ListItem>
                  )
                )}
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Legal
              </Typography>
              <List disablePadding>
                {["Terms", "Privacy", "Cookies", "Licenses"].map(
                  (item, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{ pb: 1, pl: 0 }}
                    >
                      <Link
                        to={`/${item.toLowerCase()}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {item}
                        </Typography>
                      </Link>
                    </ListItem>
                  )
                )}
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Event Management System. All rights
              reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                component={Link}
                to="/terms"
                sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Terms of Service
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component={Link}
                to="/privacy"
                sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                Privacy Policy
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;