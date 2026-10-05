export const availabilityMeta = {
  available: {
    label: 'Available now',
    dot: 'bg-terracotta',
    badge: 'bg-terracotta/15 text-navy dark:bg-terracotta/25 dark:text-cream',
  },
  limited: {
    label: 'Limited copies',
    dot: 'bg-navy',
    badge: 'bg-navy/10 text-navy dark:bg-navy/30 dark:text-cream',
  },
  checked_out: {
    label: 'Checked out',
    dot: 'bg-black',
    badge: 'bg-black/10 text-black dark:bg-black/35 dark:text-cream',
  },
}

export const catalogBooks = [
  {
    id: 'midnight-archive',
    title: 'The Midnight Archive',
    author: 'Lena Ortiz',
    genre: 'Literary Fiction',
    year: 2023,
    pages: 352,
    rating: 4.8,
    status: 'available',
    description:
      'A night-shift librarian discovers a hidden drawer of unsent letters that slowly rewrites the history of her coastal town.',
    quote: 'A luminous reminder that every shelf holds a second chance.',
    cover: { from: '#04275c', to: '#45beff' },
    tags: ['Bestseller', 'Staff Pick'],
    reviews: [
      {
        name: 'Marisol D.',
        rating: 5,
        comment:
          'Tender and sharp at once. I finished it in two evenings and immediately recommended it to my book club.',
      },
      {
        name: 'Wesley R.',
        rating: 4,
        comment:
          'Beautiful pacing and a deeply human ending. The local history details made the world feel real.',
      },
    ],
  },
  {
    id: 'river-street-maps',
    title: 'Maps of River Street',
    author: 'Noah Bennett',
    genre: 'Mystery',
    year: 2021,
    pages: 298,
    rating: 4.6,
    status: 'limited',
    description:
      'A cartographer and a teen volunteer decode hand-drawn maps tucked into returned books to find a missing community muralist.',
    quote: 'A mystery rooted in place, memory, and neighborhood care.',
    cover: { from: '#45beff', to: '#04275c' },
    tags: ['Mystery', 'Community Read'],
    reviews: [
      {
        name: 'Katherine P.',
        rating: 5,
        comment: 'Smart clues, warm characters, and one of the best final chapters I have read this year.',
      },
      {
        name: 'Joel T.',
        rating: 4,
        comment: 'Fast and thoughtful. Great choice for readers who enjoy atmospheric city mysteries.',
      },
    ],
  },
  {
    id: 'city-of-paper-lights',
    title: 'City of Paper Lights',
    author: 'Amina Hassan',
    genre: 'Historical Fiction',
    year: 2019,
    pages: 410,
    rating: 4.7,
    status: 'available',
    description:
      'Set in 1920s Alexandria, a printmaker and a translator preserve banned poetry and form an unlikely literary circle.',
    quote: 'A sweeping portrait of art, dissent, and friendship.',
    cover: { from: '#000000', to: '#04275c' },
    tags: ['Award Winner', 'Historical'],
    reviews: [
      {
        name: 'Sarah L.',
        rating: 5,
        comment:
          'Richly researched and emotionally grounded. The language glows from the first page to the last.',
      },
      {
        name: 'Haruto M.',
        rating: 4,
        comment: 'Thoughtful storytelling and exceptional world building. A rewarding slow-burn novel.',
      },
    ],
  },
  {
    id: 'lakeside-algorithms',
    title: 'Lakeside Algorithms',
    author: 'Priya Raman',
    genre: 'Technology',
    year: 2024,
    pages: 256,
    rating: 4.4,
    status: 'checked_out',
    description:
      'An accessible guide to practical AI, written for civic teams, educators, and nonprofit leaders.',
    quote: 'Makes technical ideas feel usable, ethical, and human.',
    cover: { from: '#04275c', to: '#000000' },
    tags: ['New Arrival', 'Nonfiction'],
    reviews: [
      {
        name: 'Eli S.',
        rating: 4,
        comment: 'Clear examples and no jargon overload. Excellent for readers entering AI policy work.',
      },
      {
        name: 'Nabila H.',
        rating: 5,
        comment: 'Exactly the kind of bridge book libraries should promote for digital literacy.',
      },
    ],
  },
  {
    id: 'garden-between-pages',
    title: 'The Garden Between Pages',
    author: 'Clara Nwosu',
    genre: 'Memoir',
    year: 2020,
    pages: 332,
    rating: 4.5,
    status: 'available',
    description:
      'A botanist reflects on migration, grief, and belonging through the public gardens she has helped restore.',
    quote: 'Gentle, wise, and unexpectedly funny.',
    cover: { from: '#04275c', to: '#45beff' },
    tags: ['Memoir', 'Book Club'],
    reviews: [
      {
        name: 'Valerie B.',
        rating: 5,
        comment: 'The writing is intimate without being sentimental. It left our group with so much to discuss.',
      },
      {
        name: 'Dominic Y.',
        rating: 4,
        comment: 'Strong voice and meaningful reflections on place and memory.',
      },
    ],
  },
  {
    id: 'children-of-comet-hill',
    title: 'Children of Comet Hill',
    author: 'Marta Alvarez',
    genre: 'Young Adult',
    year: 2022,
    pages: 368,
    rating: 4.9,
    status: 'limited',
    description:
      'A group of teens use astronomy, art, and local activism to protect their hilltop observatory from demolition.',
    quote: 'Joyful, urgent, and perfect for intergenerational reads.',
    cover: { from: '#45beff', to: '#04275c' },
    tags: ['YA', 'Top Rated'],
    reviews: [
      {
        name: 'Imani C.',
        rating: 5,
        comment: 'One of my favorite YA novels in years. Every character feels specific and alive.',
      },
      {
        name: 'Fred K.',
        rating: 5,
        comment: 'Heartwarming and politically aware without preaching. Our teen advisory board loved it.',
      },
    ],
  },
  {
    id: 'parallel-kitchens',
    title: 'Parallel Kitchens',
    author: 'Sohail Mirza',
    genre: 'Food Writing',
    year: 2018,
    pages: 224,
    rating: 4.2,
    status: 'available',
    description:
      'A culinary travel memoir connecting diaspora kitchens across Lagos, Karachi, and Toronto.',
    quote: 'A generous, aromatic journey through memory and migration.',
    cover: { from: '#000000', to: '#45beff' },
    tags: ['Travel', 'Memoir'],
    reviews: [
      {
        name: 'Renee O.',
        rating: 4,
        comment: 'Warm storytelling and practical recipes. Great crossover for memoir and food readers.',
      },
      {
        name: 'Abdul Z.',
        rating: 4,
        comment: 'Grounded, heartfelt, and full of sensory detail.',
      },
    ],
  },
  {
    id: 'signal-and-sparrow',
    title: 'Signal and Sparrow',
    author: 'Ethan Cole',
    genre: 'Science Fiction',
    year: 2025,
    pages: 386,
    rating: 4.7,
    status: 'checked_out',
    description:
      'In a near-future city, a sound engineer and a courier uncover a public-frequency conspiracy hidden in old radio towers.',
    quote: 'Inventive speculative fiction with a deeply humane core.',
    cover: { from: '#04275c', to: '#000000' },
    tags: ['Sci-Fi', 'New Arrival'],
    reviews: [
      {
        name: 'Tomoko A.',
        rating: 5,
        comment: 'Ambitious world building and memorable dialogue. It felt cinematic yet intimate.',
      },
      {
        name: 'Peter N.',
        rating: 4,
        comment: 'Strong pacing and excellent tension. Looking forward to a sequel.',
      },
    ],
  },
  {
    id: 'morning-at-elm-court',
    title: 'Morning at Elm Court',
    author: 'Rachel Okafor',
    genre: 'Poetry',
    year: 2017,
    pages: 144,
    rating: 4.3,
    status: 'available',
    description:
      'A poetry collection shaped around apartment hallways, family voices, and the rituals of city mornings.',
    quote: 'Quiet poems that stay with you long after the page turns.',
    cover: { from: '#45beff', to: '#04275c' },
    tags: ['Poetry', 'Local Author'],
    reviews: [
      {
        name: 'Helen F.',
        rating: 4,
        comment: 'Compact, precise, and moving. Ideal for readers who want poetry grounded in daily life.',
      },
      {
        name: 'Tariq M.',
        rating: 5,
        comment: 'Every poem feels handcrafted. I keep returning to this collection.',
      },
    ],
  },
  {
    id: 'atlas-of-small-schools',
    title: 'Atlas of Small Schools',
    author: 'Dr. Jonah Fielding',
    genre: 'Education',
    year: 2020,
    pages: 276,
    rating: 4.1,
    status: 'limited',
    description:
      'Case studies from public schools that transformed outcomes through family partnerships and culturally responsive teaching.',
    quote: 'Practical research with clear, compassionate recommendations.',
    cover: { from: '#04275c', to: '#45beff' },
    tags: ['Education', 'Research'],
    reviews: [
      {
        name: 'Melissa E.',
        rating: 4,
        comment: 'Strong evidence and actionable insights for community educators.',
      },
      {
        name: 'Daniel H.',
        rating: 4,
        comment: 'Useful for school leaders and nonprofit literacy teams.',
      },
    ],
  },
  {
    id: 'whispering-blueprints',
    title: 'Whispering Blueprints',
    author: 'Andre Wallace',
    genre: 'Architecture',
    year: 2021,
    pages: 318,
    rating: 4.4,
    status: 'available',
    description:
      'A visual narrative about adaptive reuse projects that turned abandoned buildings into neighborhood commons.',
    quote: 'A compelling argument for design as social infrastructure.',
    cover: { from: '#000000', to: '#04275c' },
    tags: ['Design', 'Urbanism'],
    reviews: [
      {
        name: 'Gina V.',
        rating: 4,
        comment: 'Beautifully illustrated and surprisingly readable for non-specialists.',
      },
      {
        name: 'Oscar D.',
        rating: 5,
        comment: 'Thoughtful examples from multiple continents. Highly recommend.',
      },
    ],
  },
  {
    id: 'borrowed-sunrise',
    title: 'Borrowed Sunrise',
    author: 'Mei Lin',
    genre: 'Romance',
    year: 2024,
    pages: 304,
    rating: 4.6,
    status: 'available',
    description:
      'A chef and a mural conservator meet during a dawn volunteer program at the library and rebuild trust after personal loss.',
    quote: 'Warm, witty, and deeply rooted in community spaces.',
    cover: { from: '#45beff', to: '#000000' },
    tags: ['Romance', 'Feel-Good'],
    reviews: [
      {
        name: 'Nora S.',
        rating: 5,
        comment: 'A genuinely kind romance with mature characters and beautiful setting details.',
      },
      {
        name: 'Chris P.',
        rating: 4,
        comment: 'Sweet, grounded, and full of memorable side characters.',
      },
    ],
  },
]

