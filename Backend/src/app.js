const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const userRoutes=require("./routes/user.route.js")
const collegeRoutes=require("./routes/college.routes.js")
const forumPostRoutes=require("./routes/forum_Post.routes.js")
const appointmentRoutes=require("./routes/appointment.route.js")
const resourceRoutes=require("./routes/resource.routes.js")
const analyticsRoutes=require("./routes/analytic.route.js")
const resourceAccessRoutes=require("./routes/resourceAccess.routes.js")
const screeningResultRoutes=require('./routes/screening_Results.routes.js')
const AIChatHistoryRoutes=require("./routes/ai_Chat_History.routes.js")
const forumModerationRoutes=require("./routes/forum_ModerationLog.routes.js")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/users",userRoutes)
app.use('/api/v1/colleges',collegeRoutes)
app.use('/api/v1/forum',forumPostRoutes)
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/resource-access', resourceAccessRoutes);
app.use('/api/v1/screening', screeningResultRoutes)
app.use('/api/v1/AI-chat-history',AIChatHistoryRoutes)
app.use('/api/v1/forum-moderation',forumModerationRoutes)

module.exports = app;