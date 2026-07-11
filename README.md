# TV Time Tracker

TV Time Tracker is a web app that helps users calculate how much time they have spent watching movies or TV episodes.

Users can enter a movie title, or a TV series with a season and episode number, and the app uses TMDb data to find the runtime and add it to a running total.

Live Demo: https://tv-tracker-web.onrender.com

## Features

- Search for a movie by title
- Search for a TV episode by series name, season, and episode number
- Automatically fetch runtime data from TMDb
- Add each movie or episode to a watch-time list
- Track total viewing time in minutes
- Remove entries and automatically update the total
- Animated particle background
- TMDb-powered runtime data
- Backend API proxy to keep the TMDb API key out of the frontend code

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express
- TMDb API
- Render

## How It Works

1. The user enters a movie or TV series name.
2. For TV episodes, the user can also enter a season number and episode number.
3. The frontend sends a request to the app's backend route.
4. The Express server requests runtime data from TMDb.
5. The app displays the movie or episode with its runtime.
6. The total watch time updates automatically.

## Why I Built This

I built this project to practice working with JavaScript, APIs, DOM manipulation, asynchronous requests, and dynamic page updates.

I also improved the original version by adding a small Express backend so the TMDb API key is stored securely as a Render environment variable instead of being exposed directly in the browser.

## Screenshots

![TV Time Tracker home screen](tv-tracker-homepage.png)

## API Security

The app uses a backend proxy route:

```txt
/api/duration
```

The frontend calls this route instead of calling TMDb directly.

The real TMDb API key is stored in Render as an environment variable:

```txt
TMDB_API_KEY
```

This keeps the key out of the public GitHub repository.

## Local Setup

Clone the repository:

```bash
git clone https://github.com/Muhammed-L-Ahmad/tv_tracker.git
cd tv_tracker
```

Install dependencies:

```bash
npm install
```

Create a local environment variable for your TMDb API key:

```bash
export TMDB_API_KEY=your_tmdb_api_key_here
```

Start the app:

```bash
npm start
```

Then open:

```txt
http://localhost:3000
```

## Future Improvements

- Add local storage so entries stay after refreshing the page
- Show total time in hours and minutes
- Add poster images for movies and TV shows
- Improve mobile responsiveness
- Add better error messages for missing titles or invalid episodes
- Add loading states while fetching TMDb data

## Credits

This product uses the TMDb API but is not endorsed or certified by TMDb.

## Author

Built by Muhammed Ahmad as part of my JavaScript and full-stack portfolio.
