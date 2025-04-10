const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cors = require("cors");

dotenv.config(); // ✅ Must come BEFORE using process.env

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://estate-explorer-ivory.vercel.app",
      "https://mycaban-backend.onrender.com",
      "https://mycaban.com.ng",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer for temporary file upload
const upload = multer({ dest: "temp/" });

// ✅ Cloudinary image upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "mycaban", // optional folder name
    });

    fs.unlinkSync(filePath); // delete temp file after upload

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: `Upload failed:${err}` });
  }
});

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI;
const connectToDb = async () => {
  try {
    if (!MONGODB_URI) throw new Error("MONGO_URI is missing in .env");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectToDb();

// ✅ Routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const propertiesRoute = require("./routes/properties");

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/properties", propertiesRoute);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Welcome to myCaban");
});

// ✅ Server listen
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
