const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON & URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Ensure database file exists
const DB_FILE = path.join(__dirname, "database.json");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ listings: [] }));

// API: POST a new listing
app.post("/api/listings", upload.array("images"), (req, res) => {
  try {
    const { year, make, model, part, price, street, city, county, state, description } = req.body;
    const images = req.files.map(f => `/uploads/${f.filename}`);

    const newListing = {
      id: Date.now(),
      year, make, model, part, price, street, city, county, state, description,
      images,
      createdAt: new Date()
    };

    const db = JSON.parse(fs.readFileSync(DB_FILE));
    db.listings.push(newListing);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    res.json({ success: true, listing: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: GET all listings
app.get("/api/listings", (req, res) => {
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(db.listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

