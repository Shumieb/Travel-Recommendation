// Fetch travel data from a local JSON file
async function fetchTravelData() {
  try {
    const response = await fetch("/travel_recommendation_api.json");

    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching travel data:", error);
    return null;
  }
}

async function executeSearch() {
  const keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!keyword) return;

  const data = await fetchTravelData();
  if (!data) return;

  const results = [];

  // Search beaches
  if (keyword == "beach" || keyword == "beaches") {
    data.beaches.forEach((beach) => {
      results.push({
        type: "Beach",
        name: beach.name,
        description: beach.description,
        imageUrl: beach.imageUrl,
      });
    });
  }

  // Search temples
  if (keyword == "temple" || keyword == "temples") {
    data.temples.forEach((temple) => {
      results.push({
        type: "Temple",
        name: temple.name,
        description: temple.description,
        imageUrl: temple.imageUrl,
      });
    });
  }

  // Search countries
  if (keyword == "country" || keyword == "countries") {
    data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        results.push({
          type: "Country",
          name: city.name,
          description: city.description,
          imageUrl: city.imageUrl,
        });
      });
    });
  }

  // Search countries and cities
  data.countries.forEach((country) => {
    country.cities.forEach((city) => {
      if (
        city.name.toLowerCase().includes(keyword) ||
        city.description.toLowerCase().includes(keyword)
      ) {
        results.push({
          type: "City",
          name: city.name,
          description: city.description,
          imageUrl: city.imageUrl,
        });
      }
    });
  });

  //console.log(results);

  renderResults(results);
}

function renderResults(results) {
  const homeIntro = document.getElementById("home-intro");
  homeIntro.style.display = "none";
  const container = document.getElementById("resultsContainer");
  container.style.cssText = `
  display: block;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach((item) => {
    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML = `      
      <img src="${item.imageUrl}" alt="${item.name}" />
      <h3>${item.type}: ${item.name}</h3>
      <p>${item.description}</p>
    `;

    container.appendChild(div);
  });
}

function clearSearch() {
  const homeIntro = document.getElementById("home-intro");
  homeIntro.style.display = "block";
  const container = document.getElementById("resultsContainer");
  container.style.display = "none";
}