export const popularBooks = catalogBooks.slice(0, 8)

export const popularCategories = [
  'New Arrivals',
  'Mystery & Crime',
  'Young Adult',
  'Historical Fiction',
  'Career & Technology',
  'Children and Family',
]

export const featureHighlights = [
  {
    title: 'Unlimited Access',
    description:
      'Borrow print, digital, and audio titles with one card and seamless access across all city branches.',
  },
  {
    title: 'Diverse Catalog',
    description:
      'Explore multilingual collections, local authors, and carefully curated shelves for every age and interest.',
  },
  {
    title: 'Community Events',
    description:
      'Join workshops, author conversations, and family programs designed to make learning social and joyful.',
  },
  {
    title: 'Digital Resources',
    description:
      'Use online research databases, language platforms, and tutoring tools from home or on the go.',
  },
]

export const quickActions = [
  'Reserve a Room',
  'Ask a Librarian',
  'Book a Tour',
  'Donate Books',
]

export const upcomingEvents = [
  {
    id: 'evt-1',
    month: 'MAR',
    day: '03',
    title: 'Neighborhood Story Circle',
    time: '6:30 PM - 8:00 PM',
    location: 'Atrium Reading Hall',
  },
  {
    id: 'evt-2',
    month: 'MAR',
    day: '09',
    title: 'Digital Safety for Families',
    time: '11:00 AM - 12:30 PM',
    location: 'Learning Lab 2',
  },
  {
    id: 'evt-3',
    month: 'MAR',
    day: '14',
    title: 'Poetry Night: Voices of the City',
    time: '7:00 PM - 9:00 PM',
    location: 'Garden Terrace',
  },
  {
    id: 'evt-4',
    month: 'MAR',
    day: '22',
    title: 'Makerspace Open Studio',
    time: '1:00 PM - 4:00 PM',
    location: 'Innovation Wing',
  },
]

