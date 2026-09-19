import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/use.interview'
import { useNavigate, useParams } from 'react-router'


// ── Skeleton Loader Component (shown while loading) ───────────────────────────
const SkeletonDashboard = () => (
    <div className='interview-page skeleton-page'>
        <div className='interview-layout'>
            {/* Left Nav Skeleton */}
            <aside className='interview-nav skeleton-nav'>
                <div className='skeleton-box skeleton-btn' />
                <div className='skeleton-box skeleton-tag' />
                <div className='skeleton-box skeleton-item' />
                <div className='skeleton-box skeleton-item' />
                <div className='skeleton-box skeleton-item' />
                <div className='skeleton-box skeleton-item' />
            </aside>

            <div className='interview-divider' />

            {/* Center Content Skeleton */}
            <main className='interview-content skeleton-content'>
                <div className='skeleton-header-row'>
                    <div className='skeleton-box skeleton-title' />
                    <div className='skeleton-box skeleton-pill' />
                </div>
                <div className='skeleton-card-list'>
                    <div className='skeleton-box skeleton-card' />
                    <div className='skeleton-box skeleton-card' />
                    <div className='skeleton-box skeleton-card' />
                </div>
            </main>

            <div className='interview-divider' />

            {/* Right Sidebar Skeleton */}
            <aside className='interview-sidebar skeleton-sidebar'>
                <div className='skeleton-box skeleton-circle' />
                <div className='skeleton-box skeleton-meter' />
                <div className='skeleton-box skeleton-text' />
                <div className='skeleton-box skeleton-tags-group' />
            </aside>
        </div>
    </div>
)


// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Interviewer Intent</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Response</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// Resource Item Card (Reusable for both phase-level and top-level resources)
const ResourceCard = ({ resource }) => {
    const title = resource.title || resource.name || "Learning Resource"
    const type = resource.type || resource.category || "Documentation"
    const platform = resource.platform || ""
    const description = resource.description || ""
    const url = resource.url || (typeof resource === 'string' ? resource : "")

    return (
        <div className='resource-card'>
            <div className='resource-card__header'>
                <div className='resource-card__badges'>
                    <span className={`resource-badge resource-badge--${type.toLowerCase().replace(/[^a-z0-9]/g, '')}`}>
                        {type}
                    </span>
                    {platform && <span className='platform-tag'>{platform}</span>}
                </div>
                {url && (
                    <a
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='resource-link-btn'
                        title={`Open ${title}`}
                    >
                        <span>Visit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                )}
            </div>

            <h4 className='resource-card__title'>{title}</h4>
            {description && <p className='resource-card__desc'>{description}</p>}
        </div>
    )
}

