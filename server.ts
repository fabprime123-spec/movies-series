import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const TMDB_TOKEN =
  process.env.TMDB_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjU0NzJmOTdiNGUyMTRjZjZkMDMxZmUyMDVjNzVlMyIsIm5iZiI6MTc3NTgzOTU4NC44MDQ5OTk4LCJzdWIiOiI2OWQ5Mjk2MDlkM2RhODI2OGYwMjY2NzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.i2zWeCNYyzyVYjlH8rJPuBfq_tRPc_DjUBH5qBGmC5E";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Simple in-memory cache to make TMDB responses fast and stay within rate limits
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchFromTmdb(endpoint: string, queryParams: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(queryParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`TMDB Error (${response.status}) on ${url.pathname}:`, errorText);
    throw new Error(`TMDB responded with status ${response.status}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
  return data;
}

// Genre name to TMDB ID mapping for both Movies and TV Shows
const GENRE_MAP: Record<string, { movie: string; tv: string }> = {
  Action: { movie: "28", tv: "10759" },
  Adventure: { movie: "12", tv: "10759" },
  Animation: { movie: "16", tv: "16" },
  Anime: { movie: "16", tv: "16" },
  Comedy: { movie: "35", tv: "35" },
  Crime: { movie: "80", tv: "80" },
  Documentary: { movie: "99", tv: "99" },
  Drama: { movie: "18", tv: "18" },
  Family: { movie: "10751", tv: "10751" },
  Fantasy: { movie: "14", tv: "10765" },
  History: { movie: "36", tv: "36" },
  Horror: { movie: "27", tv: "27" },
  Music: { movie: "10402", tv: "10402" },
  Mystery: { movie: "9648", tv: "9648" },
  Romance: { movie: "10749", tv: "10749" },
  "Sci-Fi": { movie: "878", tv: "10765" },
  Thriller: { movie: "53", tv: "53" },
  War: { movie: "10752", tv: "10768" },
  Western: { movie: "37", tv: "37" },
};

function resolveGenreId(genre: string, mediaType: "movie" | "tv"): string {
  if (!genre || genre === "All Genres") return "";
  if (/^\d+$/.test(genre)) return genre;
  const mapped = GENRE_MAP[genre] || Object.entries(GENRE_MAP).find(
    ([k]) => k.toLowerCase() === genre.toLowerCase()
  )?.[1];
  return mapped ? mapped[mediaType] : genre;
}

// ---------------- TMDB API ROUTES ----------------

// 1. Trending (all, movies, shows, anime)
app.get("/api/tmdb/trending", async (req, res) => {
  try {
    const timeWindow = (req.query.timeWindow as string) || "week";
    const data = await fetchFromTmdb(`/trending/all/${timeWindow}`);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch trending titles" });
  }
});

// 2. Discover
app.get("/api/tmdb/discover", async (req, res) => {
  try {
    const type = (req.query.type as string) || "all"; // 'movie' | 'tv' | 'anime' | 'all'
    const genre = (req.query.genre as string) || "";
    const sortBy = (req.query.sortBy as string) || "popularity.desc";
    const page = (req.query.page as string) || "1";
    const year = (req.query.year as string) || "";
    const minRating = (req.query.minRating as string) || "";
    const dubbedLanguage = (req.query.dubbedLanguage as string) || "";

    const queryParams: Record<string, string> = {
      sort_by: sortBy,
      page,
      include_adult: "false",
    };

    if (year) {
      queryParams["primary_release_year"] = year;
      queryParams["first_air_date_year"] = year;
    }
    if (minRating) {
      queryParams["vote_average.gte"] = minRating;
    }
    if (dubbedLanguage) {
      queryParams["with_original_language"] = dubbedLanguage;
    }

    const isAnimeGenre = genre.toLowerCase() === "anime";

    if (type === "anime" || isAnimeGenre) {
      // Animation genre = 16, Japanese language = ja
      const animeParams: Record<string, string> = {
        ...queryParams,
        with_genres: "16",
        with_original_language: dubbedLanguage || "ja",
      };

      if (type === "movie") {
        const data = await fetchFromTmdb("/discover/movie", animeParams);
        return res.json(data);
      }

      if (type === "tv" || type === "anime") {
        const data = await fetchFromTmdb("/discover/tv", animeParams);
        return res.json(data);
      }

      // If type === "all" and anime is selected: combine anime movies & anime series
      const [animeMovies, animeTv] = await Promise.all([
        fetchFromTmdb("/discover/movie", animeParams),
        fetchFromTmdb("/discover/tv", animeParams),
      ]);
      const combined = [...(animeMovies.results || []), ...(animeTv.results || [])].sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      );
      return res.json({ results: combined, page: Number(page), total_pages: 10 });
    }

    if (type === "tv") {
      const genreId = resolveGenreId(genre, "tv");
      if (genreId) {
        queryParams["with_genres"] = genreId;
      }
      const data = await fetchFromTmdb("/discover/tv", queryParams);
      return res.json(data);
    }

    if (type === "movie") {
      const genreId = resolveGenreId(genre, "movie");
      if (genreId) {
        queryParams["with_genres"] = genreId;
      }
      const data = await fetchFromTmdb("/discover/movie", queryParams);
      return res.json(data);
    }

    // Default 'all': combine popular movies & tv with genre if specified
    if (genre) {
      const movieGenreId = resolveGenreId(genre, "movie");
      const tvGenreId = resolveGenreId(genre, "tv");
      const [movies, tv] = await Promise.all([
        fetchFromTmdb("/discover/movie", { ...queryParams, with_genres: movieGenreId }),
        fetchFromTmdb("/discover/tv", { ...queryParams, with_genres: tvGenreId }),
      ]);
      const combined = [...(movies.results || []), ...(tv.results || [])].sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      );
      return res.json({ results: combined, page: Number(page), total_pages: 10 });
    }

    const [movies, tv] = await Promise.all([
      fetchFromTmdb("/trending/movie/week", { page }),
      fetchFromTmdb("/trending/tv/week", { page }),
    ]);

    const combined = [...(movies.results || []), ...(tv.results || [])].sort(
      (a, b) => (b.popularity || 0) - (a.popularity || 0)
    );

    res.json({ results: combined, page: Number(page), total_pages: 10 });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to discover media" });
  }
});

// 3. Media Details
app.get("/api/tmdb/details/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    const mediaType = type === "tv" || type === "anime" ? "tv" : "movie";

    const appendFields =
      "credits,videos,recommendations,similar,watch/providers,translations,images," +
      (mediaType === "movie" ? "release_dates" : "content_ratings");

    const data = await fetchFromTmdb(`/${mediaType}/${id}`, {
      append_to_response: appendFields,
      include_image_language: "en,null,ja,es,fr,de,it,pt,ko,zh",
    });

    // If TV show, also fetch Season 1 episodes if available
    if (mediaType === "tv" && data.seasons && data.seasons.length > 0) {
      const firstSeason = data.seasons.find((s: any) => s.season_number > 0) || data.seasons[0];
      if (firstSeason) {
        try {
          const seasonData = await fetchFromTmdb(`/${mediaType}/${id}/season/${firstSeason.season_number}`);
          data.firstSeasonEpisodes = seasonData.episodes || [];
        } catch (e) {
          // ignore season fetch error
        }
      }
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch media details" });
  }
});

// 4. Season Episodes
app.get("/api/tmdb/season/:tvId/:seasonNumber", async (req, res) => {
  try {
    const { tvId, seasonNumber } = req.params;
    const data = await fetchFromTmdb(`/tv/${tvId}/season/${seasonNumber}`);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch season details" });
  }
});

// 5. Search Multi
app.get("/api/tmdb/search", async (req, res) => {
  try {
    const query = (req.query.query as string) || "";
    if (!query.trim()) {
      return res.json({ results: [] });
    }
    const page = (req.query.page as string) || "1";
    const data = await fetchFromTmdb("/search/multi", {
      query,
      page,
      include_adult: "false",
    });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to search TMDB" });
  }
});

// 6. Popular Actors
app.get("/api/tmdb/actors", async (req, res) => {
  try {
    const page = (req.query.page as string) || "1";
    const data = await fetchFromTmdb("/person/popular", { page });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch actors" });
  }
});

// 6b. Search Actors / Persons
app.get("/api/tmdb/search/person", async (req, res) => {
  try {
    const query = (req.query.query as string) || "";
    const page = (req.query.page as string) || "1";
    if (!query.trim()) {
      const popular = await fetchFromTmdb("/person/popular", { page });
      return res.json(popular);
    }
    const data = await fetchFromTmdb("/search/person", {
      query,
      page,
      include_adult: "false",
    });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to search actors" });
  }
});

// 7. Actor Details & Credits
app.get("/api/tmdb/actor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTmdb(`/person/${id}`, {
      append_to_response: "combined_credits,external_ids,images",
    });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch actor profile" });
  }
});

// 8. Upcoming Media
app.get("/api/tmdb/upcoming", async (req, res) => {
  try {
    const page = (req.query.page as string) || "1";
    const type = (req.query.type as string) || "all";

    if (type === "movie") {
      try {
        const data = await fetchFromTmdb("/movie/upcoming", { page });
        return res.json(data);
      } catch {
        const data = await fetchFromTmdb("/discover/movie", { page, sort_by: "popularity.desc" });
        return res.json(data);
      }
    }

    if (type === "tv") {
      try {
        const data = await fetchFromTmdb("/tv/on_the_air", { page });
        return res.json(data);
      } catch {
        const data = await fetchFromTmdb("/discover/tv", { page, sort_by: "popularity.desc" });
        return res.json(data);
      }
    }

    // Combine upcoming movies & on_the_air tv safely
    const [moviesResult, tvResult] = await Promise.allSettled([
      fetchFromTmdb("/movie/upcoming", { page }),
      fetchFromTmdb("/tv/on_the_air", { page }),
    ]);

    const movies = moviesResult.status === "fulfilled" ? moviesResult.value : { results: [] };
    const tv = tvResult.status === "fulfilled" ? tvResult.value : { results: [] };

    let combined = [...(movies.results || []), ...(tv.results || [])];
    if (combined.length === 0) {
      // Fallback to trending
      const trending = await fetchFromTmdb("/trending/all/week", { page });
      combined = trending.results || [];
    }

    res.json({ results: combined, page: Number(page), total_pages: 10 });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch upcoming media" });
  }
});

// 9. Media Images (Backdrops, Posters, Logos)
app.get("/api/tmdb/images/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    const mediaType = type === "tv" || type === "anime" ? "tv" : "movie";
    const data = await fetchFromTmdb(`/${mediaType}/${id}/images`, {
      include_image_language: "en,null,ja,es,fr,de,it,pt,ko,zh",
    });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch media images" });
  }
});

// 10. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", tmdb_configured: !!TMDB_TOKEN });
});

// ---------------- VITE MIDDLEWARE SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MovieAce Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
