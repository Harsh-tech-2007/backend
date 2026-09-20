const express = require('express')
const authRouter = require('./routes/auth_route');
const interviewRouter = require('./routes/interview_route');
const curriculumRouter = require('./routes/curriculum_route');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
    "https://mathiverse.in",
    "https://www.mathiverse.in"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/curriculum', curriculumRouter);

// 404 handler for undefined API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

module.exports = app;
