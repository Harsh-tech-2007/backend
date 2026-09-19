import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/use.interview'
import { useAuth } from '../../auth/hooks/use.auth'
import { useNavigate } from 'react-router'
import { useCurriculum } from '../hooks/use.curriculum'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts'

const pulseChartData = [
    { name: 'AI/ML Eng', demand: 95, supply: 40 },
    { name: 'Cloud Arch', demand: 88, supply: 55 },
    { name: 'Full Stack', demand: 85, supply: 80 },
    { name: 'Data Eng', demand: 82, supply: 50 },
    { name: 'Cyber Sec', demand: 80, supply: 45 },
    { name: 'DevOps/SRE', demand: 78, supply: 60 },
    { name: 'iOS Dev', demand: 65, supply: 50 },
    { name: 'Android Dev', demand: 60, supply: 55 },
    { name: 'Blockchain', demand: 55, supply: 30 },
    { name: 'Data Sci.', demand: 85, supply: 65 },
    { name: 'UI/UX Des.', demand: 70, supply: 85 },
    { name: 'QA Auto.', demand: 65, supply: 60 },
    { name: 'Prod Mgr', demand: 75, supply: 70 }
]

const trendChartData = [
    { month: 'Jan', AI: 65, Web: 90, Cloud: 70 },
    { month: 'Feb', AI: 70, Web: 88, Cloud: 72 },
    { month: 'Mar', AI: 78, Web: 87, Cloud: 76 },
    { month: 'Apr', AI: 85, Web: 85, Cloud: 80 },
    { month: 'May', AI: 92, Web: 83, Cloud: 85 },
    { month: 'Jun', AI: 98, Web: 85, Cloud: 88 },
]

const domainShareData = [
    { name: 'Web Dev', value: 35, color: '#89ceff' },
    { name: 'AI & ML', value: 25, color: '#4ade80' },
    { name: 'Cloud/Ops', value: 20, color: '#c0c1ff' },
    { name: 'Data', value: 12, color: '#fbbf24' },
    { name: 'Mobile', value: 8, color: '#ffb4ab' },
]

const pickItData = [
    { role: 'Platform Engineer', currentDemand: 45, projectedGrowth: '+85%', reason: 'Shift from DevOps to internal developer platforms.' },
    { role: 'AI Compliance Spec.', currentDemand: 30, projectedGrowth: '+120%', reason: 'New regulations require AI safety & ethics audits.' },
    { role: 'Rust Developer', currentDemand: 50, projectedGrowth: '+75%', reason: 'Replacing C++ in high-performance/system layers.' },
    { role: 'Web3 Security', currentDemand: 35, projectedGrowth: '+90%', reason: 'High smart contract vulnerability costs driving demand.' },
    { role: 'Data Privacy Eng.', currentDemand: 40, projectedGrowth: '+65%', reason: 'Global privacy laws forcing tech companies to adapt.' },
    { role: 'AR/VR Developer', currentDemand: 25, projectedGrowth: '+110%', reason: 'Spatial computing hardware adoption is accelerating.' }
]

const jobsTableData = [
    { role: 'AI/ML Engineer', domain: 'AI & ML', salary: '₹15L - ₹35L', openRoles: '4,500+', growth: '+42%' },
    { role: 'Full Stack Developer', domain: 'Web Dev', salary: '₹8L - ₹25L', openRoles: '12,000+', growth: '+15%' },
    { role: 'Cloud Architect', domain: 'Cloud/Ops', salary: '₹20L - ₹45L', openRoles: '2,800+', growth: '+35%' },
    { role: 'Data Engineer', domain: 'Data', salary: '₹12L - ₹28L', openRoles: '5,200+', growth: '+28%' },
    { role: 'Cybersecurity Analyst', domain: 'Security', salary: '₹10L - ₹24L', openRoles: '3,100+', growth: '+30%' },
    { role: 'DevOps/SRE', domain: 'Cloud/Ops', salary: '₹14L - ₹32L', openRoles: '4,100+', growth: '+22%' },
    { role: 'iOS Developer', domain: 'Mobile', salary: '₹9L - ₹22L', openRoles: '1,800+', growth: '+8%' },
    { role: 'Manual QA Tester', domain: 'Testing', salary: '₹3L - ₹8L', openRoles: '850 (Declining)', growth: '-18%' },
    { role: 'PHP/WordPress Dev', domain: 'Web Dev', salary: '₹4L - ₹10L', openRoles: '1,200', growth: '-12%' },
    { role: 'On-Prem SysAdmin', domain: 'IT Ops', salary: '₹5L - ₹12L', openRoles: '400 (Declining)', growth: '-25%' },
    { role: 'jQuery Specialist', domain: 'Frontend', salary: '₹3L - ₹7L', openRoles: '150', growth: '-35%' },
]

