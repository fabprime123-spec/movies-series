import { MediaItem } from '../types';

export const GLOBAL_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es-419', name: 'Spanish (Latin America)', nativeName: 'Español (Latinoamérica)' },
  { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español (España)' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'zh-CN', name: 'Mandarin Chinese (Simplified)', nativeName: '普通话 (简体)' },
  { code: 'zh-TW', name: 'Mandarin Chinese (Traditional)', nativeName: '國語 (繁體)' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية' },
  { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th-TH', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'uk-UA', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'cs-CZ', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu-HU', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'el-GR', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he-IL', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'ro-RO', name: 'Romanian', nativeName: 'Română' },
  { code: 'da-DK', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi-FI', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no-NO', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fil-PH', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'bn-BD', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
];

export const GENRES_LIST = [
  'All Genres',
  'Sci-Fi',
  'Action',
  'Adventure',
  'Drama',
  'Thriller',
  'Animation',
  'Mystery',
  'Crime',
  'Fantasy',
  'Comedy',
  'Romance',
  'History',
  'Horror',
];

export const STREAMING_SERVICES = [
  { id: 'all', name: 'All Services' },
  { id: 'netflix', name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop&q=80' },
  { id: 'max', name: 'Max (HBO)', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80' },
  { id: 'disney', name: 'Disney+', logo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80' },
  { id: 'apple', name: 'Apple TV+', logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80' },
  { id: 'prime', name: 'Prime Video', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&auto=format&fit=crop&q=80' },
];

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2024,
    releaseDate: 'March 1, 2024',
    ageRating: 'PG-13',
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    ratings: {
      imdb: 8.6,
      rottenTomatoes: 93,
      metacritic: 79,
      community: 9.1,
      communityVotesCount: 42800,
    },
    runtimeMinutes: 166,
    status: 'Released',
    originalLanguage: 'English (Galach, Chakobsa)',
    originCountry: 'United States',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'es-419', name: 'Spanish (Latin America)', nativeName: 'Español (Latinoamérica)', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby Atmos' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', audioFormat: 'Dolby 5.1' },
      { code: 'zh-CN', name: 'Mandarin Chinese', nativeName: '普通话', audioFormat: 'Dolby 5.1' },
      { code: 'ko-KR', name: 'Korean', nativeName: '한국어', audioFormat: 'Dolby 5.1' },
      { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', audioFormat: 'Stereo' },
      { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', audioFormat: 'Stereo' },
      { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: ['en', 'fr-FR', 'es-419', 'de-DE'].includes(l.code), hasCC: true })),
    directors: [
      { id: 'denis-villeneuve', name: 'Denis Villeneuve', role: 'Director', profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' }
    ],
    writers: [
      { id: 'denis-v', name: 'Denis Villeneuve', role: 'Writer' },
      { id: 'jon-spaihts', name: 'Jon Spaihts', role: 'Writer' },
      { id: 'frank-herbert', name: 'Frank Herbert', role: 'Writer' }
    ],
    composers: [
      { id: 'hans-zimmer', name: 'Hans Zimmer', role: 'Composer' }
    ],
    cast: [
      { id: 'c1', name: 'Timothée Chalamet', character: 'Paul Atreides / Muad\'Dib', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Wonka, Call Me by Your Name', birthPlace: 'New York, USA' },
      { id: 'c2', name: 'Zendaya', character: 'Chani', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Euphoria, Spider-Man', birthPlace: 'California, USA' },
      { id: 'c3', name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'Mission Impossible, Silo', birthPlace: 'Stockholm, Sweden' },
      { id: 'c4', name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Elvis, Masters of the Air', birthPlace: 'California, USA' },
      { id: 'c5', name: 'Florence Pugh', character: 'Princess Irulan Corrino', profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', popularFor: 'Oppenheimer, Midsommar', birthPlace: 'Oxford, UK' },
      { id: 'c6', name: 'Javier Bardem', character: 'Stilgar', profileUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80', popularFor: 'No Country for Old Men, Skyfall', birthPlace: 'Las Palmas, Spain' },
    ],
    budget: 190000000,
    revenue: 714400000,
    productionCompanies: ['Legendary Pictures', 'Warner Bros. Entertainment'],
    awards: ['Winner of 6 Academy Award Categories for Franchise', 'AFI Movie of the Year 2024', 'Critics Choice Super Award'],
    trailerYoutubeId: 'Way9Dexny3w',
    trailerTitle: 'Official Trailer 3',
    streamingProviders: [
      { name: 'Max', logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Apple TV', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80', type: 'buy' },
      { name: 'Prime Video', logoUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&auto=format&fit=crop&q=80', type: 'rent' }
    ],
    similarMediaIds: ['interstellar', 'blade-runner-2049', 'oppenheimer', 'shogun'],
    featured: true,
    trendingRank: 1,
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    tagline: 'The world forever changes.',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II, his leadership of the Manhattan Project, and the harrowing security clearance hearings during the Red Scare.',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2023,
    releaseDate: 'July 21, 2023',
    ageRating: 'R',
    genres: ['Drama', 'History', 'Thriller'],
    ratings: {
      imdb: 8.9,
      rottenTomatoes: 93,
      metacritic: 90,
      community: 9.3,
      communityVotesCount: 68400,
    },
    runtimeMinutes: 180,
    status: 'Released',
    originalLanguage: 'English, German, Dutch',
    originCountry: 'United States, United Kingdom',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'es-ES', name: 'Spanish (Castilian)', nativeName: 'Español (España)', audioFormat: 'Dolby 5.1' },
      { code: 'es-419', name: 'Spanish (Latin America)', nativeName: 'Español (LatAm)', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby Atmos' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', audioFormat: 'Stereo' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'christopher-nolan', name: 'Christopher Nolan', role: 'Director', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' }
    ],
    writers: [
      { id: 'c-nolan', name: 'Christopher Nolan', role: 'Writer' },
      { id: 'kai-bird', name: 'Kai Bird', role: 'Writer' }
    ],
    composers: [
      { id: 'ludwig-g', name: 'Ludwig Göransson', role: 'Composer' }
    ],
    cast: [
      { id: 'oc1', name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Peaky Blinders, Inception', birthPlace: 'Cork, Ireland' },
      { id: 'oc2', name: 'Emily Blunt', character: 'Katherine "Kitty" Oppenheimer', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'A Quiet Place, Sicario', birthPlace: 'London, UK' },
      { id: 'oc3', name: 'Robert Downey Jr.', character: 'Lewis Strauss', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Iron Man, Sherlock Holmes', birthPlace: 'New York, USA' },
      { id: 'oc4', name: 'Matt Damon', character: 'Leslie Groves', profileUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80', popularFor: 'Good Will Hunting, The Martian', birthPlace: 'Massachusetts, USA' },
      { id: 'oc5', name: 'Florence Pugh', character: 'Jean Tatlock', profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', popularFor: 'Dune: Part Two, Little Women', birthPlace: 'Oxford, UK' }
    ],
    budget: 100000000,
    revenue: 957800000,
    productionCompanies: ['Syncopy', 'Universal Pictures', 'Atlas Entertainment'],
    awards: ['7 Academy Awards including Best Picture & Best Director', '5 Golden Globe Awards', '7 BAFTA Film Awards'],
    trailerYoutubeId: 'uYPbbksJxIg',
    trailerTitle: 'Official Trailer',
    streamingProviders: [
      { name: 'Prime Video', logoUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Apple TV', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80', type: 'buy' }
    ],
    similarMediaIds: ['interstellar', 'inception', 'the-dark-knight', 'dune-2'],
    featured: true,
    trendingRank: 2,
  },
  {
    id: 'severance',
    title: 'Severance',
    originalTitle: 'Severance',
    tagline: 'Please do not adjust your screen.',
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    type: 'tv',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2022,
    releaseDate: 'February 18, 2022',
    ageRating: 'TV-MA',
    genres: ['Sci-Fi', 'Thriller', 'Drama', 'Mystery'],
    ratings: {
      imdb: 8.7,
      rottenTomatoes: 97,
      metacritic: 83,
      community: 9.4,
      communityVotesCount: 38200,
    },
    totalSeasons: 2,
    totalEpisodes: 19,
    status: 'Returning Series',
    originalLanguage: 'English',
    originCountry: 'United States',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'ko-KR', name: 'Korean', nativeName: '한국어', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'ben-stiller', name: 'Ben Stiller', role: 'Director', profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { id: 'aoife-mcardle', name: 'Aoife McArdle', role: 'Director' }
    ],
    creators: [
      { id: 'dan-erickson', name: 'Dan Erickson', role: 'Creator' }
    ],
    writers: [
      { id: 'dan-e', name: 'Dan Erickson', role: 'Writer' }
    ],
    cast: [
      { id: 'sc1', name: 'Adam Scott', character: 'Mark Scout', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Parks and Recreation, Big Little Lies', birthPlace: 'California, USA' },
      { id: 'sc2', name: 'Patricia Arquette', character: 'Harmony Cobel / Mrs. Selvig', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'Boyhood, Medium', birthPlace: 'Illinois, USA' },
      { id: 'sc3', name: 'John Turturro', character: 'Irving Bailiff', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'The Big Lebowski, The Night Of', birthPlace: 'New York, USA' },
      { id: 'sc4', name: 'Christopher Walken', character: 'Burt Goodman', profileUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80', popularFor: 'Catch Me If You Can, The Deer Hunter', birthPlace: 'New York, USA' },
      { id: 'sc5', name: 'Britt Lower', character: 'Helly R.', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Man Seeking Woman', birthPlace: 'Illinois, USA' },
      { id: 'sc6', name: 'Tramell Tillman', character: 'Seth Milchick', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Godfather of Harlem', birthPlace: 'Maryland, USA' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 9,
        posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
        overview: 'Mark Scout leads a team at Lumon Industries, whose employees have undergone a severance procedure.',
        airYear: 2022,
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, title: 'Good News About Hell', overview: 'Mark Scout welcomes a new employee, Helly, while struggling with personal grief outside the workplace.', runtimeMinutes: 57, airDate: 'Feb 18, 2022', stillUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80', voteAverage: 8.5 },
          { episodeNumber: 2, seasonNumber: 1, title: 'Half Loop', overview: 'The Macrodata Refinement team trains Helly in data sorting while Petey leaves cryptic clues.', runtimeMinutes: 53, airDate: 'Feb 18, 2022', stillUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80', voteAverage: 8.7 },
          { episodeNumber: 3, seasonNumber: 1, title: 'In Perpetuity', overview: 'Mark takes the team on a field trip to the Perpetuity Wing. Cobel grows suspicious.', runtimeMinutes: 54, airDate: 'Feb 25, 2022', stillUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80', voteAverage: 8.9 },
          { episodeNumber: 9, seasonNumber: 1, title: 'The We We Are', overview: 'The team executes their daring Overtime Contingency plan to expose Lumon from the outside world.', runtimeMinutes: 44, airDate: 'Apr 8, 2022', stillUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', voteAverage: 9.8 }
        ]
      }
    ],
    productionCompanies: ['Red Hour Productions', 'Endeavor Content', 'Apple Studios'],
    awards: ['2 Primetime Emmy Awards', 'Peabody Award Winner', 'WGA Award for Best Drama Series'],
    trailerYoutubeId: 'xEQP4VVuyrY',
    trailerTitle: 'Season 1 Official Trailer',
    streamingProviders: [
      { name: 'Apple TV+', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['stranger-things', 'the-last-of-us', 'succession', 'inception'],
    featured: true,
    trendingRank: 3,
  },
  {
    id: 'shogun',
    title: 'Shōgun',
    originalTitle: 'Shōgun (将軍)',
    tagline: 'Destiny is no accident.',
    overview: 'When a mysterious European ship is found marooned in a nearby fishing village in feudal Japan, Lord Yoshii Toranaga discovers secrets that could tip the scales of power and devastate his formidable enemies in the Council of Regents.',
    type: 'tv',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2024,
    releaseDate: 'February 27, 2024',
    ageRating: 'TV-MA',
    genres: ['Drama', 'History', 'Action', 'Adventure'],
    ratings: {
      imdb: 8.8,
      rottenTomatoes: 99,
      metacritic: 85,
      community: 9.5,
      communityVotesCount: 52000,
    },
    totalSeasons: 1,
    totalEpisodes: 10,
    status: 'Returning Series',
    originalLanguage: 'Japanese (80%), English, Portuguese',
    originCountry: 'United States, Japan',
    dubbedLanguages: [
      { code: 'ja-JP', name: 'Japanese (Original)', nativeName: '日本語', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby 5.1' },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español (Latinoamérica)', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'jonathan-van-tulleken', name: 'Jonathan van Tulleken', role: 'Director' },
      { id: 'hiromi-kamata', name: 'Hiromi Kamata', role: 'Director' }
    ],
    creators: [
      { id: 'rachel-kondo', name: 'Rachel Kondo', role: 'Creator' },
      { id: 'justin-marks', name: 'Justin Marks', role: 'Creator' }
    ],
    writers: [
      { id: 'james-clavell', name: 'James Clavell (Novel)', role: 'Writer' }
    ],
    cast: [
      { id: 'sh1', name: 'Hiroyuki Sanada', character: 'Lord Yoshii Toranaga', profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', popularFor: 'The Last Samurai, John Wick 4', birthPlace: 'Tokyo, Japan' },
      { id: 'sh2', name: 'Cosmo Jarvis', character: 'John Blackthorne / Anjin', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Peaky Blinders, Lady Macbeth', birthPlace: 'New Jersey, USA' },
      { id: 'sh3', name: 'Anna Sawai', character: 'Toda Mariko', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Monarch: Legacy of Monsters, Pachinko', birthPlace: 'Wellington, NZ' },
      { id: 'sh4', name: 'Tadanobu Asano', character: 'Kashigi Yabushige', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Thor, Ichi the Killer', birthPlace: 'Yokohama, Japan' },
      { id: 'sh5', name: 'Takehiro Hira', character: 'Ishido Kazunari', profileUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80', popularFor: 'Gran Turismo, Giri/Haji', birthPlace: 'Tokyo, Japan' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 10,
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        overview: 'Feudal politics reach a boiling point in 1600 Japan.',
        airYear: 2024,
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, title: 'Anjin', overview: 'English pilot John Blackthorne and his crew shipwreck on the shores of Izu province.', runtimeMinutes: 70, airDate: 'Feb 27, 2024', stillUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=400&auto=format&fit=crop&q=80', voteAverage: 8.9 },
          { episodeNumber: 2, seasonNumber: 1, title: 'Servants of Two Masters', overview: 'Toranaga is summoned to Osaka Castle where the Council of Regents plans his execution.', runtimeMinutes: 60, airDate: 'Feb 27, 2024', stillUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80', voteAverage: 9.1 },
          { episodeNumber: 9, seasonNumber: 1, title: 'Crimson Sky', overview: 'Mariko arrives in Osaka on a delicate mission to break the Regents\' hostage stalemate.', runtimeMinutes: 61, airDate: 'Apr 16, 2024', stillUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=400&auto=format&fit=crop&q=80', voteAverage: 9.7 }
        ]
      }
    ],
    productionCompanies: ['FX Productions', 'DNA Films', 'Michael De Luca Productions'],
    awards: ['Record-breaking 18 Primetime Emmy Awards in single year', 'AFI TV Program of the Year', 'TCA Program of the Year'],
    trailerYoutubeId: 'yAN5uspAoVE',
    trailerTitle: 'Official Trailer',
    streamingProviders: [
      { name: 'Disney+', logoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Max', logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['succession', 'the-last-of-us', 'dune-2'],
    featured: true,
    trendingRank: 4,
  },
  {
    id: 'arcane',
    title: 'Arcane: League of Legends',
    originalTitle: 'Arcane',
    tagline: 'Every legend has a beginning.',
    overview: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.',
    type: 'anime',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2021,
    releaseDate: 'November 6, 2021',
    ageRating: 'TV-14',
    genres: ['Animation', 'Action', 'Sci-Fi', 'Fantasy', 'Drama'],
    ratings: {
      imdb: 9.0,
      rottenTomatoes: 100,
      metacritic: 87,
      community: 9.7,
      communityVotesCount: 94000,
    },
    totalSeasons: 2,
    totalEpisodes: 18,
    status: 'Ended',
    originalLanguage: 'English',
    originCountry: 'United States, France',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español (Latinoamérica)', audioFormat: 'Dolby 5.1' },
      { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español (Castellano)', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'ko-KR', name: 'Korean', nativeName: '한국어', audioFormat: 'Dolby 5.1' },
      { code: 'zh-CN', name: 'Mandarin Chinese', nativeName: '中文', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', audioFormat: 'Dolby 5.1' },
      { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', audioFormat: 'Stereo' },
      { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', audioFormat: 'Stereo' },
      { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', audioFormat: 'Dolby 5.1' }
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'pascal-charrue', name: 'Pascal Charrue', role: 'Director' },
      { id: 'arnaud-delord', name: 'Arnaud Delord', role: 'Director' }
    ],
    creators: [
      { id: 'christian-linke', name: 'Christian Linke', role: 'Creator' },
      { id: 'alex-yee', name: 'Alex Yee', role: 'Creator' }
    ],
    writers: [
      { id: 'c-linke', name: 'Christian Linke', role: 'Writer' }
    ],
    cast: [
      { id: 'ac1', name: 'Hailee Steinfeld', character: 'Vi / Violet', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Spider-Verse, True Grit', birthPlace: 'California, USA' },
      { id: 'ac2', name: 'Ella Purnell', character: 'Jinx / Powder', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'Fallout, Yellowjackets', birthPlace: 'London, UK' },
      { id: 'ac3', name: 'Kevin Alejandro', character: 'Jayce Talis', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Lucifer, Arrow', birthPlace: 'Texas, USA' },
      { id: 'ac4', name: 'Katie Leung', character: 'Caitlyn Kiramman', profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', popularFor: 'Harry Potter series', birthPlace: 'Dundee, Scotland' },
      { id: 'ac5', name: 'Harry Lloyd', character: 'Viktor', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Game of Thrones, The Theory of Everything', birthPlace: 'London, UK' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        name: 'Season 1: Act I-III',
        episodeCount: 9,
        posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
        overview: 'Tensions between Piltover and Zaun boil over as new inventions threaten peace.',
        airYear: 2021,
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, title: 'Welcome to the Playground', overview: 'Orphaned sisters Vi and Powder lead a heist in affluent Piltover that goes catastrophically wrong.', runtimeMinutes: 44, airDate: 'Nov 6, 2021', stillUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80', voteAverage: 9.1 },
          { episodeNumber: 3, seasonNumber: 1, title: 'The Base Violence Necessary for Change', overview: 'Vander faces Silco in a heart-wrenching confrontation as Powder tries desperately to help.', runtimeMinutes: 44, airDate: 'Nov 6, 2021', stillUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80', voteAverage: 9.6 },
          { episodeNumber: 9, seasonNumber: 1, title: 'The Monster You Created', overview: 'Jinx holds a fateful dinner party that decides the future of both cities forever.', runtimeMinutes: 41, airDate: 'Nov 20, 2021', stillUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80', voteAverage: 9.7 }
        ]
      }
    ],
    productionCompanies: ['Riot Games', 'Fortiche Production', 'Netflix'],
    awards: ['4 Primetime Emmy Awards', '9 Annie Awards sweep', 'Billboard Music Award Nominee'],
    trailerYoutubeId: 'fXmAurh012s',
    trailerTitle: 'Official Trailer',
    streamingProviders: [
      { name: 'Netflix', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['spider-man-spider-verse', 'cyberpunk-edgerunners', 'stranger-things'],
    featured: true,
    trendingRank: 5,
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview: 'A team of explorers travel through a newly discovered wormhole in space, in an attempt to ensure humanity\'s survival as blight ravages Earth\'s crops and atmosphere.',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2014,
    releaseDate: 'November 7, 2014',
    ageRating: 'PG-13',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    ratings: {
      imdb: 8.7,
      rottenTomatoes: 73,
      metacritic: 74,
      community: 9.6,
      communityVotesCount: 120500,
    },
    runtimeMinutes: 169,
    status: 'Released',
    originalLanguage: 'English',
    originCountry: 'United States, United Kingdom',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'christopher-nolan', name: 'Christopher Nolan', role: 'Director' }
    ],
    writers: [
      { id: 'jonathan-nolan', name: 'Jonathan Nolan', role: 'Writer' },
      { id: 'c-nolan', name: 'Christopher Nolan', role: 'Writer' }
    ],
    composers: [
      { id: 'hans-zimmer', name: 'Hans Zimmer', role: 'Composer' }
    ],
    cast: [
      { id: 'ic1', name: 'Matthew McConaughey', character: 'Joseph Cooper', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Dallas Buyers Club, True Detective', birthPlace: 'Texas, USA' },
      { id: 'ic2', name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Les Misérables, The Dark Knight Rises', birthPlace: 'New York, USA' },
      { id: 'ic3', name: 'Jessica Chastain', character: 'Murphy "Murph" Cooper (Adult)', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'Zero Dark Thirty, The Eyes of Tammy Faye', birthPlace: 'California, USA' },
      { id: 'ic4', name: 'Michael Caine', character: 'Professor John Brand', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'The Prestige, Batman Begins', birthPlace: 'London, UK' }
    ],
    budget: 165000000,
    revenue: 773800000,
    productionCompanies: ['Paramount Pictures', 'Warner Bros.', 'Legendary Pictures', 'Syncopy'],
    awards: ['Academy Award for Best Visual Effects', 'BAFTA for Best Special Visual Effects'],
    trailerYoutubeId: 'zSWdZVtXT7E',
    trailerTitle: 'Official Trailer 3',
    streamingProviders: [
      { name: 'Prime Video', logoUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Apple TV', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80', type: 'rent' }
    ],
    similarMediaIds: ['dune-2', 'oppenheimer', 'blade-runner-2049', 'inception'],
    featured: false,
    trendingRank: 6,
  },
  {
    id: 'the-last-of-us',
    title: 'The Last of Us',
    originalTitle: 'The Last of Us',
    tagline: 'When you\'re lost in the darkness, look for the light.',
    overview: 'Twenty years after a fungal outbreak devastates the planet, hardened survivor Joel is hired to smuggle 14-year-old Ellie out of an oppressive quarantine zone in a brutal cross-country odyssey.',
    type: 'tv',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2023,
    releaseDate: 'January 15, 2023',
    ageRating: 'TV-MA',
    genres: ['Drama', 'Action', 'Adventure', 'Horror', 'Sci-Fi'],
    ratings: {
      imdb: 8.8,
      rottenTomatoes: 96,
      metacritic: 84,
      community: 9.3,
      communityVotesCount: 61000,
    },
    totalSeasons: 1,
    totalEpisodes: 9,
    status: 'Returning Series',
    originalLanguage: 'English',
    originCountry: 'United States, Canada',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'craig-mazin', name: 'Craig Mazin', role: 'Director' },
      { id: 'neil-druckmann', name: 'Neil Druckmann', role: 'Director' }
    ],
    creators: [
      { id: 'c-mazin', name: 'Craig Mazin', role: 'Creator' },
      { id: 'n-druckmann', name: 'Neil Druckmann', role: 'Creator' }
    ],
    writers: [
      { id: 'n-druckmann-w', name: 'Neil Druckmann', role: 'Writer' }
    ],
    cast: [
      { id: 'tlou1', name: 'Pedro Pascal', character: 'Joel Miller', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'The Mandalorian, Narcos', birthPlace: 'Santiago, Chile' },
      { id: 'tlou2', name: 'Bella Ramsey', character: 'Ellie Williams', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Game of Thrones, Catherine Called Birdy', birthPlace: 'Nottinghamshire, UK' },
      { id: 'tlou3', name: 'Gabriel Luna', character: 'Tommy Miller', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Agents of S.H.I.E.L.D., Terminator: Dark Fate', birthPlace: 'Texas, USA' },
      { id: 'tlou4', name: 'Nick Offerman', character: 'Bill', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Parks and Recreation, Devs', birthPlace: 'Illinois, USA' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 9,
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
        overview: 'Joel and Ellie traverse a post-apocalyptic United States.',
        airYear: 2023,
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, title: 'When You\'re Lost in the Darkness', overview: 'Twenty years after a fungal outbreak ravages the planet, Joel and Tess are tasked with a perilous mission.', runtimeMinutes: 81, airDate: 'Jan 15, 2023', stillUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80', voteAverage: 8.9 },
          { episodeNumber: 3, seasonNumber: 1, title: 'Long, Long Time', overview: 'When a stranger approaches his isolated compound, survivalist Bill forges an unexpected connection.', runtimeMinutes: 75, airDate: 'Jan 29, 2023', stillUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80', voteAverage: 9.6 }
        ]
      }
    ],
    productionCompanies: ['Sony Pictures Television', 'PlayStation Productions', 'Naughty Dog', 'HBO Entertainment'],
    awards: ['8 Primetime Creative Arts Emmy Awards', 'TCA Outstanding New Program'],
    trailerYoutubeId: 'uLtkt8BonwM',
    trailerTitle: 'Official Teaser Trailer',
    streamingProviders: [
      { name: 'Max', logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['stranger-things', 'severance', 'shogun'],
    featured: false,
    trendingRank: 7,
  },
  {
    id: 'cyberpunk-edgerunners',
    title: 'Cyberpunk: Edgerunners',
    originalTitle: 'サイバーパンク エッジランナーズ',
    tagline: 'Lose your mind, or choose your path.',
    overview: 'A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner: a mercenary outlaw also known as a cyberpunk.',
    type: 'anime',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2022,
    releaseDate: 'September 13, 2022',
    ageRating: 'TV-MA',
    genres: ['Animation', 'Action', 'Sci-Fi', 'Crime'],
    ratings: {
      imdb: 8.3,
      rottenTomatoes: 100,
      metacritic: 80,
      community: 9.4,
      communityVotesCount: 48900,
    },
    totalSeasons: 1,
    totalEpisodes: 10,
    status: 'Ended',
    originalLanguage: 'Japanese, English',
    originCountry: 'Japan, Poland',
    dubbedLanguages: [
      { code: 'ja-JP', name: 'Japanese (Original)', nativeName: '日本語', audioFormat: 'Dolby 5.1', isOriginal: true },
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'hiroyuki-imaishi', name: 'Hiroyuki Imaishi', role: 'Director' }
    ],
    creators: [
      { id: 'rafal-jaki', name: 'Rafał Jaki', role: 'Creator' },
      { id: 'mike-pondsmith', name: 'Mike Pondsmith', role: 'Creator' }
    ],
    writers: [
      { id: 'masahiko-otsuka', name: 'Masahiko Otsuka', role: 'Writer' }
    ],
    cast: [
      { id: 'ce1', name: 'KENN / Zach Aguilar', character: 'David Martinez', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Demon Slayer, Fire Emblem' },
      { id: 'ce2', name: 'Aoi Yūki / Emi Lo', character: 'Lucyna "Lucy" Kushinada', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Madoka Magica, My Hero Academia' },
      { id: 'ce3', name: 'Hiroki Touchi / William C. Stephens', character: 'Maine', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Bleach, Mobile Suit Gundam' },
      { id: 'ce4', name: 'Tomoyo Kurosawa / Alex Cazares', character: 'Rebecca', profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', popularFor: 'Sound! Euphonium, Land of the Lustrous' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        name: 'Complete Series',
        episodeCount: 10,
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        overview: 'David Martinez dives headfirst into the underworld of Night City.',
        airYear: 2022,
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, title: 'Let You Down', overview: 'A tragic shootout sends David\'s life spiraling, pushing him to implant a high-grade military cyberware Sandevistan.', runtimeMinutes: 24, airDate: 'Sep 13, 2022', stillUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80', voteAverage: 8.7 },
          { episodeNumber: 10, seasonNumber: 1, title: 'My Moon, My Man', overview: 'David unleashes the experimental cyberskeleton in an all-out clash with Adam Smasher across Arasaka Tower.', runtimeMinutes: 26, airDate: 'Sep 13, 2022', stillUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80', voteAverage: 9.6 }
        ]
      }
    ],
    productionCompanies: ['Studio Trigger', 'CD PROJEKT RED', 'Netflix'],
    awards: ['Anime of the Year (Crunchyroll Anime Awards 2023)', 'Best Score & Voice Acting Awards'],
    trailerYoutubeId: 'JtqIas3bYhg',
    trailerTitle: 'Official Trailer',
    streamingProviders: [
      { name: 'Netflix', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['arcane', 'blade-runner-2049', 'spider-man-spider-verse'],
    featured: false,
    trendingRank: 8,
  },
  {
    id: 'spider-man-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It\'s how you wear the mask that matters.',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2023,
    releaseDate: 'June 2, 2023',
    ageRating: 'PG',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    ratings: {
      imdb: 8.6,
      rottenTomatoes: 95,
      metacritic: 86,
      community: 9.5,
      communityVotesCount: 88000,
    },
    runtimeMinutes: 140,
    status: 'Released',
    originalLanguage: 'English, Spanish',
    originCountry: 'United States',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby Atmos' },
      { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', audioFormat: 'Dolby 5.1' },
      { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', audioFormat: 'Stereo' },
      { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', audioFormat: 'Stereo' }
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'joaquim-dos-santos', name: 'Joaquim Dos Santos', role: 'Director' },
      { id: 'kemp-powers', name: 'Kemp Powers', role: 'Director' },
      { id: 'justin-k-thompson', name: 'Justin K. Thompson', role: 'Director' }
    ],
    writers: [
      { id: 'phil-lord', name: 'Phil Lord', role: 'Writer' },
      { id: 'christopher-miller', name: 'Christopher Miller', role: 'Writer' },
      { id: 'dave-callaham', name: 'Dave Callaham', role: 'Writer' }
    ],
    cast: [
      { id: 'sm1', name: 'Shameik Moore', character: 'Miles Morales / Spider-Man', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Dope, Wu-Tang: An American Saga' },
      { id: 'sm2', name: 'Hailee Steinfeld', character: 'Gwen Stacy / Spider-Woman', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Arcane, Hawkeye' },
      { id: 'sm3', name: 'Oscar Isaac', character: 'Miguel O\'Hara / Spider-Man 2099', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'Moon Knight, Dune, Ex Machina' },
      { id: 'sm4', name: 'Daniel Kaluuya', character: 'Hobie Brown / Spider-Punk', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Get Out, Judas and the Black Messiah' }
    ],
    budget: 100000000,
    revenue: 690900000,
    productionCompanies: ['Columbia Pictures', 'Sony Pictures Animation', 'Marvel Entertainment', 'Lord Miller'],
    awards: ['7 Annie Awards including Best Feature', 'Critics Choice Movie Award for Best Animated Feature', 'Oscar Nominated'],
    trailerYoutubeId: 'cqGjhVJWtEg',
    trailerTitle: 'Official Trailer 2',
    streamingProviders: [
      { name: 'Netflix', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Apple TV', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80', type: 'buy' }
    ],
    similarMediaIds: ['arcane', 'cyberpunk-edgerunners', 'dune-2'],
    featured: false,
    trendingRank: 9,
  },
  {
    id: 'spirited-away',
    title: 'Spirited Away',
    originalTitle: '千と千尋の神隠し',
    tagline: 'The tunnel led Chihiro to a mysterious world...',
    overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    type: 'anime',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2001,
    releaseDate: 'July 20, 2001',
    ageRating: 'PG',
    genres: ['Animation', 'Fantasy', 'Adventure', 'Family'],
    ratings: {
      imdb: 8.6,
      rottenTomatoes: 97,
      metacritic: 96,
      community: 9.8,
      communityVotesCount: 145000,
    },
    runtimeMinutes: 125,
    status: 'Released',
    originalLanguage: 'Japanese',
    originCountry: 'Japan',
    dubbedLanguages: [
      { code: 'ja-JP', name: 'Japanese (Original)', nativeName: '日本語', audioFormat: 'Dolby 5.1', isOriginal: true },
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'es-ES', name: 'Spanish', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'zh-CN', name: 'Mandarin Chinese', nativeName: '普通话', audioFormat: 'Dolby 5.1' },
      { code: 'ko-KR', name: 'Korean', nativeName: '한국어', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'hayao-miyazaki', name: 'Hayao Miyazaki', role: 'Director' }
    ],
    writers: [
      { id: 'h-miyazaki', name: 'Hayao Miyazaki', role: 'Writer' }
    ],
    composers: [
      { id: 'joe-hisaishi', name: 'Joe Hisaishi', role: 'Composer' }
    ],
    cast: [
      { id: 'sa1', name: 'Rumi Hiiragi / Daveigh Chase', character: 'Chihiro Ogino / Sen', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'Ponyo, Lilo & Stitch' },
      { id: 'sa2', name: 'Miyu Irino / Jason Marsden', character: 'Haku / Spirit of the Kohaku River', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Kingdom Hearts, A Silent Voice' },
      { id: 'sa3', name: 'Mari Natsuki / Suzanne Pleshette', character: 'Yubaba / Zeniba', profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', popularFor: 'Moana, The Birds' }
    ],
    budget: 19000000,
    revenue: 395800000,
    productionCompanies: ['Studio Ghibli', 'Tokuma Shoten', 'Nippon Television Network'],
    awards: ['Academy Award for Best Animated Feature', 'Golden Bear (Berlin International Film Festival)', 'Japan Academy Film Prize'],
    trailerYoutubeId: 'ByXuk9QqQkk',
    trailerTitle: 'Ghibli Classic Trailer',
    streamingProviders: [
      { name: 'Max', logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Netflix', logoUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['arcane', 'spider-man-spider-verse', 'cyberpunk-edgerunners'],
    featured: false,
    trendingRank: 10,
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    originalTitle: 'Blade Runner 2049',
    tagline: 'The key to the future is finally unearthed.',
    overview: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2017,
    releaseDate: 'October 6, 2017',
    ageRating: 'R',
    genres: ['Sci-Fi', 'Mystery', 'Drama', 'Action'],
    ratings: {
      imdb: 8.0,
      rottenTomatoes: 88,
      metacritic: 81,
      community: 9.2,
      communityVotesCount: 75000,
    },
    runtimeMinutes: 164,
    status: 'Released',
    originalLanguage: 'English, Japanese, Somali',
    originCountry: 'United States, United Kingdom, Canada',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'denis-villeneuve', name: 'Denis Villeneuve', role: 'Director' }
    ],
    writers: [
      { id: 'hampton-fancher', name: 'Hampton Fancher', role: 'Writer' },
      { id: 'michael-green', name: 'Michael Green', role: 'Writer' }
    ],
    composers: [
      { id: 'hans-zimmer', name: 'Hans Zimmer', role: 'Composer' },
      { id: 'benjamin-wallfisch', name: 'Benjamin Wallfisch', role: 'Composer' }
    ],
    cast: [
      { id: 'br1', name: 'Ryan Gosling', character: 'Officer K / Joe', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'La La Land, Drive, Barbie', birthPlace: 'Ontario, Canada' },
      { id: 'br2', name: 'Harrison Ford', character: 'Rick Deckard', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Star Wars, Indiana Jones', birthPlace: 'Illinois, USA' },
      { id: 'br3', name: 'Ana de Armas', character: 'Joi', profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', popularFor: 'Knives Out, No Time to Die', birthPlace: 'Havana, Cuba' },
      { id: 'br4', name: 'Sylvia Hoeks', character: 'Luv', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'See, The Girl in the Spider\'s Web', birthPlace: 'Maarheeze, Netherlands' }
    ],
    budget: 150000000,
    revenue: 267700000,
    productionCompanies: ['Alcon Entertainment', 'Columbia Pictures', 'Scott Free Productions'],
    awards: ['2 Academy Awards (Best Cinematography - Roger Deakins, Best Visual Effects)', '2 BAFTA Awards'],
    trailerYoutubeId: 'gCcx85zbxz4',
    trailerTitle: 'Official Trailer',
    streamingProviders: [
      { name: 'Max', logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80', type: 'stream' },
      { name: 'Apple TV', logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&auto=format&fit=crop&q=80', type: 'buy' }
    ],
    similarMediaIds: ['dune-2', 'interstellar', 'cyberpunk-edgerunners'],
    featured: false,
    trendingRank: 11,
  },
  {
    id: 'succession',
    title: 'Succession',
    originalTitle: 'Succession',
    tagline: 'Make your move.',
    overview: 'The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down from the company, triggering cutthroat familial warfare.',
    type: 'tv',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2018,
    releaseDate: 'June 3, 2018',
    ageRating: 'TV-MA',
    genres: ['Drama'],
    ratings: {
      imdb: 8.9,
      rottenTomatoes: 95,
      metacritic: 90,
      community: 9.6,
      communityVotesCount: 82000,
    },
    totalSeasons: 4,
    totalEpisodes: 39,
    status: 'Ended',
    originalLanguage: 'English',
    originCountry: 'United States',
    dubbedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', audioFormat: 'Dolby Atmos', isOriginal: true },
      { code: 'es-419', name: 'Spanish (LatAm)', nativeName: 'Español', audioFormat: 'Dolby 5.1' },
      { code: 'fr-FR', name: 'French', nativeName: 'Français', audioFormat: 'Dolby 5.1' },
      { code: 'de-DE', name: 'German', nativeName: 'Deutsch', audioFormat: 'Dolby 5.1' },
      { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', audioFormat: 'Dolby 5.1' },
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', audioFormat: 'Dolby 5.1' },
      { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', audioFormat: 'Dolby 5.1' },
    ],
    subtitledLanguages: GLOBAL_LANGUAGES.map(l => ({ ...l, hasSDH: true, hasCC: true })),
    directors: [
      { id: 'mark-mylod', name: 'Mark Mylod', role: 'Director' }
    ],
    creators: [
      { id: 'jesse-armstrong', name: 'Jesse Armstrong', role: 'Creator' }
    ],
    writers: [
      { id: 'j-armstrong', name: 'Jesse Armstrong', role: 'Writer' }
    ],
    composers: [
      { id: 'nicholas-britell', name: 'Nicholas Britell', role: 'Composer' }
    ],
    cast: [
      { id: 'suc1', name: 'Brian Cox', character: 'Logan Roy', profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', popularFor: 'Braveheart, Troy' },
      { id: 'suc2', name: 'Jeremy Strong', character: 'Kendall Roy', profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', popularFor: 'The Big Short, Armageddon Time' },
      { id: 'suc3', name: 'Sarah Snook', character: 'Siobhan "Shiv" Roy', profileUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', popularFor: 'Predestination, Run Rabbit Run' },
      { id: 'suc4', name: 'Kieran Culkin', character: 'Roman Roy', profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', popularFor: 'Scott Pilgrim vs. the World, Igby Goes Down' },
      { id: 'suc5', name: 'Matthew Macfadyen', character: 'Tom Wambsgans', profileUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80', popularFor: 'Pride & Prejudice, Deadpool & Wolverine' }
    ],
    seasons: [
      {
        seasonNumber: 4,
        name: 'Season 4 (Final Season)',
        episodeCount: 10,
        posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
        overview: 'The sale of media conglomerate Waystar Royco moves ever closer.',
        airYear: 2023,
        episodes: [
          { episodeNumber: 3, seasonNumber: 4, title: 'Connor\'s Wedding', overview: 'A shocking event sends shockwaves through the family during a lavish harbor wedding.', runtimeMinutes: 62, airDate: 'Apr 9, 2023', stillUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80', voteAverage: 9.9 },
          { episodeNumber: 10, seasonNumber: 4, title: 'With Open Eyes', overview: 'The final board meeting decides the ultimate fate of Waystar Royco and the Roy legacy.', runtimeMinutes: 90, airDate: 'May 28, 2023', stillUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80', voteAverage: 9.7 }
        ]
      }
    ],
    productionCompanies: ['Gary Sanchez Productions', 'Project Zeus', 'HBO Entertainment'],
    awards: ['19 Primetime Emmy Awards including 3x Outstanding Drama Series', '5 Golden Globes'],
    trailerYoutubeId: 'ozqc-n_6g9c',
    trailerTitle: 'Season 4 Official Trailer',
    streamingProviders: [
      { name: 'Max', logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=80', type: 'stream' }
    ],
    similarMediaIds: ['severance', 'shogun', 'oppenheimer'],
    featured: false,
    trendingRank: 12,
  },
];
