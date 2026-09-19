import { createContext, useState } from 'react'
import { analyzeCurriculum, getCurriculumReportById, getAllCurriculumReports } from '../services/curriculum_api'

export const CurriculumContext = createContext()

export function CurriculumProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    async function analyzeReport({ targetRole, syllabusFile, syllabusText }) {
        setLoading(true)
        try {
            const data = await analyzeCurriculum({ targetRole, syllabusFile, syllabusText })
            setReport(data)
            return data
        } finally {
            setLoading(false)
        }
    }

    async function getReportById(id) {
        setLoading(true)
        try {
            const data = await getCurriculumReportById(id)
            setReport(data)
        } finally {
            setLoading(false)
        }
    }

    async function getReports() {
        try {
            const data = await getAllCurriculumReports()
            setReports(data || [])
        } catch { /* silent */ }
    }

    return (
        <CurriculumContext.Provider value={{ loading, report, reports, analyzeReport, getReportById, getReports }}>
            {children}
        </CurriculumContext.Provider>
    )
}
