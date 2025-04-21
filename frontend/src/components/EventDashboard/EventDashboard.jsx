import { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import UpcomingEvents from "./UpcomingEvents";
import AnalyticsChart from "./AnalyticsChart";

const EventDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/organiser/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
      } catch {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const cardStyle = {
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
    },
  };

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
        bgcolor: "#f9fafb",
      }}
    >
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            transition: "all 0.25s ease-in-out",
            ml: 0,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
            Dashboard
          </Typography>

          <SummaryCards
            cardStyle={cardStyle}
            totalEvents={dashboardData.totalEvents}
            totalRegistrations={dashboardData.totalRegistrations}
            totalRevenue={dashboardData.totalRevenue}
          />

          <UpcomingEvents
            cardStyle={cardStyle}
            events={dashboardData.upcomingEvents}
          />

          <AnalyticsChart
            cardStyle={cardStyle}
            timeRange={timeRange}
            handleTimeRangeChange={handleTimeRangeChange}
            chartData={dashboardData.chartData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EventDashboard;


















// // components/EventDashboard/EventDashboard.jsx
// import { useState } from "react";
// import { Box, Container, Typography } from "@mui/material";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import SummaryCards from "./SummaryCards";
// import UpcomingEvents from "./UpcomingEvents";
// import AnalyticsChart from "./AnalyticsChart";

// const EventDashboard = () => {
//   const [timeRange, setTimeRange] = useState("7");
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const handleTimeRangeChange = (event) => {
//     setTimeRange(event.target.value);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Sample data for the chart
//   const chartData = [
//     { name: "Mon", registrations: 120, revenue: 150 },
//     { name: "Tue", registrations: 130, revenue: 200 },
//     { name: "Wed", registrations: 100, revenue: 130 },
//     { name: "Thu", registrations: 130, revenue: 160 },
//     { name: "Fri", registrations: 90, revenue: 110 },
//     { name: "Sat", registrations: 220, revenue: 240 },
//   ];

//   // Sample events data
//   const upcomingEvents = [
//     {
//       id: 1,
//       title: "Tech Innovation Summit 2024",
//       date: "March 15, 2024",
//       time: "9:00 AM",
//       registered: 200,
//       image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
//     },
//     {
//       id: 2,
//       title: "Summer Music Festival",
//       date: "July 1-3, 2024",
//       time: "All Day",
//       registered: 1500,
//       image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
//     },
//     {
//       id: 3,
//       title: "Modern Art Exhibition",
//       date: "April 5, 2024",
//       time: "6:00 PM",
//       registered: 150,
//       image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
//     },
//   ];

//   // Common card style for consistent visual enhancement
//   const cardStyle = {
//     borderRadius: 16,
//     boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
//     transition: "transform 0.2s, box-shadow 0.2s",
//     "&:hover": {
//       transform: "translateY(-4px)",
//       boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
//     },
//   };

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
//             Dashboard
//           </Typography>

//           <SummaryCards cardStyle={cardStyle} />
//           <UpcomingEvents cardStyle={cardStyle} events={upcomingEvents} />
//           <AnalyticsChart
//             cardStyle={cardStyle}
//             timeRange={timeRange}
//             handleTimeRangeChange={handleTimeRangeChange}
//             chartData={chartData}
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default EventDashboard;