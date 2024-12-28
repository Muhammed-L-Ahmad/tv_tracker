const TMDB_API_KEY = '24c9041972e6e959fd5a037b15c682a9';

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const movieNameInput = document.getElementById('movieName');
    const seasonNumberInput = document.getElementById('seasonNumber');
    const episodeNumberInput = document.getElementById('episodeNumber');
    const entryList = document.getElementById('entryList');
    const totalTimeElement = document.getElementById('totalTime');

// Create particles function
function createParticles() {
    const particlesContainer = document.getElementById('particles');

    setInterval(() => {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random sizes for the particles
        const size = Math.random() * 5 + 5;  // between 5px and 10px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random starting positions
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        // Random end positions
        const endX = Math.random() * 300 - 150;  // Range: -150px to 150px
        const endY = Math.random() * 300 - 150;  // Range: -150px to 150px
        particle.style.setProperty('--x', `${endX}px`);
        particle.style.setProperty('--y', `${endY}px`);

        // Append the particle to the container
        particlesContainer.appendChild(particle);

        // Remove particle after animation is complete
        setTimeout(() => {
            particle.remove();
        }, 5000);  // Remove after 5 seconds, which matches the animation duration
    }, 200);  // Create a new particle every 200ms
}

// Initialize particles
createParticles();

let totalTime = 0;  // To keep track of the total time in minutes

// Function to fetch movie/episode duration from TMDb API
async function fetchMovieOrEpisodeDuration(movieName, seasonNumber, episodeNumber) {
    try {
        let duration = 0;

        // If season and episode are provided, treat as a TV series and fetch episode details
        if (seasonNumber && episodeNumber) {
            // First, search for the TV show by name
            const searchResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`);
            const searchData = await searchResponse.json();

            if (searchData.results.length === 0) {
                alert('Series not found. Please check the name.');
                return null;
            }

            const tvShow = searchData.results[0]; // Assuming the first result is the correct series
            const tvId = tvShow.id;

            // Fetch the specific episode runtime
            const episodeResponse = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${TMDB_API_KEY}`);
            const episodeData = await episodeResponse.json();

            if (episodeData.runtime) {
                duration = episodeData.runtime; // Duration in minutes
            } else {
                alert('Episode not found. Please check the season and episode numbers.');
                return null;
            }
        } else {
            // If it's a movie, fetch directly with the movie name
            const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`);
            const searchData = await searchResponse.json();

            if (searchData.results.length === 0) {
                alert('Movie not found. Please check the name.');
                return null;
            }

            const movie = searchData.results[0]; // Assuming the first result is the correct movie
            const movieId = movie.id;

            // Fetch the movie runtime
            const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
            const movieData = await movieResponse.json();

            if (movieData.runtime) {
                duration = movieData.runtime; // Duration in minutes
            } else {
                alert('Movie not found. Please check the name.');
                return null;
            }
        }

        return duration; // Return the duration in minutes
    } catch (error) {
        console.error('Error fetching movie or episode data:', error);
        return null;
    }
}

// Function to update the total time displayed
function updateTotalTime() {
    totalTimeElement.textContent = totalTime;
}

// Function to add an entry
async function addEntry() {
    const movieName = movieNameInput.value.trim();
    const seasonNumber = seasonNumberInput.value.trim();
    const episodeNumber = episodeNumberInput.value.trim();

    if (movieName === '') {
        alert('Please enter a movie or series name.');
        return;
    }

    // Create full movie/series name with season and episode info
    const fullMovieName = `${movieName}${seasonNumber && episodeNumber ? ` Season ${seasonNumber}, Episode ${episodeNumber}` : ''}`;
    const duration = await fetchMovieOrEpisodeDuration(fullMovieName, seasonNumber, episodeNumber);

    if (duration !== null) {
        // Create the entry content
        let entryText = `${fullMovieName} - ${duration} min`;

        // Create the list item (li)
        const listItem = document.createElement('li');

        // Add entry text to the list item
        listItem.textContent = entryText;

        // Create the remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove');

        // Add remove functionality
        removeButton.addEventListener('click', () => {
            entryList.removeChild(listItem);
            totalTime -= duration; // Subtract the duration when removed
            updateTotalTime(); // Update total time
        });

        // Add remove button to list item
        listItem.appendChild(removeButton);

        // Append the list item to the list
        entryList.appendChild(listItem);

        // Update total time
        totalTime += duration;
        updateTotalTime();

        // Clear the input fields
        movieNameInput.value = '';
        seasonNumberInput.value = '';
        episodeNumberInput.value = '';
    }
}

// Event listener for the add button
addButton.addEventListener('click', addEntry);

// Allow pressing "Enter" to trigger the add button
movieNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addEntry();
    }
});
});