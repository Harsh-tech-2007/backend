const express = require('express')
const curriculumRouter = express.Router()
const authMiddlewar = require('../middleware/auth_mid')
const curriculumController = require('../controller/curriculum_con')
const upload = require('../middleware/file_mid')

curriculumRouter.post('/', authMiddlewar.authUser, upload.single('syllabus'), curriculumController.analyzeCurriculumController)
curriculumRouter.get('/report/:reportId', authMiddlewar.authUser, curriculumController.getCurriculumReportByIdController)
curriculumRouter.get('/', authMiddlewar.authUser, curriculumController.getAllCurriculumReportsController)

module.exports = curriculumRouter
