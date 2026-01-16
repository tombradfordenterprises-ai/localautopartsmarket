function goToSearchResults() {
  const params = new URLSearchParams({
    year: document.getElementById("year").value,
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    part: document.getElementById("part").value
  });
  window.location.href = `results.html?${params.toString()}`;
}

function showAllListings() {
  window.location.href = "results.html";
}

// Function to render listings dynamically
async function fetchAndRenderListings(filters = {}) {
  try {
    const res = await fetch("/api/listings");
    const listings = await res.json();

    const container = document.getElementById("listings");
    container.innerHTML = "";

    const filtered = listings.filter(list => {
      return (!filters.year || list.year.includes(filters.year)) &&
             (!filters.make || list.make.toLowerCase().includes(filters.make.toLowerCase())) &&
             (!filters.model || list.model.toLowerCase().includes(filters.model.toLowerCase())) &&
             (!filters.part || list.part.toLowerCase().includes(filters.part.toLowerCase()));
    });

    filtered.forEach(list => {
      const div = document.createElement("div");
      div.className = "listing-card";
      div.innerHTML = `
        <h3>${list.year} ${list.make} ${list.model} - ${list.part}</h3>
        <p>$${list.price}</p>
        <p>${list.city}, ${list.county}, ${list.state}</p>
        <p>${list.description || ""}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// If listings container exists, render all listings
if (document.getElementById("listings")) fetchAndRenderListings();

   