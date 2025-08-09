# TalentHub - Recruitment Agency Platform

A modern, full-stack recruitment agency web application built with React, Express.js, and PostgreSQL.

## Features

- **User Authentication**: Secure login system with role-based access (Admin, Recruiter, Candidate)
- **Job Management**: Post, edit, and manage job listings
- **Application Tracking**: Submit and track job applications
- **Dashboard**: Comprehensive dashboard for all user types
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Axios for API calls

### Backend
- Node.js
- Express.js
- Passport.js (authentication)
- Multer (file uploads)
- CORS enabled

### Database
- PostgreSQL
- Drizzle ORM
- Neon (for production)

## Project Structure

```
recruitment-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                # Express.js backend
│   ├── src/
│   │   └── db/           # Database schema and config
│   ├── uploads/          # File upload directory
│   ├── index.js          # Main server file
│   └── package.json
├── render.yaml           # Render deployment config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recruitment-app
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Demo Accounts

The application comes with pre-configured demo accounts:

- **Admin**: username: `admin`, password: `admin123`
- **Recruiter**: username: `recruiter`, password: `recruiter123`
- **Candidate**: username: `candidate`, password: `candidate123`

## Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Environment Variables**
   The following environment variables will be automatically configured:
   - `NODE_ENV`: production
   - `SESSION_SECRET`: auto-generated
   - `DATABASE_URL`: from Render PostgreSQL database

### Manual Deployment

If you prefer manual deployment:

1. **Backend Service**
   - Type: Web Service
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

2. **Frontend Service**
   - Type: Static Site
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### Applications
- `GET /api/applications` - Get applications (filtered by user role)
- `POST /api/applications` - Submit job application
- `PUT /api/applications/:id/status` - Update application status (recruiter only)

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `companies` - Company information
- `jobs` - Job postings
- `applications` - Job applications
- `skills` - Skills catalog
- `user_skills` - User skill associations
- `job_skills` - Job skill requirements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@talenthub.com or create an issue in the GitHub repository.

