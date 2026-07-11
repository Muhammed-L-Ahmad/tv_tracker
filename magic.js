document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addButton");
  const movieNameInput = document.getElementById("movieName");
  const seasonNumberInput = document.getElementById("seasonNumber");
  const episodeNumberInput = document.getElementById("episodeNumber");
  const entryList = document.getElementById("entryList");
  const totalTimeElement = document.getElementById("totalTime");

  function createParticles() {
    const particlesContainer = document.getElementById("particles");

    setInterval(() => {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * 5 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;

      const endX = Math.random() * 300 - 150;
      const endY = Math.random() * 300 - 150;
      particle.style.setProperty("--x", `${endX}px`);
      particle.style.setProperty("--y", `${endY}px`);

      particlesContainer.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 5000);
    }, 200);
  }

  createParticles();

  let totalTime = 0;

  function updateTotalTime() {
    totalTimeElement.textContent = totalTime;
  }

  async function fetchMovieOrEpisodeDuration(movieName, seasonNumber, episodeNumber) {
    const params = new URLSearchParams({
      title: movieName,
      season: seasonNumber,
      episode: episodeNumber
    });

    const response = await fetch(`/api/duration?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Could not find runtime information.");
      return null;
    }

    return data;
  }

  async function addEntry() {
    const movieName = movieNameInput.value.trim();
    const seasonNumber = seasonNumberInput.value.trim();
    const episodeNumber = episodeNumberInput.value.trim();

    if (movieName === "") {
      alert("Please enter a movie or series name.");
      return;
    }

    const result = await fetchMovieOrEpisodeDuration(
      movieName,
      seasonNumber,
      episodeNumber
    );

    if (!result) {
      return;
    }

    const duration = result.duration;
    const entryText = `${result.title} - ${duration} min`;

    const listItem = document.createElement("li");
    listItem.textContent = entryText;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove");

    removeButton.addEventListener("click", () => {
      entryList.removeChild(listItem);
      totalTime -= duration;
      updateTotalTime();
    });

    listItem.appendChild(removeButton);
    entryList.appendChild(listItem);

    totalTime += duration;
    updateTotalTime();

    movieNameInput.value = "";
    seasonNumberInput.value = "";
    episodeNumberInput.value = "";
  }

  addButton.addEventListener("click", addEntry);

  movieNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addEntry();
    }
  });
});
