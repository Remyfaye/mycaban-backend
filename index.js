const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Allow CORS for all methods
app.use(
  cors({
    origin: "http://localhost:8080", // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Include PUT & DELETE
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If using cookies or authentication
  })
);

// Upload files
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = `http://localhost:8800/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});
// ✅ Serve uploaded files with CORS-friendly headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

//Routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const propertiesRoute = require("./routes/properties");

dotenv.config();

// Mongodb connection
const MONGODB_URI = process.env.MONGO_URI;
const connectToDb = async () => {
  if (!MONGODB_URI) throw new Error("MONGODB_URL is missing");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectToDb();

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/properties", propertiesRoute);

app.get("/", (req, res) => {
  res.send("welcome to myCaban");
});

app.listen(8800, () => {
  console.log("Server running on port 8800");
});
