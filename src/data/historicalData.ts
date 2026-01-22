import { HistoricalEvent, HistoricalPeriod, Ruler } from '../store/slices/historySlice';

export const historicalEvents: HistoricalEvent[] = [
  // Ancient India
  {
    id: '1',
    title: 'Indus Valley Civilization',
    description: 'One of the world\'s earliest urban civilizations, known for advanced city planning and drainage systems.',
    date: '3300-1300 BCE',
    year: -3300,
    category: 'ancient',
    region: 'india',
    latitude: 27.1767,
    longitude: 78.0081,
    significance: 'First major civilization in the Indian subcontinent with advanced urban planning.',
    imageUrl: 'https://example.com/indus-valley.jpg'
  },
  {
    id: '2',
    title: 'Mauryan Empire Founded',
    description: 'Chandragupta Maurya established the Mauryan Empire, the first pan-Indian empire.',
    date: '321 BCE',
    year: -321,
    category: 'ancient',
    region: 'india',
    latitude: 25.5941,
    longitude: 85.1376,
    rulers: ['Chandragupta Maurya'],
    significance: 'First unified empire covering most of the Indian subcontinent.',
  },
  {
    id: '3',
    title: 'Ashoka\'s Kalinga War',
    description: 'Emperor Ashoka\'s conquest of Kalinga, which led to his conversion to Buddhism.',
    date: '261 BCE',
    year: -261,
    category: 'ancient',
    region: 'india',
    latitude: 20.9517,
    longitude: 85.0985,
    rulers: ['Ashoka'],
    significance: 'Marked Ashoka\'s transformation and spread of Buddhism.',
  },
  // Medieval India
  {
    id: '4',
    title: 'Delhi Sultanate Established',
    description: 'Qutb-ud-din Aibak established the Delhi Sultanate, beginning Muslim rule in North India.',
    date: '1206 CE',
    year: 1206,
    category: 'medieval',
    region: 'india',
    latitude: 28.7041,
    longitude: 77.1025,
    rulers: ['Qutb-ud-din Aibak'],
    significance: 'Beginning of sustained Muslim political power in India.',
  },
  {
    id: '5',
    title: 'Mughal Empire Founded',
    description: 'Babur defeated Ibrahim Lodi at the First Battle of Panipat, establishing the Mughal Empire.',
    date: '1526 CE',
    year: 1526,
    category: 'medieval',
    region: 'india',
    latitude: 29.3909,
    longitude: 76.9635,
    rulers: ['Babur'],
    significance: 'Beginning of the Mughal dynasty that would rule India for over 300 years.',
  },
  // Modern India
  {
    id: '6',
    title: 'Battle of Plassey',
    description: 'British East India Company defeated Siraj-ud-Daulah, establishing British dominance in Bengal.',
    date: '1757 CE',
    year: 1757,
    category: 'modern',
    region: 'india',
    latitude: 23.8103,
    longitude: 88.2414,
    significance: 'Beginning of British colonial rule in India.',
  },
  {
    id: '7',
    title: 'Indian Independence',
    description: 'India gained independence from British rule, ending nearly 200 years of colonial domination.',
    date: '1947 CE',
    year: 1947,
    category: 'modern',
    region: 'india',
    latitude: 28.6139,
    longitude: 77.2090,
    significance: 'End of British colonial rule and birth of modern India.',
  },
  // World History - Ancient
  {
    id: '8',
    title: 'Rise of Ancient Egypt',
    description: 'Unification of Upper and Lower Egypt under Pharaoh Menes, beginning the dynastic period.',
    date: '3100 BCE',
    year: -3100,
    category: 'ancient',
    region: 'world',
    latitude: 26.8206,
    longitude: 30.8025,
    significance: 'Beginning of one of the world\'s longest-lasting civilizations.',
  },
  {
    id: '9',
    title: 'Roman Empire Founded',
    description: 'Augustus became the first Roman Emperor, transforming the Roman Republic into an Empire.',
    date: '27 BCE',
    year: -27,
    category: 'ancient',
    region: 'world',
    latitude: 41.9028,
    longitude: 12.4964,
    rulers: ['Augustus'],
    significance: 'Beginning of the Roman Empire that would dominate the Mediterranean for centuries.',
  },
  // World History - Medieval
  {
    id: '10',
    title: 'Fall of Constantinople',
    description: 'Ottoman Empire conquered Constantinople, ending the Byzantine Empire.',
    date: '1453 CE',
    year: 1453,
    category: 'medieval',
    region: 'world',
    latitude: 41.0082,
    longitude: 28.9784,
    significance: 'End of the Byzantine Empire and rise of Ottoman power.',
  },
  // World History - Modern
  {
    id: '11',
    title: 'French Revolution',
    description: 'The French Revolution began, leading to the overthrow of the monarchy and establishment of the Republic.',
    date: '1789 CE',
    year: 1789,
    category: 'modern',
    region: 'world',
    latitude: 48.8566,
    longitude: 2.3522,
    significance: 'Marked the beginning of modern democratic movements worldwide.',
  },
];

