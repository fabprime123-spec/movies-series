export const GENRES_LIST = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

export const GENRES = GENRES_LIST;

export const GLOBAL_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', native: '日本語', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', native: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ko', name: 'Korean', native: '한국어', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', native: '中文', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', native: 'Русский', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', native: 'العربية', nativeName: 'العربية', flag: '🇸🇦' },
];

export const AVAILABLE_LANGUAGES = GLOBAL_LANGUAGES;

export const STREAMING_SERVICES = [
  'Netflix',
  'Disney+',
  'Max',
  'Prime Video',
  'Apple TV+',
  'Crunchyroll',
  'Hulu',
  'Paramount+',
];

export const DECADE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: '2020s (Modern)', value: '2020s' },
  { label: '2010s', value: '2010s' },
  { label: '2000s', value: '2000s' },
  { label: '1990s (Classics)', value: '1990s' },
  { label: '1980s (Vintage)', value: '1980s' },
];

export const SORT_OPTIONS = [
  { label: 'Trending & Popularity', value: 'popularity.desc' },
  { label: 'Top Rated by Critics', value: 'vote_average.desc' },
  { label: 'Newest Release Date', value: 'primary_release_date.desc' },
  { label: 'Most Voted', value: 'vote_count.desc' },
];
