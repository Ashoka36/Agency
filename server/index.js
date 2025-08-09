const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'recruitment-agency-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Mock user database (replace with real database)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'recruiter', password: 'recruiter123', role: 'recruiter' },
  { id: 3, username: 'candidate', password: 'candidate123', role: 'candidate' }
];

// Mock jobs database
let jobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'We are looking for a senior software engineer to join our team/* REPLACED_PLACEHOLDER */',
    requirements: ['5+ years experience', 'JavaScript', 'React', 'Node.js'],
    postedBy: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Marketing Manager',
    company: 'Marketing Plus',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$80,000 - $100,000',
    description: 'Join our marketing team as a manager/* REPLACED_PLACEHOLDER */',
    requirements: ['3+ years marketing experience', 'Digital marketing', 'Analytics'],
    postedBy: 2,
    createdAt: new Date().toISOString()
  }
];

// Mock applications database
let applications = [];

// Passport Local Strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return done(null, user);
    }
    return done(null, false, { message: 'Invalid credentials' });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403).json({ error: 'Insufficient permissions' });
  };
};

// Routes

// Authentication routes
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({ 
    success: true, 
    user: { 
      id: req.user.id, 
      username: req.user.username, 
      role: req.user.role 
    } 
  });
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ 
    user: { 
      id: req.user.id, 
      username: req.user.username, 
      role: req.user.role 
    } 
  });
});

// Job routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

app.post('/api/jobs', requireAuth, requireRole('recruiter'), (req, res) => {
  const newJob = {
    id: jobs.length + 1,
    /* REPLACED_PLACEHOLDER */req.body,
    postedBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', requireAuth, requireRole('recruiter'), (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  jobs[jobIndex] = { /* REPLACED_PLACEHOLDER */jobs[jobIndex], /* REPLACED_PLACEHOLDER */req.body };
  res.json(jobs[jobIndex]);
});

app.delete('/api/jobs/:id', requireAuth, requireRole('recruiter'), (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  jobs.splice(jobIndex, 1);
  res.json({ success: true });
});

// Application routes
app.get('/api/applications', requireAuth, (req, res) => {
  let userApplications = applications;
  
  if (req.user.role === 'candidate') {
    userApplications = applications.filter(app => app.candidateId === req.user.id);
  } else if (req.user.role === 'recruiter') {
    const recruiterJobs = jobs.filter(job => job.postedBy === req.user.id);
    const recruiterJobIds = recruiterJobs.map(job => job.id);
    userApplications = applications.filter(app => recruiterJobIds.includes(app.jobId));
  }
  
  res.json(userApplications);
});

app.post('/api/applications', requireAuth, upload.single('resume'), (req, res) => {
  const newApplication = {
    id: applications.length + 1,
    jobId: parseInt(req.body.jobId),
    candidateId: req.user.id,
    candidateName: req.user.username,
    email: req.body.email,
    phone: req.body.phone,
    coverLetter: req.body.coverLetter,
    resumeFile: req.file ? req.file.filename : null,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  res.status(201).json(newApplication);
});

app.put('/api/applications/:id/status', requireAuth, requireRole('recruiter'), (req, res) => {
  const applicationIndex = applications.findIndex(app => app.id === parseInt(req.params.id));
  if (applicationIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  applications[applicationIndex].status = req.body.status;
  res.json(applications[applicationIndex]);
});

// File serving for resumes
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from client build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

