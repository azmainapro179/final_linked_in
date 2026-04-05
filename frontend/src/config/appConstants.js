export const starterForm = {
  fullName: '',
  email: '',
  password: '',
  headline: '',
}

export const emptyProfile = {
  workHistory: [{ company: '', title: '', start: '', end: '', current: false }],
  education: [{ school: '', degree: 'Bachelors', field: '' }],
  skills: [],
  interests: [],
}

export const highlights = [
  'Tailored feed to showcase your professional story.',
  'Chat-ready messaging that stays in sync across devices.',
  'Secure auth with instant feedback for new members.',
]

export const homeFeedPosts = [
  {
    id: 'post-1',
    author: 'Career Growth Bangladesh',
    meta: 'Suggested for you',
    headline: 'How to write a better first message to a recruiter',
    body:
      'Keep it short, mention the role clearly, and give one reason you are a good match. This feed card is intentionally dummy content for the homepage layout.',
    imageTitle: 'Simple outreach beats long introductions',
  },
  {
    id: 'post-2',
    author: 'LinkedIn Learning Circle',
    meta: 'Learning spotlight',
    headline: 'Three profile sections that help candidates get noticed',
    body:
      'A sharp headline, specific work history, and a clean skills list make it easier for recruiters and companies to understand what you do quickly.',
    imageTitle: 'Headline + experience + skills',
  },
]

export const feedSuggestions = [
  { id: 'suggestion-1', name: 'bKash Limited', caption: 'Company · Financial Services' },
  { id: 'suggestion-2', name: 'Google', caption: 'Company · Software Development' },
  { id: 'suggestion-3', name: 'Dhaka University', caption: 'School · Education' },
]

export const searchFilters = [
  { id: 'all', label: 'All', icon: '🔍', available: true },
  { id: 'people', label: 'People', icon: '👥', available: true },
  { id: 'companies', label: 'Companies', icon: '🏢', available: true },
  { id: 'schools', label: 'Schools', icon: '🎓', available: true },
  { id: 'jobs', label: 'Jobs', icon: '💼', available: true },
  { id: 'myNetwork', label: 'My Network', icon: '🌐', available: true },
  { id: 'posts', label: 'Posts', icon: '📝', available: false },
  { id: 'groups', label: 'Groups', icon: '👨‍👩‍👧‍👦', available: false },
  { id: 'events', label: 'Events', icon: '📅', available: false },
  { id: 'services', label: 'Services', icon: '🛠️', available: false },
]
