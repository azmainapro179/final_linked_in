import dotenv from 'dotenv'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'
///dummy data for 20 users chaile delete kora jabe ei file ta
dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.SINGLESTORE_URL

if (!DATABASE_URL) {
  throw new Error('Missing SINGLESTORE_URL in environment.')
}

const pool = mysql.createPool(DATABASE_URL)

const hashPassword = (value) =>
  crypto.createHash('sha256').update(value).digest('hex')

// 20 Realistic Dummy Users
const dummyUsers = [
  {
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    password: 'password123',
    headline: 'Senior Software Engineer at Google',
    profile: {
      workHistory: [
        { company: 'Google', title: 'Senior Software Engineer', start: '2021-03', end: '', current: true },
        { company: 'Microsoft', title: 'Software Engineer', start: '2018-06', end: '2021-02', current: false }
      ],
      education: [
        { school: 'IIT Delhi', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning'],
      interests: ['AI/ML', 'Cloud Computing', 'Open Source']
    }
  },
  {
    fullName: 'Priya Patel',
    email: 'priya.patel@outlook.com',
    password: 'password123',
    headline: 'Product Manager at Amazon',
    profile: {
      workHistory: [
        { company: 'Amazon', title: 'Product Manager', start: '2020-01', end: '', current: true },
        { company: 'Flipkart', title: 'Associate Product Manager', start: '2017-07', end: '2019-12', current: false }
      ],
      education: [
        { school: 'IIM Bangalore', degree: 'Masters', field: 'Business Administration' },
        { school: 'NIT Trichy', degree: 'Bachelors', field: 'Electronics Engineering' }
      ],
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'SQL'],
      interests: ['E-commerce', 'Consumer Tech', 'Startups']
    }
  },
  {
    fullName: 'Arjun Mehta',
    email: 'arjun.mehta@yahoo.com',
    password: 'password123',
    headline: 'Data Scientist at Netflix',
    profile: {
      workHistory: [
        { company: 'Netflix', title: 'Data Scientist', start: '2022-05', end: '', current: true },
        { company: 'Uber', title: 'Data Analyst', start: '2019-08', end: '2022-04', current: false }
      ],
      education: [
        { school: 'Stanford University', degree: 'Masters', field: 'Data Science' },
        { school: 'BITS Pilani', degree: 'Bachelors', field: 'Mathematics' }
      ],
      skills: ['Python', 'TensorFlow', 'SQL', 'Tableau', 'Statistics'],
      interests: ['Recommendation Systems', 'Deep Learning', 'Analytics']
    }
  },
  {
    fullName: 'Sneha Gupta',
    email: 'sneha.gupta@hotmail.com',
    password: 'password123',
    headline: 'UX Designer at Apple',
    profile: {
      workHistory: [
        { company: 'Apple', title: 'Senior UX Designer', start: '2021-09', end: '', current: true },
        { company: 'Adobe', title: 'UX Designer', start: '2018-03', end: '2021-08', current: false }
      ],
      education: [
        { school: 'Parsons School of Design', degree: 'Masters', field: 'Design and Technology' },
        { school: 'NIFT Delhi', degree: 'Bachelors', field: 'Design' }
      ],
      skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
      interests: ['Human-Computer Interaction', 'Accessibility', 'Design Systems']
    }
  },
  {
    fullName: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    password: 'password123',
    headline: 'DevOps Engineer at Meta',
    profile: {
      workHistory: [
        { company: 'Meta', title: 'DevOps Engineer', start: '2020-11', end: '', current: true },
        { company: 'Infosys', title: 'System Administrator', start: '2016-06', end: '2020-10', current: false }
      ],
      education: [
        { school: 'Delhi University', degree: 'Bachelors', field: 'Information Technology' }
      ],
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Linux'],
      interests: ['Cloud Infrastructure', 'Automation', 'Site Reliability']
    }
  },
  {
    fullName: 'Ananya Reddy',
    email: 'ananya.reddy@gmail.com',
    password: 'password123',
    headline: 'Frontend Developer at Spotify',
    profile: {
      workHistory: [
        { company: 'Spotify', title: 'Frontend Developer', start: '2022-02', end: '', current: true },
        { company: 'Swiggy', title: 'Junior Developer', start: '2019-07', end: '2022-01', current: false }
      ],
      education: [
        { school: 'VIT Vellore', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'GraphQL'],
      interests: ['Web Performance', 'Accessibility', 'Music Tech']
    }
  },
  {
    fullName: 'Kabir Khan',
    email: 'kabir.khan@outlook.com',
    password: 'password123',
    headline: 'Backend Engineer at Stripe',
    profile: {
      workHistory: [
        { company: 'Stripe', title: 'Backend Engineer', start: '2021-04', end: '', current: true },
        { company: 'Razorpay', title: 'Software Developer', start: '2018-08', end: '2021-03', current: false }
      ],
      education: [
        { school: 'IIT Bombay', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Java', 'Go', 'PostgreSQL', 'Redis', 'Microservices'],
      interests: ['FinTech', 'Distributed Systems', 'Payment Infrastructure']
    }
  },
  {
    fullName: 'Meera Iyer',
    email: 'meera.iyer@gmail.com',
    password: 'password123',
    headline: 'Machine Learning Engineer at OpenAI',
    profile: {
      workHistory: [
        { company: 'OpenAI', title: 'ML Engineer', start: '2023-01', end: '', current: true },
        { company: 'DeepMind', title: 'Research Engineer', start: '2020-06', end: '2022-12', current: false }
      ],
      education: [
        { school: 'MIT', degree: 'PhD', field: 'Artificial Intelligence' },
        { school: 'IISc Bangalore', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Python'],
      interests: ['Large Language Models', 'AI Safety', 'Research']
    }
  },
  {
    fullName: 'Rohan Joshi',
    email: 'rohan.joshi@yahoo.com',
    password: 'password123',
    headline: 'Full Stack Developer at Shopify',
    profile: {
      workHistory: [
        { company: 'Shopify', title: 'Full Stack Developer', start: '2021-07', end: '', current: true },
        { company: 'TCS', title: 'Developer', start: '2018-01', end: '2021-06', current: false }
      ],
      education: [
        { school: 'Pune University', degree: 'Bachelors', field: 'Computer Engineering' }
      ],
      skills: ['Ruby on Rails', 'React', 'PostgreSQL', 'GraphQL', 'Redis'],
      interests: ['E-commerce', 'Performance Optimization', 'Open Source']
    }
  },
  {
    fullName: 'Kavitha Nair',
    email: 'kavitha.nair@gmail.com',
    password: 'password123',
    headline: 'Security Engineer at Cloudflare',
    profile: {
      workHistory: [
        { company: 'Cloudflare', title: 'Security Engineer', start: '2022-03', end: '', current: true },
        { company: 'Cisco', title: 'Network Security Analyst', start: '2019-05', end: '2022-02', current: false }
      ],
      education: [
        { school: 'Anna University', degree: 'Masters', field: 'Cybersecurity' },
        { school: 'PSG Tech', degree: 'Bachelors', field: 'Information Technology' }
      ],
      skills: ['Penetration Testing', 'Network Security', 'Python', 'Wireshark', 'SIEM'],
      interests: ['Cybersecurity', 'Ethical Hacking', 'Zero Trust']
    }
  },
  {
    fullName: 'Aditya Verma',
    email: 'aditya.verma@outlook.com',
    password: 'password123',
    headline: 'iOS Developer at Uber',
    profile: {
      workHistory: [
        { company: 'Uber', title: 'Senior iOS Developer', start: '2020-09', end: '', current: true },
        { company: 'Ola', title: 'iOS Developer', start: '2017-06', end: '2020-08', current: false }
      ],
      education: [
        { school: 'IIIT Hyderabad', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Swift', 'Objective-C', 'SwiftUI', 'Xcode', 'Core Data'],
      interests: ['Mobile Development', 'AR/VR', 'App Architecture']
    }
  },
  {
    fullName: 'Nisha Chopra',
    email: 'nisha.chopra@gmail.com',
    password: 'password123',
    headline: 'Technical Program Manager at Microsoft',
    profile: {
      workHistory: [
        { company: 'Microsoft', title: 'Technical Program Manager', start: '2021-02', end: '', current: true },
        { company: 'Accenture', title: 'Project Manager', start: '2017-09', end: '2021-01', current: false }
      ],
      education: [
        { school: 'IIM Ahmedabad', degree: 'Masters', field: 'Business Administration' },
        { school: 'Mumbai University', degree: 'Bachelors', field: 'Engineering' }
      ],
      skills: ['Program Management', 'Agile', 'Scrum', 'Stakeholder Management', 'Azure'],
      interests: ['Leadership', 'Tech Strategy', 'Digital Transformation']
    }
  },
  {
    fullName: 'Siddharth Menon',
    email: 'siddharth.menon@gmail.com',
    password: 'password123',
    headline: 'Android Developer at WhatsApp',
    profile: {
      workHistory: [
        { company: 'WhatsApp', title: 'Android Developer', start: '2022-06', end: '', current: true },
        { company: 'PhonePe', title: 'Mobile Developer', start: '2019-03', end: '2022-05', current: false }
      ],
      education: [
        { school: 'NIT Calicut', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Kotlin', 'Java', 'Android SDK', 'Jetpack Compose', 'Firebase'],
      interests: ['Mobile Apps', 'Privacy Tech', 'Messaging Platforms']
    }
  },
  {
    fullName: 'Divya Krishnan',
    email: 'divya.krishnan@yahoo.com',
    password: 'password123',
    headline: 'Cloud Architect at AWS',
    profile: {
      workHistory: [
        { company: 'AWS', title: 'Cloud Architect', start: '2021-08', end: '', current: true },
        { company: 'Wipro', title: 'Cloud Engineer', start: '2017-04', end: '2021-07', current: false }
      ],
      education: [
        { school: 'BITS Pilani', degree: 'Masters', field: 'Software Engineering' },
        { school: 'Jadavpur University', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['AWS', 'Serverless', 'Lambda', 'DynamoDB', 'CloudFormation'],
      interests: ['Cloud Computing', 'Serverless Architecture', 'Cost Optimization']
    }
  },
  {
    fullName: 'Harsh Agarwal',
    email: 'harsh.agarwal@gmail.com',
    password: 'password123',
    headline: 'Blockchain Developer at Coinbase',
    profile: {
      workHistory: [
        { company: 'Coinbase', title: 'Blockchain Developer', start: '2022-01', end: '', current: true },
        { company: 'Polygon', title: 'Smart Contract Developer', start: '2020-03', end: '2021-12', current: false }
      ],
      education: [
        { school: 'IIT Kanpur', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Solidity', 'Ethereum', 'Web3.js', 'Rust', 'Smart Contracts'],
      interests: ['DeFi', 'Cryptocurrency', 'Web3']
    }
  },
  {
    fullName: 'Pooja Sharma',
    email: 'pooja.sharma@hotmail.com',
    password: 'password123',
    headline: 'QA Engineer at Atlassian',
    profile: {
      workHistory: [
        { company: 'Atlassian', title: 'Senior QA Engineer', start: '2021-05', end: '', current: true },
        { company: 'Freshworks', title: 'QA Engineer', start: '2018-08', end: '2021-04', current: false }
      ],
      education: [
        { school: 'SRM University', degree: 'Bachelors', field: 'Information Technology' }
      ],
      skills: ['Selenium', 'Cypress', 'Jira', 'Test Automation', 'API Testing'],
      interests: ['Quality Assurance', 'Test Automation', 'Agile Testing']
    }
  },
  {
    fullName: 'Nikhil Desai',
    email: 'nikhil.desai@gmail.com',
    password: 'password123',
    headline: 'Site Reliability Engineer at LinkedIn',
    profile: {
      workHistory: [
        { company: 'LinkedIn', title: 'SRE', start: '2020-10', end: '', current: true },
        { company: 'PayPal', title: 'DevOps Engineer', start: '2017-07', end: '2020-09', current: false }
      ],
      education: [
        { school: 'IIT Madras', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Kubernetes', 'Prometheus', 'Grafana', 'Python', 'Incident Management'],
      interests: ['Reliability Engineering', 'Observability', 'Chaos Engineering']
    }
  },
  {
    fullName: 'Ritu Saxena',
    email: 'ritu.saxena@outlook.com',
    password: 'password123',
    headline: 'Data Engineer at Airbnb',
    profile: {
      workHistory: [
        { company: 'Airbnb', title: 'Data Engineer', start: '2021-11', end: '', current: true },
        { company: 'Zomato', title: 'Data Analyst', start: '2018-05', end: '2021-10', current: false }
      ],
      education: [
        { school: 'ISI Kolkata', degree: 'Masters', field: 'Statistics' },
        { school: 'St. Xaviers College', degree: 'Bachelors', field: 'Mathematics' }
      ],
      skills: ['Apache Spark', 'Airflow', 'SQL', 'Python', 'Data Warehousing'],
      interests: ['Big Data', 'ETL Pipelines', 'Data Architecture']
    }
  },
  {
    fullName: 'Amit Bose',
    email: 'amit.bose@gmail.com',
    password: 'password123',
    headline: 'Technical Lead at Salesforce',
    profile: {
      workHistory: [
        { company: 'Salesforce', title: 'Technical Lead', start: '2020-04', end: '', current: true },
        { company: 'Oracle', title: 'Senior Developer', start: '2015-08', end: '2020-03', current: false }
      ],
      education: [
        { school: 'BITS Pilani', degree: 'Masters', field: 'Computer Science' },
        { school: 'Calcutta University', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Java', 'Apex', 'Salesforce', 'Lightning', 'Integration'],
      interests: ['CRM', 'Enterprise Software', 'Team Leadership']
    }
  },
  {
    fullName: 'Shreya Mishra',
    email: 'shreya.mishra@yahoo.com',
    password: 'password123',
    headline: 'AI Research Scientist at NVIDIA',
    profile: {
      workHistory: [
        { company: 'NVIDIA', title: 'AI Research Scientist', start: '2022-08', end: '', current: true },
        { company: 'Samsung Research', title: 'Research Engineer', start: '2019-06', end: '2022-07', current: false }
      ],
      education: [
        { school: 'Carnegie Mellon University', degree: 'PhD', field: 'Machine Learning' },
        { school: 'IIT Kharagpur', degree: 'Bachelors', field: 'Computer Science' }
      ],
      skills: ['Deep Learning', 'CUDA', 'PyTorch', 'Computer Vision', 'C++'],
      interests: ['Generative AI', 'GPU Computing', 'Research Papers']
    }
  }
]

const seedUsers = async () => {
  console.log('🌱 Starting to seed 20 realistic users...\n')

  let successCount = 0
  let skipCount = 0

  for (const user of dummyUsers) {
    const normalizedEmail = user.email.trim().toLowerCase()

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT email FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    )

    if (existing.length) {
      console.log(`⏭️  Skipped: ${user.fullName} (${user.email}) - already exists`)
      skipCount++
      continue
    }

    const userId = crypto.randomUUID()
    const now = new Date()
    await pool.query(
      `INSERT INTO users (id, email, fullName, headline, passwordHash, profile, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        normalizedEmail,
        user.fullName,
        user.headline,
        hashPassword(user.password),
        JSON.stringify(user.profile),
        now,
        now
      ]
    )

    // Add user to connections table with empty pending and connected arrays
    await pool.query(
      `INSERT INTO connections (id, pending, connected, invited) VALUES (?, ?, ?, ?)`,
      [
        userId,
        JSON.stringify([]),
        JSON.stringify([]),
        JSON.stringify([])
      ]
    )

    console.log(`✅ Added: ${user.fullName} - ${user.headline}`)
    successCount++
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Added: ${successCount} users`)
  console.log(`   ⏭️  Skipped: ${skipCount} users (already existed)`)
  console.log('\n🎉 Seeding complete!')

  await pool.end()
  process.exit(0)
}

seedUsers().catch((error) => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
})
