import { db, schema } from './connection.js';

const seedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@talenthub.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    },
    {
      username: 'recruiter',
      email: 'recruiter@talenthub.com',
      password: 'recruiter123',
      role: 'recruiter',
      firstName: 'John',
      lastName: 'Recruiter'
    },
    {
      username: 'candidate',
      email: 'candidate@example.com',
      password: 'candidate123',
      role: 'candidate',
      firstName: 'Jane',
      lastName: 'Candidate'
    }
  ],
  companies: [
    {
      name: 'Tech Corp',
      description: 'Leading technology company specializing in software development',
      website: 'https://techcorp.com',
      location: 'San Francisco, CA',
      industry: 'Technology',
      size: 'large'
    },
    {
      name: 'Marketing Plus',
      description: 'Full-service digital marketing agency',
      website: 'https://marketingplus.com',
      location: 'New York, NY',
      industry: 'Marketing',
      size: 'medium'
    },
    {
      name: 'StartupXYZ',
      description: 'Innovative startup disrupting the fintech space',
      website: 'https://startupxyz.com',
      location: 'Austin, TX',
      industry: 'Fintech',
      size: 'startup'
    }
  ],
  skills: [
    { name: 'JavaScript', category: 'technical' },
    { name: 'React', category: 'technical' },
    { name: 'Node.js', category: 'technical' },
    { name: 'Python', category: 'technical' },
    { name: 'SQL', category: 'technical' },
    { name: 'Communication', category: 'soft' },
    { name: 'Leadership', category: 'soft' },
    { name: 'Problem Solving', category: 'soft' },
    { name: 'Project Management', category: 'soft' },
    { name: 'English', category: 'language' },
    { name: 'Spanish', category: 'language' }
  ]
};

export async function seedDatabase() {
  try {
    console.log('Seeding database/* REPLACED_PLACEHOLDER */');
    
    // Insert users
    const insertedUsers = await db.insert(schema.users).values(seedData.users).returning();
    console.log(`Inserted ${insertedUsers.length} users`);
    
    // Insert companies
    const insertedCompanies = await db.insert(schema.companies).values(seedData.companies).returning();
    console.log(`Inserted ${insertedCompanies.length} companies`);
    
    // Insert skills
    const insertedSkills = await db.insert(schema.skills).values(seedData.skills).returning();
    console.log(`Inserted ${insertedSkills.length} skills`);
    
    // Insert sample jobs
    const sampleJobs = [
      {
        title: 'Senior Software Engineer',
        description: 'We are looking for a senior software engineer to join our team and help build the next generation of our platform.',
        requirements: JSON.stringify(['5+ years experience', 'JavaScript', 'React', 'Node.js', 'SQL']),
        location: 'San Francisco, CA',
        type: 'full-time',
        salaryMin: 120000,
        salaryMax: 150000,
        companyId: insertedCompanies[0].id,
        postedBy: insertedUsers[1].id // recruiter
      },
      {
        title: 'Marketing Manager',
        description: 'Join our marketing team as a manager and help drive our digital marketing initiatives.',
        requirements: JSON.stringify(['3+ years marketing experience', 'Digital marketing', 'Analytics', 'Communication']),
        location: 'New York, NY',
        type: 'full-time',
        salaryMin: 80000,
        salaryMax: 100000,
        companyId: insertedCompanies[1].id,
        postedBy: insertedUsers[1].id
      },
      {
        title: 'Frontend Developer',
        description: 'Looking for a talented frontend developer to create amazing user experiences.',
        requirements: JSON.stringify(['React', 'JavaScript', 'CSS', 'HTML', 'UI/UX']),
        location: 'Austin, TX',
        type: 'full-time',
        salaryMin: 70000,
        salaryMax: 90000,
        companyId: insertedCompanies[2].id,
        postedBy: insertedUsers[1].id
      }
    ];
    
    const insertedJobs = await db.insert(schema.jobs).values(sampleJobs).returning();
    console.log(`Inserted ${insertedJobs.length} jobs`);
    
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

