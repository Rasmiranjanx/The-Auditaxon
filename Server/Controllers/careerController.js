const JobApplication = require("../models/JobApplication");

// @route  POST /api/careers/apply
// @access Public
const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNo,
      gender,
      positionAppliedFor,
      dateOfBirth,
      highestQualification,
      portfolioWebsite,
      lastCompany,
      experienceYears,
      experienceMonths,
      referenceComments,
    } = req.body;

    // req.file comes from the upload middleware (added when we build the route)
    if (!req.file) {
      return res.status(400).json({ message: "Resume upload is required" });
    }

    const application = await JobApplication.create({
      firstName,
      lastName,
      email,
      mobileNo,
      gender,
      resumeUrl: req.file.path || req.file.filename,
      positionAppliedFor,
      dateOfBirth,
      highestQualification,
      portfolioWebsite,
      lastCompany,
      experienceYears,
      experienceMonths,
      referenceComments,
    });

    res.status(201).json({ message: "Application submitted successfully", id: application._id });
  } catch (error) {
    res.status(400).json({ message: "Failed to submit application", error: error.message });
  }
};

// @route  GET /api/careers/applications
// @access Private (admin)
const getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      JobApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      JobApplication.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/careers/applications/:id
// @access Private (admin)
const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/careers/applications/:id/status
// @access Private (admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["received", "shortlisted", "rejected", "hired"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
};