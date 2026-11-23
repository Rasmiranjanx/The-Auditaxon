const JobApplication = require('../models/JobApplication')
const { notifyAdmin } = require('../utils/sendEmail')
const { serverError, getPagination, asString } = require('../utils/http')

const STATUSES = ['received', 'shortlisted', 'rejected', 'hired']

// @route  POST /api/careers/apply
// @access Public (rate limited; multipart with a "resume" file)
const submitApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume upload is required' })
    }

    const b = req.body
    const application = await JobApplication.create({
      firstName: asString(b.firstName),
      lastName: asString(b.lastName),
      email: asString(b.email),
      mobileNo: asString(b.mobileNo),
      gender: asString(b.gender),
      resumeUrl: req.file.path || req.file.filename,
      positionAppliedFor: asString(b.positionAppliedFor),
      dateOfBirth: asString(b.dateOfBirth) || undefined,
      highestQualification: asString(b.highestQualification),
      portfolioWebsite: asString(b.portfolioWebsite),
      lastCompany: asString(b.lastCompany),
      experienceYears: asString(b.experienceYears) || undefined,
      experienceMonths: asString(b.experienceMonths) || undefined,
      referenceComments: asString(b.referenceComments),
    })

    notifyAdmin(
      `New job application: ${application.firstName} ${application.lastName}`,
      {
        Name: `${application.firstName} ${application.lastName}`,
        Email: application.email,
        Mobile: application.mobileNo,
        Position: application.positionAppliedFor,
        Qualification: application.highestQualification,
        Experience: `${application.experienceYears || 0}y ${application.experienceMonths || 0}m`,
        'Last company': application.lastCompany,
        Resume: application.resumeUrl,
        Comments: application.referenceComments,
      },
      application.email
    )

    res.status(201).json({ message: 'Application submitted successfully', id: application._id })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Failed to submit application', error: error.message })
    }
    serverError(res, error)
  }
}

// @route  GET /api/careers/applications
// @access Private (admin)
const getApplications = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}
    const status = asString(req.query.status)
    if (STATUSES.includes(status)) filter.status = status

    const [items, total] = await Promise.all([
      JobApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      JobApplication.countDocuments(filter),
    ])

    res.json({ items, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    serverError(res, error)
  }
}

// @route  GET /api/careers/applications/:id
// @access Private (admin)
const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
    if (!application) return res.status(404).json({ message: 'Application not found' })
    res.json(application)
  } catch (error) {
    serverError(res, error)
  }
}

// @route  PUT /api/careers/applications/:id/status
// @access Private (admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const status = asString(req.body.status)
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(', ')}` })
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    )
    if (!application) return res.status(404).json({ message: 'Application not found' })
    res.json(application)
  } catch (error) {
    serverError(res, error)
  }
}

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
}
