const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Application = require("../models/Application");

const router = express.Router();

// Setup file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/screenshots";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|gif|webp/;
    const ext = types.test(path.extname(file.originalname).toLowerCase());
    const mime = types.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

// Create application
router.post("/", auth, upload.array("screenshots", 5), async (req, res) => {
  try {
    const { company, position, url, status, notes, appliedDate } = req.body;

    const screenshots = req.files ? req.files.map((file) => file.path) : [];

    const application = new Application({
      user: req.userId,
      company,
      position,
      url,
      status,
      notes,
      screenshots,
      appliedDate,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all applications for user
router.get("/", auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single application
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update application
router.put("/:id", auth, upload.array("screenshots", 5), async (req, res) => {
  try {
    const { company, position, url, status, notes, appliedDate } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.company = company || application.company;
    application.position = position || application.position;
    application.url = url || application.url;
    application.status = status || application.status;
    application.notes = notes || application.notes;
    application.appliedDate = appliedDate || application.appliedDate;

    if (req.files && req.files.length > 0) {
      const newScreenshots = req.files.map((file) => file.path);
      application.screenshots.push(...newScreenshots);
    }

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete application
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Delete screenshot files
    application.screenshots.forEach((filepath) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
