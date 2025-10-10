let allAccommodaties = []; // globaal opslaan voor filteren

// ✅ Accommodaties ophalen en tonen
async function loadAccommodaties() {
  const container = document.getElementById('accommodatiesContainer');
  container.innerHTML = '<p>Accommodaties worden geladen...</p>';

  try {
    const response = await fetch('http://localhost:3000/accommodaties');
    const data = await response.json();

    allAccommodaties = data; // opslaan voor filtergebruik
    renderAccommodaties(data);
  } catch (err) {
    console.error('Fout bij ophalen:', err);
    container.innerHTML = '<p>Kon accommodaties niet laden 😞</p>';
  }
}

// ✅ Cards renderen in de container
function renderAccommodaties(data) {
  const container = document.getElementById('accommodatiesContainer');
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Geen accommodaties gevonden 😞</p>';
    return;
  }

  data.forEach(acc => {
    const formattedTitle = acc.Naam.replace(/\s+/g, '_');
    const imagePath = `img/${formattedTitle}.jpg`;

    const col = document.createElement('div');
    col.classList.add('col-md-4', 'd-flex');

    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm', 'flex-fill');

    card.innerHTML = `
      <img src="${imagePath}" class="card-img-top" alt="${acc.Naam}" onerror="this.src='img/placeholder.jpg'">
      <div class="card-body">
        <h5 class="card-title">${acc.Naam}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${acc.type} - ${acc.prijs}</h6>
        <p class="card-text">${acc.beschrijving}</p>
        <p><strong>Regio:</strong> ${acc.regio}</p>
        <p><strong>Faciliteiten:</strong> ${acc.faciliteiten.join(', ')}</p>
      </div>
    `;

    col.appendChild(card);
    container.appendChild(col);
  });
}

// ✅ Filters toepassen
function applyFilters() {
  const button = document.querySelector('button[onclick="applyFilters()"]');
  button.classList.add('button-clicked');
  setTimeout(() => button.classList.remove('button-clicked'), 300);

  // geselecteerde filters ophalen
  const selectedTypes = [];
  if (document.getElementById('hotel1').checked) selectedTypes.push('Hotel');
  if (document.getElementById('hostel2').checked) selectedTypes.push('Hostel');
  if (document.getElementById('appartement3').checked) selectedTypes.push('Appartement');

  const selectedPrijs = [];
  if (document.getElementById('budget').checked) selectedPrijs.push('Budget');
  if (document.getElementById('middenklasse2').checked) selectedPrijs.push('Middenklasse');
  if (document.getElementById('luxe3').checked) selectedPrijs.push('Luxe');

  const selectedRegio = [];
  if (document.getElementById('oostenrijk').checked) selectedRegio.push('Oostenrijk');
  if (document.getElementById('frankrijk').checked) selectedRegio.push('Frankrijk');
  if (document.getElementById('italie').checked) selectedRegio.push('Italië');
  if (document.getElementById('zwitserland').checked) selectedRegio.push('Zwitserland');
  if (document.getElementById('duitsland').checked) selectedRegio.push('Duitsland');
  if (document.getElementById('tjechie').checked) selectedRegio.push('Tsjechië');

  // 🔹 Filter de lokaal opgeslagen accommodaties
  const filtered = allAccommodaties.filter(acc => {
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(acc.type);
    const matchPrijs = selectedPrijs.length === 0 || selectedPrijs.includes(acc.prijs);
    const matchRegio = selectedRegio.length === 0 || selectedRegio.includes(acc.regio);
    return matchType && matchPrijs && matchRegio;
  });

  renderAccommodaties(filtered);
}

// ✅ “Vraag het aan de agent” functionaliteit
const searchForm = document.querySelector('form');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchForm.querySelector('input[name="query"]').value;
  const applyBtn = document.querySelector('button[onclick="applyFilters()"]');
  
  applyBtn.textContent = "Agent denkt na... 🤔";
  applyBtn.disabled = true;
  applyBtn.classList.add("thinking");

  try {
    const res = await fetch('http://localhost:8000/agent-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query })
    });

    const data = await res.json();
    const filters = data.filters;

    // ✅ Alle checkboxes uitzetten
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // ✅ Nieuwe filters aanvinken
    filters.type?.forEach(type => {
      const typeId = type.toLowerCase();
      const checkbox = document.querySelector(`.${typeId} input[type="checkbox"]`);
      if (checkbox) checkbox.checked = true;
    });

    filters.prijs?.forEach(prijs => {
      const prijsId = prijs.toLowerCase();
      const checkbox = document.querySelector(`.${prijsId} input[type="checkbox"]`);
      if (checkbox) checkbox.checked = true;
    });

    filters.regio?.forEach(regio => {
      const regioId = regio.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const checkbox = document.querySelector(`.${regioId} input[type="checkbox"]`);
      if (checkbox) checkbox.checked = true;
    });

    // ✅ Automatisch filters toepassen
    applyFilters();

  } catch (err) {
    console.error("❌ Fout bij agent-query:", err);
  } finally {
    applyBtn.textContent = "Filters toepassen";
    applyBtn.disabled = false;
    applyBtn.classList.remove("thinking");
  }
});

// 🧹 Checkbox resetfunctie
function clearFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  renderAccommodaties(allAccommodaties);
}

// 🚀 Init bij laden van de pagina
window.addEventListener('DOMContentLoaded', loadAccommodaties);
