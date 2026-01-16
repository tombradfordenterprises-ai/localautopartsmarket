// Navigate to results page with query params
function goToSearchResults() {
  const params = new URLSearchParams({
    year: document.getElementById("year").value,
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    part: document.getElementById("part").value
  });
  window.location.href = `results.html?${params.toString()}`;
}

// Go to results page showing all listings
function showAllListings() { window.location.href = "results.html"; }

// Fetch listings from backend and render
async function fetchAndRenderListings(filters = {}) {
  try {
    const res = await fetch("/api/listings");
    const listings = await res.json();

    const container = document.getElementById("results") || document.getElementById("listings");
    if (!container) return;
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
        <p>${list.street}, ${list.city}, ${list.county}, ${list.state}</p>
        <p>${list.description || ""}</p>
      `;
      div.addEventListener("click", () => {
        showModal(`
          <h3>${list.year} ${list.make} ${list.model} - ${list.part}</h3>
          <p>$${list.price}</p>
          <p>${list.street}, ${list.city}, ${list.county}, ${list.state}</p>
          <p>${list.description || ""}</p>
          ${list.images.map(img => `<img src="${img}" style="max-width:100%;margin-top:10px;">`).join('')}
        `);
      });
      container.appendChild(div);
    });
  } catch (err) { console.error(err); }
}

// Modal functions
function showModal(content) {
  const modal = document.getElementById("modal");
  if (!modal) return;
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = content;
  modal.style.display = "flex";
}
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";
}

// Render listings if container exists
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("listings") || document.getElementById("results");
  if (container) fetchAndRenderListings();
});

   
