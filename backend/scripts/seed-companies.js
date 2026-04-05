import dotenv from 'dotenv'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.SINGLESTORE_URL

if (!DATABASE_URL) {
  throw new Error('Missing SINGLESTORE_URL in environment.')
}

const pool = mysql.createPool(DATABASE_URL)

// Sample Companies Data (Real companies)
const companies = [
  {
    id: crypto.randomUUID(),
    name: 'Google',
    industry: 'Software Development',
    location: 'Mountain View, CA',
    description: 'Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.',
    website: 'https://google.com',
    logo: 'G',
    followers: 40000000,
    employeeCount: '100,000+',
    founded: '1998',
    specialties: JSON.stringify(['Search', 'Advertising', 'Cloud Computing', 'AI/ML', 'Android', 'YouTube', 'Chrome']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Amazon',
    industry: 'E-commerce & Cloud Computing',
    location: 'Seattle, WA',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
    website: 'https://amazon.com',
    logo: 'A',
    followers: 35000000,
    employeeCount: '1,500,000+',
    founded: '1994',
    specialties: JSON.stringify(['E-commerce', 'AWS', 'Alexa', 'Prime Video', 'Logistics', 'AI']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Microsoft',
    industry: 'Software Development',
    location: 'Redmond, WA',
    description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.',
    website: 'https://microsoft.com',
    logo: 'M',
    followers: 27000000,
    employeeCount: '200,000+',
    founded: '1975',
    specialties: JSON.stringify(['Windows', 'Azure', 'Office 365', 'LinkedIn', 'GitHub', 'Xbox', 'AI']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Meta',
    industry: 'Social Media & Technology',
    location: 'Menlo Park, CA',
    description: 'Meta Platforms, Inc., doing business as Meta, is an American multinational technology conglomerate. The company owns and operates Facebook, Instagram, Threads, and WhatsApp.',
    website: 'https://meta.com',
    logo: 'M',
    followers: 15000000,
    employeeCount: '70,000+',
    founded: '2004',
    specialties: JSON.stringify(['Social Media', 'VR/AR', 'Metaverse', 'Advertising', 'WhatsApp', 'Instagram']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Apple',
    industry: 'Consumer Electronics',
    location: 'Cupertino, CA',
    description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.',
    website: 'https://apple.com',
    logo: 'A',
    followers: 20000000,
    employeeCount: '160,000+',
    founded: '1976',
    specialties: JSON.stringify(['iPhone', 'Mac', 'iPad', 'Apple Watch', 'iOS', 'macOS', 'Services']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Netflix',
    industry: 'Entertainment & Streaming',
    location: 'Los Gatos, CA',
    description: 'Netflix, Inc. is an American subscription video on-demand over-the-top streaming service. The company offers film and television series through distribution deals as well as its own productions.',
    website: 'https://netflix.com',
    logo: 'N',
    followers: 12000000,
    employeeCount: '12,000+',
    founded: '1997',
    specialties: JSON.stringify(['Streaming', 'Original Content', 'Film Production', 'Entertainment']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Tesla',
    industry: 'Automotive & Clean Energy',
    location: 'Austin, TX',
    description: 'Tesla, Inc. is an American multinational automotive and clean energy company. Tesla designs and manufactures electric vehicles, battery energy storage, solar panels and related products.',
    website: 'https://tesla.com',
    logo: 'T',
    followers: 18000000,
    employeeCount: '130,000+',
    founded: '2003',
    specialties: JSON.stringify(['Electric Vehicles', 'Energy Storage', 'Solar', 'Autopilot', 'AI']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Grameenphone',
    industry: 'Telecommunications',
    location: 'Dhaka, Bangladesh',
    description: 'Grameenphone Ltd. is the leading telecommunications operator in Bangladesh. It is a joint venture between Telenor and Grameen Telecom Corporation.',
    website: 'https://grameenphone.com',
    logo: 'GP',
    followers: 2000000,
    employeeCount: '5,000+',
    founded: '1997',
    specialties: JSON.stringify(['Mobile Network', '4G/5G', 'Digital Services', 'IoT', 'Enterprise Solutions']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Robi Axiata',
    industry: 'Telecommunications',
    location: 'Dhaka, Bangladesh',
    description: 'Robi Axiata Limited is a Bangladeshi mobile network operator. It is a joint venture between Axiata Group Berhad and Bharti Airtel Limited.',
    website: 'https://robi.com.bd',
    logo: 'R',
    followers: 1500000,
    employeeCount: '3,000+',
    founded: '1997',
    specialties: JSON.stringify(['Mobile Network', '4G', 'Digital Services', 'Enterprise']),
  },
  {
    id: crypto.randomUUID(),
    name: 'bKash',
    industry: 'Financial Technology',
    location: 'Dhaka, Bangladesh',
    description: 'bKash Limited is a Bangladeshi mobile financial service provider. It is the largest mobile financial service in the country.',
    website: 'https://bkash.com',
    logo: 'bK',
    followers: 3000000,
    employeeCount: '2,000+',
    founded: '2011',
    specialties: JSON.stringify(['Mobile Banking', 'Digital Payments', 'Financial Services', 'Remittance']),
  },
]

// Sample Schools Data
const schools = [
  {
    id: crypto.randomUUID(),
    name: 'Bangladesh University of Engineering and Technology (BUET)',
    type: 'Public University',
    location: 'Dhaka, Bangladesh',
    description: 'BUET is the oldest and most prestigious institution for the study of engineering and architecture in Bangladesh. It is one of the most prestigious universities in Asia.',
    website: 'https://buet.ac.bd',
    logo: 'BUET',
    followers: 500000,
    founded: '1962',
    programs: JSON.stringify(['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Architecture']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Harvard University',
    type: 'Private University',
    location: 'Cambridge, MA',
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher learning in the United States.',
    website: 'https://harvard.edu',
    logo: 'H',
    followers: 8000000,
    founded: '1636',
    programs: JSON.stringify(['Law', 'Medicine', 'Business', 'Computer Science', 'Economics', 'Engineering']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Massachusetts Institute of Technology (MIT)',
    type: 'Private University',
    location: 'Cambridge, MA',
    description: 'MIT is a private research university in Cambridge, Massachusetts. The Institute is a land-grant, sea-grant, and space-grant university, with an urban campus.',
    website: 'https://mit.edu',
    logo: 'MIT',
    followers: 6000000,
    founded: '1861',
    programs: JSON.stringify(['Computer Science', 'Engineering', 'Physics', 'Mathematics', 'AI/ML', 'Robotics']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Stanford University',
    type: 'Private University',
    location: 'Stanford, CA',
    description: 'Stanford University, officially Leland Stanford Junior University, is a private research university in Stanford, California. The campus is one of the largest in the United States.',
    website: 'https://stanford.edu',
    logo: 'S',
    followers: 5500000,
    founded: '1885',
    programs: JSON.stringify(['Computer Science', 'Business', 'Law', 'Medicine', 'Engineering', 'AI']),
  },
  {
    id: crypto.randomUUID(),
    name: 'University of Dhaka',
    type: 'Public University',
    location: 'Dhaka, Bangladesh',
    description: 'The University of Dhaka is a public research university located in Dhaka, Bangladesh. It is the oldest and largest university in Bangladesh.',
    website: 'https://du.ac.bd',
    logo: 'DU',
    followers: 800000,
    founded: '1921',
    programs: JSON.stringify(['Arts', 'Science', 'Business', 'Law', 'Social Sciences', 'Engineering']),
  },
  {
    id: crypto.randomUUID(),
    name: 'North South University',
    type: 'Private University',
    location: 'Dhaka, Bangladesh',
    description: 'North South University is the first private university in Bangladesh. It was established in 1992 and offers undergraduate and graduate programs.',
    website: 'https://northsouth.edu',
    logo: 'NSU',
    followers: 300000,
    founded: '1992',
    programs: JSON.stringify(['Computer Science', 'Business', 'Engineering', 'Economics', 'Architecture']),
  },
  {
    id: crypto.randomUUID(),
    name: 'BRAC University',
    type: 'Private University',
    location: 'Dhaka, Bangladesh',
    description: 'BRAC University is a private research university in Dhaka, Bangladesh. Established in 2001 by BRAC, it has grown rapidly to become one of the leading universities in the country.',
    website: 'https://bracu.ac.bd',
    logo: 'BRACU',
    followers: 250000,
    founded: '2001',
    programs: JSON.stringify(['Computer Science', 'Engineering', 'Business', 'Law', 'Architecture', 'Pharmacy']),
  },
  {
    id: crypto.randomUUID(),
    name: 'Indian Institute of Technology (IIT) Bombay',
    type: 'Public University',
    location: 'Mumbai, India',
    description: 'IIT Bombay is a public technical university in Mumbai, India. It is one of the oldest and most prestigious engineering institutions in India.',
    website: 'https://iitb.ac.in',
    logo: 'IITB',
    followers: 2000000,
    founded: '1958',
    programs: JSON.stringify(['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering']),
  },
]

const seedData = async () => {
  console.log('🌱 Seeding companies and schools data...\n')

  try {
    // Insert companies
    console.log('📦 Inserting companies...')
    for (const company of companies) {
      try {
        await pool.query(
          `INSERT INTO companies (id, name, industry, location, description, website, logo, followers, employeeCount, founded, specialties, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = name`,
          [
            company.id,
            company.name,
            company.industry,
            company.location,
            company.description,
            company.website,
            company.logo,
            company.followers,
            company.employeeCount,
            company.founded,
            company.specialties,
            new Date(),
          ]
        )
        console.log(`  ✅ ${company.name}`)
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ⏭️  ${company.name} (already exists)`)
        } else {
          console.error(`  ❌ ${company.name}:`, error.message)
        }
      }
    }

    // Insert schools
    console.log('\n🎓 Inserting schools...')
    for (const school of schools) {
      try {
        await pool.query(
          `INSERT INTO schools (id, name, type, location, description, website, logo, followers, founded, programs, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = name`,
          [
            school.id,
            school.name,
            school.type,
            school.location,
            school.description,
            school.website,
            school.logo,
            school.followers,
            school.founded,
            school.programs,
            new Date(),
          ]
        )
        console.log(`  ✅ ${school.name}`)
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ⏭️  ${school.name} (already exists)`)
        } else {
          console.error(`  ❌ ${school.name}:`, error.message)
        }
      }
    }

    console.log('\n✨ Seeding completed!')
    console.log(`   Companies: ${companies.length}`)
    console.log(`   Schools: ${schools.length}`)
    
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

seedData()
