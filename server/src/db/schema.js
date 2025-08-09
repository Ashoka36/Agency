import { pgTable, serial, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('candidate'), // 'admin', 'recruiter', 'candidate'
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  website: varchar('website', { length: 255 }),
  location: varchar('location', { length: 100 }),
  industry: varchar('industry', { length: 50 }),
  size: varchar('size', { length: 20 }), // 'startup', 'small', 'medium', 'large', 'enterprise'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'), // JSON string of requirements array
  location: varchar('location', { length: 100 }),
  type: varchar('type', { length: 20 }).notNull().default('full-time'), // 'full-time', 'part-time', 'contract', 'internship'
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: varchar('salary_currency', { length: 3 }).default('USD'),
  companyId: integer('company_id').references(() => companies.id),
  postedBy: integer('posted_by').references(() => users.id).notNull(),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').references(() => jobs.id).notNull(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  coverLetter: text('cover_letter'),
  resumeFile: varchar('resume_file', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'reviewed', 'accepted', 'rejected'
  notes: text('notes'), // Internal notes from recruiters
  appliedAt: timestamp('applied_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  category: varchar('category', { length: 30 }), // 'technical', 'soft', 'language', etc.
  createdAt: timestamp('created_at').defaultNow(),
});

export const userSkills = pgTable('user_skills', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  skillId: integer('skill_id').references(() => skills.id).notNull(),
  level: varchar('level', { length: 20 }), // 'beginner', 'intermediate', 'advanced', 'expert'
  yearsOfExperience: integer('years_of_experience'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const jobSkills = pgTable('job_skills', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').references(() => jobs.id).notNull(),
  skillId: integer('skill_id').references(() => skills.id).notNull(),
  required: boolean('required').default(false),
  level: varchar('level', { length: 20 }), // 'beginner', 'intermediate', 'advanced', 'expert'
  createdAt: timestamp('created_at').defaultNow(),
});