// Career Phase Card for deep multi-week roadmaps
const CareerPhaseCard = ({ phase, index }) => (
    <div className='career-phase-card'>
        <div className='career-phase-card__header'>
            <div className='career-phase-card__meta'>
                <span className='career-phase-card__badge'>Phase {index + 1}</span>
                <span className='career-phase-card__duration'>{phase.duration}</span>
            </div>
            <h3 className='career-phase-card__title'>{phase.phase}</h3>
            <p className='career-phase-card__objective'>{phase.objective}</p>
        </div>

        {phase.topics?.length > 0 && (
            <div className='career-phase-card__topics'>
                <h4>Key Topics &amp; Competencies</h4>
                <div className='topics-list'>
                    {phase.topics.map((t, idx) => (
                        <span key={idx} className='topic-tag'>{t}</span>
                    ))}
                </div>
            </div>
        )}

        {phase.projectToBuild?.title && (
            <div className='career-phase-card__project'>
                <div className='project-badge'>Portfolio Project</div>
                <h4>{phase.projectToBuild.title}</h4>
                <p>{phase.projectToBuild.description}</p>
                {phase.projectToBuild.techStack?.length > 0 && (
                    <div className='tech-stack-list'>
                        {phase.projectToBuild.techStack.map((tech, idx) => (
                            <span key={idx} className='tech-tag'>{tech}</span>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Phase-Specific Curated Learning Resources */}
        {phase.resources?.length > 0 && (
            <div className='career-phase-card__resources'>
                <div className='resources-header'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                    <h4>Phase Learning Resources</h4>
                </div>
                <div className='phase-resources-grid'>
                    {phase.resources.map((res, rIdx) => (
                        <ResourceCard key={rIdx} resource={res} />
                    ))}
                </div>
            </div>
        )}
    </div>
)

// Skill Gap Matrix Item
const SkillMatrixItem = ({ item }) => (
    <div className='skill-matrix-card'>
        <div className='skill-matrix-card__top'>
            <h3 className='skill-matrix-card__name'>{item.skill}</h3>
            <span className={`importance-badge importance--${item.importance?.toLowerCase() || 'high'}`}>
                {item.importance || 'High'} Priority
            </span>
        </div>

        <div className='skill-matrix-card__levels'>
            <div className='level-box'>
                <span className='level-label'>Current Estimated Level</span>
                <span className='level-value current'>{item.currentLevel || 'Beginner'}</span>
            </div>
            <div className='level-arrow'>&rarr;</div>
            <div className='level-box'>
                <span className='level-label'>Target Required Level</span>
                <span className='level-value target'>{item.targetLevel || 'Proficient'}</span>
            </div>
        </div>

        {item.gapDescription && (
            <p className='skill-matrix-card__desc'>{item.gapDescription}</p>
        )}
    </div>
)

// Job Analysis View Component
const JobAnalysisView = ({ report }) => {
    const ja = report.jobAnalysis || {}
    const hasStructuredAnalysis = Boolean(ja.roleSummary || ja.alternativeRoles?.length)

    return (
        <div className='job-analysis-container'>
            {/* Meta Card */}
            <div className='job-analysis-meta-card'>
                <div className='meta-top'>
                    <span className='meta-badge role-badge'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        {ja.seniorityLevel || "Target Role"}
                    </span>
                    {ja.industryDomain && (
                        <span className='meta-badge domain-badge'>
                            {ja.industryDomain}
                        </span>
                    )}
                </div>
                <h3 className='role-title'>{report.title || "Target Position Analysis"}</h3>
                <p className='role-summary'>
                    {ja.roleSummary || report.jobDescription?.substring(0, 320) + "..."}
                </p>
            </div>

            {hasStructuredAnalysis ? (
                <div className='job-breakdown-grid'>
                    {/* Market Demand & Hiring Probability */}
                    <div className='job-breakdown-card'>
                        <div className='card-header'>
                            <span className='header-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                            </span>
                            <h4>Market Demand & Hiring Probability</h4>
                        </div>
                        <div className='market-demand-content'>
                            <div className='demand-stat'>
                                <strong>Your Hiring Probability:</strong> 
                                <span className='highlight-score'> {typeof report.jobReadinessScore === 'number' && report.jobReadinessScore > 0 ? report.jobReadinessScore : Math.max(10, Math.min(95, Math.round(report.matchScore * 0.92)))}%</span>
                            </div>
                            {ja.marketDemand && typeof ja.marketDemand === 'string' ? (
                                <div className='demand-stat'>
                                    <strong>Role Demand:</strong> 
                                    <span> {ja.marketDemand}</span>
                                </div>
                            ) : ja.marketDemand && typeof ja.marketDemand === 'object' ? (
                                <>
                                    <div className='demand-stat'>
                                        <strong>Overall Demand:</strong> 
                                        <span className={`demand-badge demand-${(ja.marketDemand.overallDemand || '').toLowerCase().replace(' ', '-')}`}>
                                            {ja.marketDemand.overallDemand}
                                        </span>
                                        {ja.marketDemand.trend && <span className='demand-trend'> ({ja.marketDemand.trend})</span>}
                                    </div>
                                    <p className='demand-overview'>{ja.marketDemand.marketOverview}</p>
                                </>
                            ) : null}
                        </div>
                    </div>

                    {/* Alternative Roles */}
                    {ja.alternativeRoles?.length > 0 && (
                        <div className='job-breakdown-card job-breakdown-card--full'>
                            <div className='card-header'>
                                <span className='header-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </span>
                                <h4>Alternative Roles to Target</h4>
                            </div>
                            
                            {typeof ja.alternativeRoles[0] === 'string' ? (
                                <ul className='requirements-list'>
                                    {ja.alternativeRoles.map((role, i) => (
                                        <li key={i}>
                                            <span className='check-bullet'>✦</span>
                                            <span>{role}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className='alternative-roles-grid'>
                                    {ja.alternativeRoles.map((role, i) => (
                                        <div key={i} className='alt-role-card'>
                                            <div className='alt-role-card__header'>
                                                <h5>{role.jobTitle}</h5>
                                                <span className={`match-badge match-${role.fitPercentage >= 80 ? 'high' : role.fitPercentage >= 60 ? 'mid' : 'low'}`}>
                                                    {role.fitPercentage}% Match
                                                </span>
                                            </div>
                                            <p className='alt-role-card__desc'>{role.whyCandidateCanTarget}</p>
                                            {role.skillGaps?.length > 0 && (
                                                <div className='alt-role-card__gaps'>
                                                    <strong>Bridge Needed:</strong> {role.skillGaps.join(', ')}
                                                </div>
                                            )}
                                            <div className='alt-role-card__footer'>
                                                <span className='transition-diff'>Transition: <strong>{role.transitionDifficulty}</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Fallback for older reports without structured jobAnalysis */
                <div className='raw-job-card'>
                    <h4>Original Job Requirements</h4>
                    <p className='raw-desc'>{report.jobDescription}</p>
                </div>
            )}
        </div>
    )
}


// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const { report, getReportById, loading } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    const isRoadmapMode = report?.planType === 'roadmap' || Boolean(report?.careerRoadmap?.length)
    const [ activeNav, setActiveNav ] = useState(isRoadmapMode ? 'roadmap' : 'jobAnalysis')

    useEffect(() => {
        window.scrollTo(0, 0)
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    useEffect(() => {
        if (report) {
            setActiveNav(report.planType === 'roadmap' ? 'roadmap' : 'jobAnalysis')
        }
    }, [ report?._id ])


    // Render Skeleton Screen while loading
    if (loading || !report) {
        return <SkeletonDashboard />
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    // Compute or read realistic job readiness score
    const jobReadiness = typeof report.jobReadinessScore === 'number' && report.jobReadinessScore > 0
        ? report.jobReadinessScore
        : Math.max(10, Math.min(95, Math.round(report.matchScore * 0.92)))


    const readinessColorClass =
        jobReadiness >= 80 ? 'readiness--high' :
        jobReadiness >= 60 ? 'readiness--mid' : 'readiness--low'

    // Define navigation tabs dynamically based on planType
    // NOTE: Technical Q&A and Behavioral Q&A are REMOVED from Career Roadmap mode!
    const navItems = isRoadmapMode ? [
        { id: 'roadmap', label: 'Career Roadmap', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/><polyline points="13 21 11 13 3 11"/></svg>) },
        { id: 'skills', label: 'Skill Gap Matrix', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>) },
        { id: 'jobAnalysis', label: 'Job Analysis', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>) },
        { id: 'resources', label: 'Curated Resources', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>) },
    ] : [
        { id: 'jobAnalysis', label: 'Job Analysis', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>) },
        { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
        { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
        { id: 'roadmap', label: 'Preparation Roadmap', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
        { id: 'resources', label: 'Resources', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>) },
    ]

    const hasTopLevelResources = report.resources?.length > 0

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <button
                            className='interview-nav__home-btn'
                            onClick={() => navigate('/')}
                            title='Back to Dashboard'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            Dashboard
                        </button>

                        <div className='analysis-badge-container'>
                            <span className={`analysis-type-tag ${isRoadmapMode ? 'tag--roadmap' : 'tag--interview'}`}>
                                {isRoadmapMode ? 'Skill & Career Roadmap' : 'Interview Plan'}
                            </span>
                        </div>

                        <p className='interview-nav__label'>Sections</p>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => alert("Profile export feature is coming soon.")}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Export Profile
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>

                    {/* Roadmap Tab */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>{isRoadmapMode ? 'Career Transition Roadmap' : 'Preparation Roadmap'}</h2>
                                <span className='content-header__count'>
                                    {isRoadmapMode ? `${report.careerRoadmap?.length || 0} Phases` : `${report.preparationPlan?.length || 0} Days`}
                                </span>
                            </div>

                            {isRoadmapMode && report.careerRoadmap?.length > 0 ? (
                                <div className='career-phases-list'>
                                    {report.careerRoadmap.map((phase, i) => (
                                        <CareerPhaseCard key={i} phase={phase} index={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className='roadmap-list'>
                                    {report.preparationPlan?.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Skill Gap Matrix Tab */}
                    {activeNav === 'skills' && (
                        <section>
                            <div className='content-header'>
                                <h2>Skill Gap &amp; Competency Matrix</h2>
                                <span className='content-header__count'>{report.skillAnalysis?.length || 0} Skills Analyzed</span>
                            </div>
                            <div className='skills-matrix-list'>
                                {report.skillAnalysis?.map((item, i) => (
                                    <SkillMatrixItem key={i} item={item} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Job Analysis Tab */}
                    {activeNav === 'jobAnalysis' && (
                        <section>
                            <div className='content-header'>
                                <h2>Role Breakdown &amp; Job Analysis</h2>
                                <span className='content-header__count'>
                                    {report.jobAnalysis?.seniorityLevel || "Verified Spec"}
                                </span>
                            </div>
                            <JobAnalysisView report={report} />
                        </section>
                    )}

                    {/* Curated Resources Tab */}
                    {activeNav === 'resources' && (
                        <section>
                            <div className='content-header'>
                                <h2>Curated Learning Resources</h2>
                                <span className='content-header__count'>{report.resources?.length || 0} References</span>
                            </div>

                            {hasTopLevelResources ? (
                                <div className='resources-grid'>
                                    {report.resources.map((res, i) => (
                                        <ResourceCard key={i} resource={res} />
                                    ))}
                                </div>
                            ) : (
                                <div className='empty-resources-banner'>
                                    <p>Phase-specific learning resources are embedded inside each phase of the <strong>Career Roadmap</strong> tab.</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Technical Questions (Only rendered in Interview Mode) */}
                    {activeNav === 'technical' && !isRoadmapMode && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Assessment</h2>
                                <span className='content-header__count'>{report.technicalQuestions?.length || 0} Questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Behavioral Questions (Only rendered in Interview Mode) */}
                    {activeNav === 'behavioral' && !isRoadmapMode && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Assessment</h2>
                                <span className='content-header__count'>{report.behavioralQuestions?.length || 0} Questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* 1. Skill Meter (Role Alignment Score Ring) */}
                    <div className='match-score'>
                        <p className='match-score__label'>Skill Meter</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>
                            {report.matchScore >= 80 ? 'High competency overlap with role prerequisites' :
                             report.matchScore >= 60 ? 'Moderate alignment — specific competencies need bridging' :
                             'Foundational alignment — comprehensive roadmap advised'}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* 2. Job Meter (Hiring Probability Gauge) */}
                    <div className='job-meter'>
                        <div className='job-meter__header'>
                            <p className='job-meter__label'>Hiring Probability</p>
                            <span className={`job-meter__value ${readinessColorClass}`}>
                                {jobReadiness}%
                            </span>
                        </div>

                        <div className='job-meter__gauge-wrapper'>
                            <div className='gauge-track'>
                                <div
                                    className={`gauge-fill ${readinessColorClass}`}
                                    style={{ width: `${jobReadiness}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Key Skill Gaps Identified */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Key Gaps Identified</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps?.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview