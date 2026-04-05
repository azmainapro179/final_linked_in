import dotenv from 'dotenv'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.SINGLESTORE_URL

if (!DATABASE_URL) {
  throw new Error('Missing SINGLESTORE_URL in environment.')
}

const pool = mysql.createPool(DATABASE_URL)

const hashPassword = (value) =>
  crypto.createHash('sha256').update(value).digest('hex')

// Sample users with real-looking profiles
const sampleUsers = [
  {
    fullName: 'Rahul Ahmed',
    email: 'rahul.ahmed@gmail.com',
    headline: 'Software Engineer at Google',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Google', title: 'Software Engineer', start: '2022-01', end: '', current: true },
        { company: 'Microsoft', title: 'Junior Developer', start: '2020-06', end: '2021-12', current: false }
      ],
      education: [
        { school: 'Bangladesh University of Engineering and Technology (BUET)', degree: 'Bachelors', field: 'Computer Science and Engineering' }
      ],
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning'],
      interests: ['AI', 'Cloud Computing', 'Open Source']
    }
  },
  {
    fullName: 'Fatima Khan',
    email: 'fatima.khan@outlook.com',
    headline: 'Data Scientist at Amazon',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Amazon', title: 'Data Scientist', start: '2021-03', end: '', current: true },
        { company: 'bKash', title: 'ML Engineer', start: '2019-01', end: '2021-02', current: false }
      ],
      education: [
        { school: 'Massachusetts Institute of Technology (MIT)', degree: 'Masters', field: 'Data Science' },
        { school: 'Bangladesh University of Engineering and Technology (BUET)', degree: 'Bachelors', field: 'Electrical Engineering' }
      ],
      skills: ['Python', 'TensorFlow', 'AWS', 'SQL', 'Data Analytics'],
      interests: ['Machine Learning', 'Big Data', 'FinTech']
    }
  },
  {
    fullName: 'Tanvir Hasan',
    email: 'tanvir.hasan@yahoo.com',
    headline: 'Product Manager at Microsoft',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Microsoft', title: 'Product Manager', start: '2020-09', end: '', current: true },
        { company: 'Grameenphone', title: 'Business Analyst', start: '2018-06', end: '2020-08', current: false }
      ],
      education: [
        { school: 'Harvard University', degree: 'MBA', field: 'Business Administration' },
        { school: 'University of Dhaka', degree: 'Bachelors', field: 'Business Studies' }
      ],
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership', 'UX Design'],
      interests: ['Product Development', 'Startups', 'Tech Innovation']
    }
  },
  {
    fullName: 'Ayesha Rahman',
    email: 'ayesha.rahman@gmail.com',
    headline: 'Frontend Developer at Meta',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Meta', title: 'Frontend Developer', start: '2023-01', end: '', current: true },
        { company: 'Netflix', title: 'UI Developer', start: '2021-06', end: '2022-12', current: false }
      ],
      education: [
        { school: 'Stanford University', degree: 'Masters', field: 'Computer Science' },
        { school: 'North South University', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Design Systems'],
      interests: ['Web Development', 'UI/UX', 'Accessibility']
    }
  },
  {
    fullName: 'Imran Chowdhury',
    email: 'imran.chowdhury@gmail.com',
    headline: 'DevOps Engineer at Tesla',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Tesla', title: 'DevOps Engineer', start: '2022-06', end: '', current: true },
        { company: 'Google', title: 'Site Reliability Engineer', start: '2020-01', end: '2022-05', current: false }
      ],
      education: [
        { school: 'Bangladesh University of Engineering and Technology (BUET)', degree: 'Bachelors', field: 'Computer Science and Engineering' }
      ],
      skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Python', 'Go'],
      interests: ['Cloud Infrastructure', 'Automation', 'Electric Vehicles']
    }
  },
  {
    fullName: 'Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    headline: 'Research Scientist at Google DeepMind',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Google DeepMind', title: 'Research Scientist', start: '2021-09', end: '', current: true },
        { company: 'OpenAI', title: 'ML Researcher', start: '2019-06', end: '2021-08', current: false }
      ],
      education: [
        { school: 'Massachusetts Institute of Technology (MIT)', degree: 'PhD', field: 'Artificial Intelligence' },
        { school: 'Bangladesh University of Engineering and Technology (BUET)', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Deep Learning', 'PyTorch', 'Research', 'NLP', 'Computer Vision'],
      interests: ['AGI', 'AI Safety', 'Neural Networks']
    }
  },
  {
    fullName: 'Karim Uddin',
    email: 'karim.uddin@gmail.com',
    headline: 'Backend Engineer at Amazon',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Amazon', title: 'Backend Engineer', start: '2020-03', end: '', current: true },
        { company: 'Robi Axiata', title: 'Software Developer', start: '2018-01', end: '2020-02', current: false }
      ],
      education: [
        { school: 'BRAC University', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Java', 'AWS', 'Microservices', 'DynamoDB', 'System Design'],
      interests: ['Distributed Systems', 'Cloud Architecture', 'Fintech']
    }
  },
  {
    fullName: 'Sadia Islam',
    email: 'sadia.islam@gmail.com',
    headline: 'UX Designer at Apple',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Apple', title: 'UX Designer', start: '2022-08', end: '', current: true },
        { company: 'Spotify', title: 'Product Designer', start: '2020-03', end: '2022-07', current: false }
      ],
      education: [
        { school: 'Stanford University', degree: 'Masters', field: 'Human-Computer Interaction' },
        { school: 'University of Dhaka', degree: 'Bachelors', field: 'Fine Arts' }
      ],
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Thinking', 'Sketch'],
      interests: ['Product Design', 'Accessibility', 'Design Systems']
    }
  },
  {
    fullName: 'Arif Hossain',
    email: 'arif.hossain@gmail.com',
    headline: 'Engineering Manager at Netflix',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Netflix', title: 'Engineering Manager', start: '2021-01', end: '', current: true },
        { company: 'Google', title: 'Senior Software Engineer', start: '2017-06', end: '2020-12', current: false },
        { company: 'Microsoft', title: 'Software Engineer', start: '2014-01', end: '2017-05', current: false }
      ],
      education: [
        { school: 'Harvard University', degree: 'Masters', field: 'Computer Science' },
        { school: 'Bangladesh University of Engineering and Technology (BUET)', degree: 'Bachelors', field: 'Computer Science and Engineering' }
      ],
      skills: ['Leadership', 'System Design', 'Java', 'Microservices', 'Team Management'],
      interests: ['Engineering Leadership', 'Mentorship', 'Tech Strategy']
    }
  },
  {
    fullName: 'Mariam Sultana',
    email: 'mariam.sultana@gmail.com',
    headline: 'Cloud Architect at Google Cloud',
    password: 'test123',
    profile: {
      workHistory: [
        { company: 'Google Cloud', title: 'Cloud Architect', start: '2020-06', end: '', current: true },
        { company: 'Amazon Web Services', title: 'Solutions Architect', start: '2018-01', end: '2020-05', current: false }
      ],
      education: [
        { school: 'Indian Institute of Technology (IIT) Bombay', degree: 'Masters', field: 'Computer Science' },
        { school: 'Bangladesh University of Engineering and Technology (BUET)', degree: 'Bachelors', field: 'Electrical Engineering' }
      ],
      skills: ['GCP', 'AWS', 'Terraform', 'Kubernetes', 'Cloud Security'],
      interests: ['Cloud Computing', 'Multi-Cloud', 'Infrastructure as Code']
    }
  }
]