export const historicalPeriods: HistoricalPeriod[] = [
  {
    id: 'ancient-india',
    name: 'Ancient India',
    startYear: -3300,
    endYear: 550,
    description: 'Period from the Indus Valley Civilization to the end of the Gupta Empire.',
    keyEvents: ['1', '2', '3'],
    rulers: [
      {
        id: 'chandragupta',
        name: 'Chandragupta Maurya',
        dynasty: 'Mauryan',
        reignStart: -321,
        reignEnd: -297,
        achievements: ['Founded the Mauryan Empire', 'Unified most of India'],
        region: 'india',
      },
      {
        id: 'ashoka',
        name: 'Ashoka the Great',
        dynasty: 'Mauryan',
        reignStart: -268,
        reignEnd: -232,
        achievements: ['Spread Buddhism', 'Built extensive road network', 'Promoted non-violence'],
        region: 'india',
      },
    ],
  },
  {
    id: 'medieval-india',
    name: 'Medieval India',
    startYear: 550,
    endYear: 1707,
    description: 'Period from the decline of the Gupta Empire to the death of Aurangzeb.',
    keyEvents: ['4', '5'],
    rulers: [
      {
        id: 'akbar',
        name: 'Akbar the Great',
        dynasty: 'Mughal',
        reignStart: 1556,
        reignEnd: 1605,
        achievements: ['Expanded Mughal Empire', 'Promoted religious tolerance', 'Administrative reforms'],
        region: 'india',
      },
      {
        id: 'shah-jahan',
        name: 'Shah Jahan',
        dynasty: 'Mughal',
        reignStart: 1628,
        reignEnd: 1658,
        achievements: ['Built Taj Mahal', 'Golden age of Mughal architecture'],
        region: 'india',
      },
    ],
  },
  {
    id: 'modern-india',
    name: 'Modern India',
    startYear: 1707,
    endYear: 2024,
    description: 'Period from the decline of the Mughal Empire to present day.',
    keyEvents: ['6', '7'],
    rulers: [],
  },
];

export const worldRulers: Ruler[] = [
  {
    id: 'julius-caesar',
    name: 'Julius Caesar',
    dynasty: 'Roman',
    reignStart: -49,
    reignEnd: -44,
    achievements: ['Conquered Gaul', 'Crossed the Rubicon', 'Reformed Roman calendar'],
    region: 'world',
  },
  {
    id: 'napoleon',
    name: 'Napoleon Bonaparte',
    dynasty: 'French Empire',
    reignStart: 1804,
    reignEnd: 1814,
    achievements: ['Napoleonic Code', 'Conquered much of Europe', 'Educational reforms'],
    region: 'world',
  },
];

// AD/BC Explanation
export const timeSystemExplanation = {
  title: 'Understanding AD, BC, BCE, and CE',
  content: `
**BC (Before Christ)** and **AD (Anno Domini)**:
- BC: Years before the birth of Jesus Christ (counted backwards)
- AD: Years after the birth of Jesus Christ (Anno Domini means "Year of our Lord" in Latin)

**BCE (Before Common Era)** and **CE (Common Era)**:
- Modern, secular alternatives to BC and AD
- BCE = BC (same years, different terminology)
- CE = AD (same years, different terminology)

**Examples:**
- 500 BC = 500 BCE (500 years before year 1)
- 1500 AD = 1500 CE (1500 years after year 1)

**Important Notes:**
- There is no year 0 in the BC/AD system
- Year 1 BC is followed by year 1 AD
- When calculating time spans across BC/AD, add the years together
- Example: From 50 BC to 50 AD = 50 + 50 = 100 years
  `,
};

