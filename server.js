const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

app.use(express.static(__dirname));

app.get("/api/duration", async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({
        error: "TMDb API key is not configured on the server."
      });
    }

    const title = String(req.query.title || "").trim();
    const season = String(req.query.season || "").trim();
    const episode = String(req.query.episode || "").trim();

    if (!title) {
      return res.status(400).json({
        error: "Please enter a movie or series name."
      });
    }

    if (season && episode) {
      const searchUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.results || searchData.results.length === 0) {
        return res.status(404).json({
          error: "Series not found. Please check the name."
        });
      }

      const tvShow = searchData.results[0];
      const episodeUrl = `${TMDB_BASE_URL}/tv/${tvShow.id}/season/${encodeURIComponent(season)}/episode/${encodeURIComponent(episode)}?api_key=${TMDB_API_KEY}`;
      const episodeResponse = await fetch(episodeUrl);
      const episodeData = await episodeResponse.json();

      if (!episodeResponse.ok || !episodeData.runtime) {
        return res.status(404).json({
          error: "Episode runtime not found. Please check the season and episode numbers."
        });
      }

      return res.json({
        title: `${tvShow.name} Season ${season}, Episode ${episode}`,
        duration: episodeData.runtime,
        type: "tv"
      });
    }

    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return res.status(404).json({
        error: "Movie not found. Please check the name."
      });
    }

    const movie = searchData.results[0];
    const movieUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
    const movieResponse = await fetch(movieUrl);
    const movieData = await movieResponse.json();

    if (!movieResponse.ok || !movieData.runtime) {
      return res.status(404).json({
        error: "Movie runtime not found. Please check the name."
      });
    }

    return res.json({
      title: movieData.title,
      duration: movieData.runtime,
      type: "movie"
    });
  } catch (error) {
    console.error("TMDb proxy error:", error);
    return res.status(500).json({
      error: "Something went wrong while fetching data from TMDb."
    });
  }
});

app.listen(PORT, () => {
  console.log(`TV Tracker server running on port ${PORT}`);
});
