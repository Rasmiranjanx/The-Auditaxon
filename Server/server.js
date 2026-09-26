require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const careerRoutes = require("./routes/careerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("The Audit Axon backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));