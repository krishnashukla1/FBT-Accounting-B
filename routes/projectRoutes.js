
import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 🔐 Protect all project routes
router.use(protect);

// ===============================
// 📌 GET all projects
// ===============================
// router.get("/", async (req, res) => {
//   try {
//     const projects = await Project.find({ user: req.user.id }).sort({
//       createdAt: -1,
//     });

//     res.json({ success: true, projects });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
//====================only admin can access data===========

router.get("/", async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find().sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ user: req.user.id }).sort({
        createdAt: -1,
      });
    }

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ==================any body cann access===========
// router.get("/", async (req, res) => {
//   try {
//     const projects = await Project.find().sort({ createdAt: -1 });

//     res.json({ success: true, projects });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// LET GUESTS SEE ALL PROJECTS (READ-ONLY)
router.get("/guest", protect, async (req, res) => {
  try {
    const projects = await Project.find().select("name description createdAt");
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// ===============================
// 📌 CREATE project
// ===============================
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name required",
      });
    }

    const project = await Project.create({
      name,
      description: description || "",
      user: req.user.id,
    });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===============================
// 📌 GET a single project
// ===============================
// router.get("/:id", async (req, res) => {
//   try {
//     const project = await Project.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!project) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Project not found" });
//     }

//     res.json({ success: true, project });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


router.get("/:id", async (req, res) => {
  try {
    // TEMP: Allow any project (remove user filter)
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ===============================
// 📌 UPDATE project
// ===============================
// router.put("/:id", async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     const project = await Project.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { name, description },
//       { new: true }
//     );

//     if (!project) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Project not found" });
//     }

//     res.json({ success: true, project });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role === "guest") {
      query.user = req.user.id;
    }

    const project = await Project.findOneAndUpdate(
      query,
      { name: req.body.name, description: req.body.description },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ===============================
// 📌 DELETE project
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
