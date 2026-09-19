import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useCurriculum } from '../hooks/use.curriculum'
import '../style/curriculum.scss'

export default function Curriculum() {
    const { reportId } = useParams()
    const { report, getReportById, loading } = useCurriculum()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
        if (reportId) getReportById(reportId)
    }, [reportId])

    if (loading || !report) {
        return (
            <div className='curriculum-loading'>
                <div className='curriculum-loading__spinner' />
                <p>Analyzing curriculum gap...</p>
            </div>
        )
    }

    const scoreColor = report.overallGapScore >= 70 ? 'score--high' : report.overallGapScore >= 45 ? 'score--mid' : 'score--low'
    const scoreLabel = report.overallGapScore >= 70 ? 'Well Aligned' : report.overallGapScore >= 45 ? 'Partially Aligned' : 'Significant Gaps'

    return (
        <div className='curriculum-page'>
            {/* Header */}
            <div className='curriculum-header'>
                <button className='back-btn' onClick={() => navigate('/')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Dashboard
                </button>
                <div className='curriculum-header__meta'>
                    <span className='edu-badge'>Educator Mode</span>
                    <h1>{report.courseTitle}</h1>
                    <p>Compared against: <strong>{report.targetRole}</strong></p>
                </div>
            </div>

            <div className='curriculum-layout'>
                {/* Score Sidebar */}
                <aside className='curriculum-sidebar'>
                    <div className={`gap-score-ring ${scoreColor}`}>
                        <span className='gap-score-ring__value'>{report.overallGapScore}</span>
                        <span className='gap-score-ring__pct'>%</span>
                    </div>
                    <p className='gap-score-label'>Market Coverage</p>
                    <span className={`gap-score-tag ${scoreColor}`}>{scoreLabel}</span>

                    <div className='sidebar-divider' />

                    <div className='verdict-box'>
                        <p className='verdict-label'>Verdict</p>
                        <p className='verdict-text'>{report.verdict}</p>
                    </div>

                    <div className='sidebar-divider' />

                    {report.stronglyCovered?.length > 0 && (
                        <div className='covered-section'>
                            <p className='covered-label'>✓ Strengths</p>
                            {report.stronglyCovered.map((t, i) => <span key={i} className='covered-tag'>{t}</span>)}
                        </div>
                    )}

                    {report.missing?.length > 0 && (
                        <div className='missing-section'>
                            <p className='missing-label'>✗ Missing</p>
                            {report.missing.map((t, i) => <span key={i} className='missing-tag'>{t}</span>)}
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className='curriculum-main'>
                    {/* Skills Matrix */}
                    <section className='curriculum-section'>
                        <h2>Skills Gap Matrix</h2>
                        <div className='skills-matrix-grid'>
                            {report.skillsAnalysis?.map((item, i) => {
                                const coverageClass = item.curriculumCoverage === 'Excellent' ? 'cov--excellent' : item.curriculumCoverage === 'Good' ? 'cov--good' : item.curriculumCoverage === 'Basic' ? 'cov--basic' : 'cov--none'
                                const demandClass = item.marketDemand === 'Very High' || item.marketDemand === 'High' ? 'dem--high' : item.marketDemand === 'Moderate' ? 'dem--mid' : 'dem--low'
                                return (
                                    <div key={i} className='skills-matrix-item'>
                                        <div className='skills-matrix-item__top'>
                                            <h4>{item.skill}</h4>
                                            <div className='badges-row'>
                                                <span className={`market-badge ${demandClass}`}>{item.marketDemand} Demand</span>
                                                <span className={`coverage-badge ${coverageClass}`}>{item.curriculumCoverage} Coverage</span>
                                            </div>
                                        </div>
                                        <p className='gap-note'>{item.gapNote}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Recommendations */}
                    <section className='curriculum-section'>
                        <h2>Action Recommendations</h2>
                        <div className='recommendations-list'>
                            {report.recommendations?.map((rec, i) => {
                                const priorityClass = rec.priority === 'Critical' ? 'pri--critical' : rec.priority === 'High' ? 'pri--high' : 'pri--medium'
                                const actionClass = rec.action === 'Add' ? 'act--add' : rec.action === 'Remove' ? 'act--remove' : rec.action === 'Expand' ? 'act--expand' : 'act--update'
                                return (
                                    <div key={i} className='rec-card'>
                                        <div className='rec-card__left'>
                                            <span className={`priority-badge ${priorityClass}`}>{rec.priority}</span>
                                        </div>
                                        <div className='rec-card__body'>
                                            <div className='rec-card__header'>
                                                <h4>{rec.topic}</h4>
                                                <span className={`action-badge ${actionClass}`}>{rec.action}</span>
                                            </div>
                                            <p>{rec.reason}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