const seedUsers = async () => {
  console.log('👥 Seeding sample users with profiles...\n')

  try {
    for (const user of sampleUsers) {
      try {
        const userId = crypto.randomUUID()
        const now = new Date()
        
        // Check if user already exists
        const [existing] = await pool.query(
          'SELECT id FROM users WHERE email = ? LIMIT 1',
          [user.email.toLowerCase()]
        )

        await pool.query(
          `INSERT INTO users (id, email, fullName, headline, passwordHash, profile, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             fullName = VALUES(fullName),
             headline = VALUES(headline),
             profile = VALUES(profile),
             updatedAt = VALUES(updatedAt)`,
          [
            userId,
            user.email.toLowerCase(),
            user.fullName,
            user.headline,
            hashPassword(user.password),
            JSON.stringify(user.profile),
            now,
            now,
          ]
        )

        // If user is new, add to connections table
        if (!existing.length) {
          await pool.query(
            `INSERT INTO connections (id, pending, connected, invited) VALUES (?, ?, ?, ?)`,
            [
              userId,
              JSON.stringify([]),
              JSON.stringify([]),
              JSON.stringify([])
            ]
          )
        }

        console.log(`  ✅ ${user.fullName} - ${user.headline}`)
      } catch (error) {
        console.error(`  ❌ ${user.fullName}:`, error.message)
      }
    }

    console.log('\n✨ Sample users seeded successfully!')
    console.log(`   Total users: ${sampleUsers.length}`)
    console.log('\n📋 Test searches:')
    console.log('   - "BUET" → Shows BUET + people who studied at BUET')
    console.log('   - "Google" → Shows Google + people who work at Google')
    console.log('   - "Harvard" → Shows Harvard + people who studied at Harvard')
    console.log('   - "Amazon" → Shows Amazon + people who work at Amazon')
    
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

seedUsers()
