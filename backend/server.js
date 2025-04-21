import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import './models/index.js';
import sequelize from "./config/database.js";
import eventRoutes from "./routes/eventRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // Add this line
import organiserRoutes from "./routes/organiserRoutes.js"; // Add this line
import customerRoutes from "./routes/customerRoutes.js";
import { execSync } from "child_process";
import User from "./models/User.js";
import bcrypt from "bcrypt";



// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",  // Your Vite frontend
      "http://localhost:5174",  // Your Vite frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Headers",
      "Access-Control-Allow-Origin"
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

// Static files - Make images accessible from frontend
app.use('/user_uploads', express.static(path.join(__dirname, 'public', 'user_uploads')));

// Terminal clearing functions
const defaultClearTerminal = () => {
  try {
    process.stdout.write("\x1Bc"); // Works in many terminals
    process.platform === "win32" ? execSync("cls") : execSync("clear");
  } catch (error) {
    console.error("❌ Failed to clear terminal:", error.message);
  }
};

const clearTerminal = () => {
  try {
    process.stdout.write("\x1Bc");
    process.platform === "win32" ? execSync("cls") : execSync("clear");
    console.log("✅ Terminal cleared");
    console.log("🗑️  Press CTRL+C to close the server");
  } catch (error) {
    console.error("❌ Failed to clear terminal:", error.message);
  }
};

// Port handling functions
const getPortProcess = (port) => {
  try {
    const result = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = result.split("\n").filter(line => line.includes("LISTENING"));

    if (lines.length > 0) {
      return lines[0].trim().split(/\s+/).pop(); // Extract PID
    }
  } catch (error) {
    return null;
  }
  return null;
};

const killProcess = (pid) => {
  if (!pid || isNaN(pid)) {
    console.log("⚠️ No valid process found to kill.");
    return;
  }

  try {
    execSync(`taskkill /PID ${pid} /F`);
    console.log(`✅ Process ${pid} using port ${PORT} has been killed.`);
  } catch (error) {
    console.error(`❌ Failed to kill process ${pid}:`, error.message);
  }
};

// Check if port is in use before starting the server
const pid = getPortProcess(PORT);
if (pid) {
  console.log(`⚠️ Port ${PORT} is already in use by process ${pid}.`);
  console.log("Attempting to kill the process...");
  killProcess(pid);
}

// Clear terminal before starting the server
defaultClearTerminal();

// Database connection and admin user check
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Sync all models
    await sequelize.sync({ force: false, alter: false });
    console.log("✅ All models synchronized successfully");

    // Check and create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ems.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const adminUser = await User.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        profile_visibility: 'private'
      });
      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('⚠️ Please change this password immediately after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // Add this line
app.use("/api/organiser", organiserRoutes); // Add this line
app.use("/api/customer", customerRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  console.error("Error Details:", err.message);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🗑️  Press CTRL+C to close the server");
});

// Interactive terminal commands
process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (data) => {
  const input = data.toString().trim().toLowerCase();

  if (input === "clear") {
    clearTerminal();
  } else if (input === "exit") {
    console.log("🛑 Shutting down the server...");

    server.close(() => {
      console.log("✅ Server shut down successfully.");
      process.exit(0);
    });

    // Properly exit Nodemon using SIGINT (same as Ctrl + C)
    process.kill(process.pid, "SIGINT");
  }
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server shut down successfully.");
    process.exit(0);
  });
});































// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import sequelize from "./config/database.js";
// import eventRoutes from "./routes/eventRoutes.js";
// import cookieParser from "cookie-parser";
// import authRoutes from "./routes/authRoutes.js";
// import { execSync } from "child_process";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Fix for __dirname in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// // Update your CORS middleware to this:
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",  // Your Vite frontend
//       "http://localhost:5174",  // Your Vite frontend
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "X-Requested-With",
//       "Accept",
//       "Origin",
//       "Access-Control-Allow-Headers",
//       "Access-Control-Request-Headers",
//       "Access-Control-Allow-Origin"
//     ],
//   })
// );

// // Handle preflight requests
// app.options("*", cors());

// // Static files - Make images accessible from frontend
// app.use('/user_uploads', express.static(path.join(__dirname, 'public', 'user_uploads')));

// // Terminal clearing functions
// const defaultclearTerminal = () => {
//   try {
//     process.stdout.write("\x1Bc"); // Works in many terminals
//     process.platform === "win32" ? execSync("cls") : execSync("clear");
//   } catch (error) {
//     console.error("❌ Failed to clear terminal:", error.message);
//   }
// };

// const clearTerminal = () => {
//   try {
//     process.stdout.write("\x1Bc");
//     process.platform === "win32" ? execSync("cls") : execSync("clear");
//     console.log("✅ Terminal cleared");
//     console.log("🗑️  Press CTRL+C to close the server");
//   } catch (error) {
//     console.error("❌ Failed to clear terminal:", error.message);
//   }
// };

// // Port handling functions
// const getPortProcess = (port) => {
//   try {
//     const result = execSync(`netstat -ano | findstr :${port}`).toString();
//     const lines = result.split("\n").filter(line => line.includes("LISTENING"));

//     if (lines.length > 0) {
//       return lines[0].trim().split(/\s+/).pop(); // Extract PID
//     }
//   } catch (error) {
//     return null;
//   }
//   return null;
// };

// const killProcess = (pid) => {
//   if (!pid || isNaN(pid)) {
//     console.log("⚠️ No valid process found to kill.");
//     return;
//   }

//   try {
//     execSync(`taskkill /PID ${pid} /F`);
//     console.log(`✅ Process ${pid} using port ${PORT} has been killed.`);
//   } catch (error) {
//     console.error(`❌ Failed to kill process ${pid}:`, error.message);
//   }
// };

// // Check if port is in use before starting the server
// const pid = getPortProcess(PORT);
// if (pid) {
//   console.log(`⚠️ Port ${PORT} is already in use by process ${pid}.`);
//   console.log("Attempting to kill the process...");
//   killProcess(pid);
// }

// // Clear terminal before starting the server
// defaultclearTerminal();

// // Database connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Database connection established");
//     await sequelize.sync({ force: false, alter: false });
//     console.log("✅ All models synchronized successfully");
//   } catch (error) {
//     console.error("❌ Database connection failed:", error);
//     process.exit(1);
//   }
// })();

// // Routes
// app.use("/api/events", eventRoutes);
// app.use("/api/auth", authRoutes);

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// // Error Handler
// app.use((err, req, res, next) => {
//   console.error("Error Stack:", err.stack);
//   console.error("Error Details:", err.message);
//   res.status(500).json({
//     message: "Something went wrong!",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log("🗑️  Press CTRL+C to close the server");
// });

// // Interactive terminal commands
// process.stdin.resume();
// process.stdin.setEncoding("utf8");

// process.stdin.on("data", (data) => {
//   const input = data.toString().trim().toLowerCase();

//   if (input === "clear") {
//     clearTerminal();
//   } else if (input === "exit") {
//     console.log("🛑 Shutting down the server...");

//     server.close(() => {
//       console.log("✅ Server shut down successfully.");
//       process.exit(0);
//     });

//     // Properly exit Nodemon using SIGINT (same as Ctrl + C)
//     process.kill(process.pid, "SIGINT");
//   }
// });

// // Graceful shutdown
// process.on("SIGINT", () => {
//   console.log("\n🛑 Server shutting down...");
//   server.close(() => {
//     console.log("✅ Server shut down successfully.");
//     process.exit(0);
//   });
// });