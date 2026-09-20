import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.mathiverse.in',
    withCredentials: true
})

export async function analyzeCurriculum({ targetRole, syllabusFile, syllabusText }) {
    const formData = new FormData()
    formData.append('targetRole', targetRole)
    if (syllabusFile) formData.append('syllabus', syllabusFile)
    if (syllabusText) formData.append('syllabusText', syllabusText)
    const res = await api.post('/api/curriculum', formData)
    return res.data.report
}

export async function getCurriculumReportById(reportId) {
    const res = await api.get(`/api/curriculum/report/${reportId}`)
    return res.data.report
}

export async function getAllCurriculumReports() {
    const res = await api.get('/api/curriculum')
    return res.data.reports
}
