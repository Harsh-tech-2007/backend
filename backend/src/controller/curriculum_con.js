const pdfParse = require('pdf-parse')
const { generateCurriculumGapReport } = require('../services/ai.service')
const CurriculumReport = require('../model/curriculumreport')

async function analyzeCurriculumController(req, res) {
    try {
        const { targetRole, syllabusText: rawText } = req.body
        if (!targetRole) return res.status(400).json({ message: 'Target role is required.' })

        let syllabusText = rawText || ''

        if (req.file) {
            const parsed = await pdfParse(req.file.buffer)
            syllabusText = parsed.text
        }

        if (!syllabusText.trim()) return res.status(400).json({ message: 'Please upload a syllabus PDF or paste syllabus content.' })

        const aiResult = await generateCurriculumGapReport({ syllabusText, targetRole })

        const report = await CurriculumReport.create({
            user: req.user.id,
            syllabusText,
            targetRole,
            ...aiResult
        })

        res.status(201).json({ message: 'Curriculum report generated successfully.', report })
    } catch (err) {
        console.error('Curriculum analyze error:', err.message)
        res.status(500).json({ message: err.message || 'Internal server error' })
    }
}

async function getCurriculumReportByIdController(req, res) {
    try {
        const report = await CurriculumReport.findOne({ _id: req.params.reportId, user: req.user.id })
        if (!report) return res.status(404).json({ message: 'Report not found.' })
        res.status(200).json({ message: 'Report fetched.', report })
    } catch (err) {
        console.error('Get curriculum report error:', err.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

async function getAllCurriculumReportsController(req, res) {
    try {
        const reports = await CurriculumReport
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('courseTitle targetRole overallGapScore createdAt')
        res.status(200).json({ message: 'Reports fetched.', reports })
    } catch (err) {
        console.error('Get all curriculum reports error:', err.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = { analyzeCurriculumController, getCurriculumReportByIdController, getAllCurriculumReportsController }