export const featuredEvent = {
  title: 'Featured Talk: Reading Futures',
  image:
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
  description:
    'Join education researcher Dr. Aisha Thompson for a practical session on building reading habits in busy households. Includes a Q&A with local teachers and youth mentors.',
  speaker: 'Dr. Aisha Thompson, Literacy Researcher',
  time: 'Saturday, March 16 at 5:00 PM',
  location: 'Grand Lecture Room',
}

export const membershipPerks = [
  {
    title: 'Community Membership',
    subtitle: 'Always free',
    body: 'Borrow up to 12 physical items, attend events, and access public computers and Wi-Fi.',
  },
  {
    title: 'Research Plus',
    subtitle: 'Extended access',
    body: 'Unlock premium academic databases, archival requests, and librarian-guided reference sessions.',
  },
  {
    title: 'Family Explorer',
    subtitle: 'Designed for households',
    body: 'Family cards, early literacy kits, homework support, and priority booking for youth programs.',
  },
]

export const libraryStats = [
  { label: 'Books & Media', value: 2500000, suffix: '+' },
  { label: 'Active Members', value: 92000, suffix: '+' },
  { label: 'Annual Events', value: 1300, suffix: '+' },
  { label: 'Digital Resources', value: 240, suffix: '+' },
]

export const weeklyHours = [
  { day: 'Monday', hours: '8:00 AM - 8:00 PM' },
  { day: 'Tuesday', hours: '8:00 AM - 8:00 PM' },
  { day: 'Wednesday', hours: '8:00 AM - 8:00 PM' },
  { day: 'Thursday', hours: '8:00 AM - 8:00 PM' },
  { day: 'Friday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
]

export const readingQuotes = [
  'Reading gives us someplace to go when we have to stay where we are.',
  'A library is not a luxury but one of the necessities of life.',
  'Books are bridges to empathy, imagination, and possibility.',
]

export const getBookById = (bookId) =>
  catalogBooks.find((book) => book.id === bookId)