// Coming Soon Features Data
export const comingSoonFeatures = [
  {
    id: 'video-lectures',
    title: 'Video Lectures',
    description: 'Expert historians will provide in-depth video lectures on key topics',
    icon: 'play-circle-filled',
    category: 'learning',
    estimatedLaunch: 'Q2 2024',
  },
  {
    id: 'audio-stories',
    title: 'Audio Stories',
    description: 'Listen to captivating historical narratives and stories',
    icon: 'headset',
    category: 'entertainment',
    estimatedLaunch: 'Q3 2024',
  },
  {
    id: '3d-monuments',
    title: '3D Monument Tours',
    description: 'Virtual reality tours of historical monuments and sites',
    icon: 'view-in-ar',
    category: 'immersive',
    estimatedLaunch: 'Q4 2024',
  },
  {
    id: 'study-groups',
    title: 'Study Groups',
    description: 'Join study groups and discuss with fellow history enthusiasts',
    icon: 'group',
    category: 'social',
    estimatedLaunch: 'Q1 2025',
  },
  {
    id: 'ai-tutor',
    title: 'AI History Tutor',
    description: 'Personalized AI tutor to help with your history studies',
    icon: 'psychology',
    category: 'ai',
    estimatedLaunch: 'Q2 2025',
  },
  {
    id: 'live-classes',
    title: 'Live Classes',
    description: 'Attend live interactive classes with expert historians',
    icon: 'live-tv',
    category: 'education',
    estimatedLaunch: 'Q3 2025',
  },
];

// Study Tips and Learning Resources
export const studyTips = [
  {
    id: 'tip-1',
    title: 'Chronological Learning',
    description: 'Start with ancient history to build a strong foundation, then progress chronologically through medieval and modern periods.',
    category: 'strategy',
    difficulty: 'beginner',
  },
  {
    id: 'tip-2',
    title: 'Use Visual Aids',
    description: 'Utilize maps, timelines, and diagrams to better understand historical events and their geographical context.',
    category: 'technique',
    difficulty: 'intermediate',
  },
  {
    id: 'tip-3',
    title: 'Connect Events',
    description: 'Look for cause-and-effect relationships between historical events to understand the flow of history.',
    category: 'analysis',
    difficulty: 'advanced',
  },
  {
    id: 'tip-4',
    title: 'Regular Revision',
    description: 'Review previously learned topics regularly to strengthen your memory and understanding.',
    category: 'retention',
    difficulty: 'beginner',
  },
  {
    id: 'tip-5',
    title: 'Practice with Quizzes',
    description: 'Take regular quizzes to test your knowledge and identify areas that need more attention.',
    category: 'assessment',
    difficulty: 'intermediate',
  },
];

// Bookmarks and User Progress (placeholder data)
export const userBookmarks = [
  {
    id: 'bookmark-1',
    type: 'event',
    itemId: 'mauryan-empire',
    title: 'Mauryan Empire Foundation',
    dateBookmarked: '2024-01-15',
  },
  {
    id: 'bookmark-2',
    type: 'ruler',
    itemId: 'ashoka',
    title: 'Emperor Ashoka',
    dateBookmarked: '2024-01-14',
  },
  {
    id: 'bookmark-3',
    type: 'concept',
    itemId: 'feudalism',
    title: 'Feudalism System',
    dateBookmarked: '2024-01-13',
  },
];

export const enhancedUserProgress = {
  totalTopicsStudied: 45,
  quizzesCompleted: 23,
  averageScore: 78,
  studyStreak: 7,
  timeSpentLearning: 1240, // in minutes
  favoriteCategory: 'ancient',
  weakestCategory: 'modern',
  strongestCategory: 'medieval',
  achievements: [
    {
      id: 'first-quiz',
      title: 'First Quiz Completed',
      description: 'Completed your first history quiz',
      unlockedDate: '2024-01-10',
      icon: 'quiz',
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintained a 7-day study streak',
      unlockedDate: '2024-01-20',
      icon: 'local-fire-department',
    },
    {
      id: 'ancient-master',
      title: 'Ancient History Master',
      description: 'Scored 90+ in all ancient history quizzes',
      unlockedDate: '2024-01-18',
      icon: 'star',
    },
  ],
};