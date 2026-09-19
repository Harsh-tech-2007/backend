const mongoose = require('mongoose')

const skillAnalysisItemSchema = new mongoose.Schema({
    skill: { type: String },
    marketDemand: { type: String },
    curriculumCoverage: { type: String },
    gapNote: { type: String }
}, { _id: false })

const recommendationSchema = new mongoose.Schema({
    topic: { type: String },
    priority: { type: String },
    action: { type: String },
    reason: { type: String }
}, { _id: false })

const curriculumReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    syllabusText: { type: String },
    targetRole: { type: String, required: true },
    courseTitle: { type: String, required: true },
    overallGapScore: { type: Number, default: 0 },
    verdict: { type: String },
    skillsAnalysis: [skillAnalysisItemSchema],
    recommendations: [recommendationSchema],
    stronglyCovered: [{ type: String }],
    missing: [{ type: String }]
}, { timestamps: true })

module.exports = mongoose.model('CurriculumReport', curriculumReportSchema)