const decliningChartData = [
    { name: 'Manual QA', decline: -18, currentDemand: 25 },
    { name: 'PHP Dev', decline: -12, currentDemand: 35 },
    { name: 'On-Prem SysAdmin', decline: -25, currentDemand: 15 },
    { name: 'jQuery Spec.', decline: -35, currentDemand: 10 },
    { name: 'Flash Dev', decline: -60, currentDemand: 2 },
]

const Home = () => {

    const { generateReport, reports, getReports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ formError, setFormError ] = useState("")
    const [ isGenerating, setIsGenerating ] = useState(false)
    const [ planType, setPlanType ] = useState("roadmap")
    const resumeInputRef = useRef()

    const { analyzeReport } = useCurriculum()
    const [appMode, setAppMode] = useState('candidate')
    const [targetRole, setTargetRole] = useState('')
    const [syllabusText, setSyllabusText] = useState('')
    const [syllabusFile, setSyllabusFile] = useState(null)
    const syllabusInputRef = useRef()

    const [selectedSector, setSelectedSector] = useState('IT & Software')

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
        getReports()
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setFormError("")
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('dropzone--drag-over')
        const file = e.dataTransfer.files[0]
        if (!file) return
        if (file.type !== 'application/pdf') {
            setFormError("Only PDF files are supported.")
            return
        }
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        resumeInputRef.current.files = dataTransfer.files
        setSelectedFile(file)
        setFormError("")
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('dropzone--drag-over')
    }

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('dropzone--drag-over')
    }

    const handleGenerateReport = async () => {
        if (!selectedFile && !selfDescription.trim()) {
            setFormError("Please upload a resume (PDF) or provide an experience summary.")
            return
        }
        if (!jobDescription.trim()) {
            setFormError("Job description is required.")
            return
        }
        setFormError("")
        setIsGenerating(true)
        const resumeFile = selectedFile || null
        const data = await generateReport({ jobDescription, selfDescription, resumeFile, planType })
        setIsGenerating(false)
        if (data) navigate(`/interview/${data._id}`)
    }

    const handleAnalyzeCurriculum = async () => {
        if (!targetRole.trim()) {
            setFormError('Target job role is required.')
            return
        }
        if (!syllabusFile && !syllabusText.trim()) {
            setFormError('Please upload a syllabus PDF or paste syllabus content.')
            return
        }
        setFormError('')
        setIsGenerating(true)
        const data = await analyzeReport({ targetRole, syllabusFile, syllabusText })
        setIsGenerating(false)
        if (data) navigate(`/curriculum/${data._id}`)
    }

    if (isGenerating) {
        return (
            <main className='loading-screen'>
                <h1>{appMode === 'educator' ? 'Analyzing Curriculum Against Market...' : planType === 'roadmap' ? 'Analyzing Skills & Generating Career Roadmap...' : 'Generating Interview Preparation Plan...'}</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Top Navigation Bar */}
            <div className='home-top-bar'>
                <div className='user-badge'>
                    <span className='user-dot'></span>
                    <span className='user-name'>{user?.username || user?.email || 'Active'}</span>
                </div>
                <button onClick={handleLogout} className='logout-btn' title='Sign out'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                </button>
            </div>

            {/* Page Header */}
            <header className='page-header'>
                <h1>
                    {appMode === 'pulse' ? (
                        <>Market <span className='highlight'>Pulse</span></>
                    ) : appMode === 'educator' ? (
                        <>Curriculum <span className='highlight'>Gap Analysis</span></>
                    ) : planType === 'roadmap' ? (
                        <>Career <span className='highlight'>Roadmap</span></>
                    ) : (
                        <>Interview <span className='highlight'>Plan</span></>
                    )}
                </h1>
                <p>
                    {appMode === 'pulse'
                        ? 'Live insights on trending skills and high-potential underrated sectors.'
                        : appMode === 'educator'
                        ? 'Upload a syllabus and compare it against current job market demands.'
                        : planType === 'roadmap'
                        ? 'Skill gap analysis and personalized preparation roadmap.'
                        : 'Targeted interview questions, model answers, and preparation plan.'}
                </p>
            </header>

            {/* App Mode Toggle */}
            <div className='app-mode-toggle'>
                <button
                    className={`app-mode-btn ${appMode === 'pulse' ? 'app-mode-btn--active' : ''}`}
                    onClick={() => setAppMode('pulse')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Market Pulse
                </button>
                <button
                    className={`app-mode-btn ${appMode === 'candidate' ? 'app-mode-btn--active' : ''}`}
                    onClick={() => setAppMode('candidate')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Candidate Mode
                </button>
                <button
                    className={`app-mode-btn ${appMode === 'educator' ? 'app-mode-btn--active' : ''}`}
                    onClick={() => setAppMode('educator')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    Educator Mode
                </button>
            </div>

            {/* Pulse Mode: Live Charts & Underrated Sectors */}
            {appMode === 'pulse' && (
                <div className='pulse-dashboard'>
                    
                    {/* Sector Selector */}
                    <div className='pulse-controls'>
                        <span className='control-label'>Select Sector:</span>
                        <div className='sector-selector'>
                            {['IT & Software', 'Finance & FinTech', 'Healthcare', 'Manufacturing', 'Retail & E-Com'].map(sector => (
                                <button 
                                    key={sector}
                                    className={`sector-btn ${selectedSector === sector ? 'sector-btn--active' : ''}`}
                                    onClick={() => setSelectedSector(sector)}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Top Stats */}
                    <div className='pulse-stats'>
                        <div className='pulse-stat-card'>
                            <h3>Top Growth Skill</h3>
                            <p className='stat-value'>AI/ML Eng</p>
                            <span className='stat-trend positive'>+42% MoM</span>
                        </div>
                        <div className='pulse-stat-card'>
                            <h3>Most Saturated</h3>
                            <p className='stat-value'>Entry React Dev</p>
                            <span className='stat-trend negative'>-15% Demand</span>
                        </div>
                        <div className='pulse-stat-card'>
                            <h3>Fastest Emerging</h3>
                            <p className='stat-value'>Web3 Security</p>
                            <span className='stat-trend positive'>+90% YoY</span>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className='pulse-charts-row quad-charts'>
                        
                        {/* Demand vs Supply */}
                        <div className='chart-container'>
                            <div className='chart-header'>
                                <h2>Demand vs Supply (Top Roles)</h2>
                                <span className='live-badge'><div className='pulse-live-dot'/> Live</span>
                            </div>
                            <div className='chart-wrapper'>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={pulseChartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#888" angle={-90} textAnchor="end" height={80} tick={{fill: '#888', fontSize: 11, dy: 10}} />
                                        <YAxis stroke="#888" tick={{fill: '#888', fontSize: 11}} />
                                        <RechartsTooltip 
                                            contentStyle={{backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}
                                            itemStyle={{fontSize: '13px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '12px', color: '#888', bottom: 0}} />
                                        <Bar dataKey="demand" name="Market Demand" fill="#89ceff" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="supply" name="Candidate Supply" fill="#c0c1ff" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 6-Month Hiring Trends */}
                        <div className='chart-container'>
                            <div className='chart-header'>
                                <h2>6-Month Hiring Trends</h2>
                            </div>
                            <div className='chart-wrapper'>
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={trendChartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="month" stroke="#888" tick={{fill: '#888', fontSize: 11}} />
                                        <YAxis stroke="#888" tick={{fill: '#888', fontSize: 11}} />
                                        <RechartsTooltip 
                                            contentStyle={{backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}
                                            itemStyle={{fontSize: '13px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '12px', color: '#888', bottom: 0}} />
                                        <Line type="monotone" dataKey="AI" name="AI/ML" stroke="#4ade80" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                        <Line type="monotone" dataKey="Web" name="Web Dev" stroke="#c0c1ff" strokeWidth={3} dot={{r: 4}} />
                                        <Line type="monotone" dataKey="Cloud" name="Cloud & DevOps" stroke="#89ceff" strokeWidth={3} dot={{r: 4}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Domain Share Pie Chart */}
                        <div className='chart-container'>
                            <div className='chart-header'>
                                <h2>Job Postings by Domain</h2>
                            </div>
                            <div className='chart-wrapper'>
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                                        <Pie data={domainShareData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                            {domainShareData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}
                                            itemStyle={{fontSize: '13px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '12px', color: '#888', bottom: 0}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Declining Roles BarChart */}
                        <div className='chart-container'>
                            <div className='chart-header'>
                                <h2>Top Declining Roles</h2>
                            </div>
                            <div className='chart-wrapper'>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={decliningChartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={60} tick={{fill: '#888', fontSize: 11, dy: 10}} />
                                        <YAxis stroke="#888" tick={{fill: '#888', fontSize: 11}} />
                                        <RechartsTooltip 
                                            contentStyle={{backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}
                                            itemStyle={{fontSize: '13px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '12px', color: '#888', bottom: 0}} />
                                        <Bar dataKey="decline" name="Decline (%)" fill="#ffb4ab" radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="currentDemand" name="Current Demand Index" fill="#555562" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Market Table */}
                    <div className='pulse-table-section'>
                        <div className='pulse-table-header'>
                            <h2>Detailed Job Market Data</h2>
                            <p>Live metrics across top tech roles</p>
                        </div>
                        <div className='table-responsive'>
                            <table className='pulse-table'>
                                <thead>
                                    <tr>
                                        <th>Job Role</th>
                                        <th>Domain</th>
                                        <th>Avg. Salary Range</th>
                                        <th>Est. Open Roles</th>
                                        <th>YoY Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobsTableData.map((job, i) => {
                                        const isDeclining = job.growth.startsWith('-');
                                        return (
                                            <tr key={i}>
                                                <td className='fw-bold'>{job.role}</td>
                                                <td><span className='domain-pill'>{job.domain}</span></td>
                                                <td>{job.salary}</td>
                                                <td>{job.openRoles}</td>
                                                <td className={isDeclining ? 'text-danger' : 'text-success'}>
                                                    {isDeclining ? '↓ ' : '↑ '}{job.growth}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pick It Sectors (Underrated) */}
                    <div className='pick-it-section'>
                        <div className='pick-it-header'>
                            <div className='header-title-row'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                <h2>Growing Sectors</h2>
                            </div>
                            <p>Golden opportunities: High future growth + Low current market saturation</p>
                        </div>
                        <div className='pick-it-grid'>
                            {pickItData.map((item, i) => (
                                <div key={i} className='pick-it-card'>
                                    <div className='pick-it-card__top'>
                                        <h4>{item.role}</h4>
                                        <span className='growth-badge'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                            {item.projectedGrowth}
                                        </span>
                                    </div>
                                    <div className='pick-it-card__mid'>
                                        <div className='demand-meta'>
                                            <span className='demand-label'>Market Saturation</span>
                                            <span className='demand-value'>{item.currentDemand}%</span>
                                        </div>
                                        <div className='demand-meter'>
                                            <div className='demand-meter-fill' style={{width: `${item.currentDemand}%`}}/>
                                        </div>
                                    </div>
                                    <div className='pick-it-card__bottom'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        <p className='pick-it-reason'>{item.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}

            {/* Candidate Mode: Plan Mode Selector + Main Card */}
            {appMode === 'candidate' && (
                <>
                    {/* Plan Mode Selector */}
                    <div className='mode-selector'>
                        <button
                            type='button'
                            className={`mode-btn ${planType === 'roadmap' ? 'mode-btn--active' : ''}`}
                            onClick={() => setPlanType('roadmap')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/><polyline points="13 21 11 13 3 11"/></svg>
                            Skill Audit &amp; Career Roadmap
                        </button>
                        <button
                            type='button'
                            className={`mode-btn ${planType === 'interview' ? 'mode-btn--active' : ''}`}
                            onClick={() => setPlanType('interview')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            Interview Preparation
                        </button>
                    </div>

                    {/* Main Card */}
                    <div className='interview-card'>
                        <div className='interview-card__body'>

                            {/* Left Panel - Job Description */}
                            <div className='panel panel--left'>
                                <div className='panel__header'>
                                    <span className='panel__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    </span>
                                    <h2>Job Description</h2>
                                    <span className='badge badge--required'>Required</span>
                                </div>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => { setJobDescription(e.target.value) }}
                                    className='panel__textarea'
                                    placeholder="Paste the target job description, responsibilities, and required qualifications..."
                                    maxLength={5000}
                                />
                                <div className='char-counter'>{jobDescription.length} / 5000</div>
                            </div>

                            {/* Vertical Divider */}
                            <div className='panel-divider' />

                            {/* Right Panel - Profile */}
                            <div className='panel panel--right'>
                                <div className='panel__header'>
                                    <span className='panel__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </span>
                                    <h2>Candidate Profile</h2>
                                </div>

                                {/* Upload Resume */}
                                <div className='upload-section'>
                                    <label className='section-label'>
                                        Resume
                                        <span className='badge badge--best'>Recommended</span>
                                    </label>

                                    {/* Dropzone */}
                                    <label
                                        className={`dropzone${selectedFile ? ' dropzone--selected' : ''}`}
                                        htmlFor='resume'
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                    >
                                        <span className='dropzone__icon'>
                                            {selectedFile
                                                ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                            }
                                        </span>
                                        {selectedFile
                                            ? <p className='dropzone__title' style={{ color: '#89ceff' }}>✓ {selectedFile.name}</p>
                                            : <p className='dropzone__title'>Click to browse or drag &amp; drop</p>
                                        }
                                        <p className='dropzone__subtitle'>PDF (Max 3MB)</p>
                                        <input
                                            ref={resumeInputRef}
                                            style={{ display: 'none' }}
                                            type='file'
                                            id='resume'
                                            name='resume'
                                            accept='.pdf,application/pdf'
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>

                                {/* OR Divider */}
                                <div className='or-divider'><span>OR</span></div>

                                {/* Quick Self-Description */}
                                <div className='self-description'>
                                    <label className='section-label' htmlFor='selfDescription'>Experience Summary</label>
                                    <textarea
                                        value={selfDescription}
                                        onChange={(e) => { setSelfDescription(e.target.value) }}
                                        id='selfDescription'
                                        name='selfDescription'
                                        className='panel__textarea panel__textarea--short'
                                        placeholder="Summarize your technical background, core competencies, and years of experience..."
                                    />
                                </div>

                                {/* Info Box */}
                                <div className='info-box'>
                                    <span className='info-box__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                    </span>
                                    <p>Provide either a <strong>Resume</strong> or an <strong>Experience Summary</strong> to proceed.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className='interview-card__footer'>
                            <div>
                                {formError && <p style={{ color: '#ffb4ab', marginBottom: '0.5rem', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>{formError}</p>}
                                <span className='footer-info'>
                                    {planType === 'roadmap' ? 'Deep Analysis: Skill Matrix & Roadmap' : 'Speed Prep: Targeted Q&A & Sprint'} &bull; ~30s
                                </span>
                            </div>
                            <button
                                onClick={handleGenerateReport}
                                className='generate-btn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                                {planType === 'roadmap' ? 'Generate Career Roadmap' : 'Generate Interview Plan'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Educator Mode Card */}
            {appMode === 'educator' && (
                <div className='interview-card'>
                    <div className='interview-card__body'>
                        {/* Left: Target Role */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </span>
                                <h2>Target Job Role</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>
                            <textarea
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className='panel__textarea'
                                placeholder="Enter the target job role or paste a job description to compare your curriculum against (e.g., 'Full Stack Developer', 'Data Scientist')..."
                                maxLength={3000}
                            />
                            <div className='char-counter'>{targetRole.length} / 3000</div>
                        </div>

                        <div className='panel-divider' />

                        {/* Right: Syllabus Upload */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                </span>
                                <h2>Course Syllabus</h2>
                            </div>

                            <div className='upload-section'>
                                <label className='section-label'>
                                    Syllabus PDF
                                    <span className='badge badge--best'>Recommended</span>
                                </label>
                                <label
                                    className={`dropzone${syllabusFile ? ' dropzone--selected' : ''}`}
                                    htmlFor='syllabus'
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        const file = e.dataTransfer.files[0]
                                        if (file && file.type === 'application/pdf') {
                                            const dt = new DataTransfer()
                                            dt.items.add(file)
                                            syllabusInputRef.current.files = dt.files
                                            setSyllabusFile(file)
                                            setFormError('')
                                        }
                                    }}
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dropzone--drag-over') }}
                                    onDragLeave={(e) => e.currentTarget.classList.remove('dropzone--drag-over')}
                                >
                                    <span className='dropzone__icon'>
                                        {syllabusFile
                                            ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                                        }
                                    </span>
                                    {syllabusFile
                                        ? <p className='dropzone__title' style={{ color: '#89ceff' }}>✓ {syllabusFile.name}</p>
                                        : <p className='dropzone__title'>Click to browse or drag &amp; drop</p>
                                    }
                                    <p className='dropzone__subtitle'>PDF (Max 3MB)</p>
                                    <input
                                        ref={syllabusInputRef}
                                        style={{ display: 'none' }}
                                        type='file'
                                        id='syllabus'
                                        accept='.pdf,application/pdf'
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (file) { setSyllabusFile(file); setFormError('') }
                                        }}
                                    />
                                </label>
                            </div>

                            <div className='or-divider'><span>OR</span></div>

                            <div className='self-description'>
                                <label className='section-label' htmlFor='syllabusText'>Paste Syllabus / Topics</label>
                                <textarea
                                    value={syllabusText}
                                    onChange={(e) => setSyllabusText(e.target.value)}
                                    id='syllabusText'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Paste your course topics, modules, or syllabus content here..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className='interview-card__footer'>
                        <div>
                            {formError && <p style={{ color: '#ffb4ab', marginBottom: '0.5rem', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>{formError}</p>}
                            <span className='footer-info'>Curriculum Gap Analysis &bull; ~30s</span>
                        </div>
                        <button onClick={handleAnalyzeCurriculum} className='generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                            Analyze Curriculum Gap
                        </button>
                    </div>
                </div>
            )}

            {/* Recent Reports List (Hidden in Pulse Mode) */}
            {appMode !== 'pulse' && reports?.length > 0 && (
                <section className='recent-reports'>
                    <h2>Recent Strategy Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className='report-item__top'>
                                    <h3>{report.title || 'Untitled Analysis'}</h3>
                                    <span className={`plan-badge ${report.planType === 'roadmap' ? 'badge--roadmap' : 'badge--interview'}`}>
                                        {report.planType === 'roadmap' ? 'Roadmap' : 'Interview'}
                                    </span>
                                </div>
                                <p className='report-meta'>{new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home