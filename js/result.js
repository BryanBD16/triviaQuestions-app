// AJoute le header centralisé
document.addEventListener("DOMContentLoaded", async () => {
  await displayResults();
});

async function displayResults() {
  const resultDiv = document.getElementById("result");
  if (!resultDiv) return; // si la page n'a pas le div result, on sort

  resultDiv.innerHTML = "";

  const resultsByCategory = {};

  // Récupérer les scores depuis sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);

    if (key && key.includes(":")) {
      const [categoryId, timestamp] = key.split(":");
      if (!resultsByCategory[categoryId]) {
        resultsByCategory[categoryId] = [];
      }
      resultsByCategory[categoryId].push({
        score: value,
        timestamp: parseInt(timestamp, 10)
      });
    }
  }

  // Récupérer les catégories (on attend la réponse avant d'utiliser categories)
  const categories = {};
  try {
    const resp = await fetch("https://opentdb.com/api_category.php");
    const data = await resp.json();
    data.trivia_categories.forEach(category => {
      // stocker le nom directement (pas un tableau)
      categories[category.id] = category.name;
    });
  } catch (err) {
    console.error("Impossible de charger les catégories :", err);
  }

    for (const categoryId in resultsByCategory) {
    const results = resultsByCategory[categoryId];
    results.sort((a, b) => a.timestamp - b.timestamp);

    const categoryName = categories[categoryId] || categoryId;

    // 🟩 Conteneur de la catégorie (colonne responsive)
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("col-lg-6", "col-12", "mb-4", "p-4");

    // 🟩 Carte (boîte avec coins arrondis et fond clair)
    const card = document.createElement("div");
    card.classList.add("card", "shadow", "border-success", "rounded-4", "h-100");
    card.style.borderWidth = "2px";
    // 🟩 En-tête de catégorie
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const categoryTitle = document.createElement("h4");
    categoryTitle.classList.add("card-title", "mb-3", "text-success");
    categoryTitle.textContent = categoryName;
    cardBody.appendChild(categoryTitle);

    // 🟩 Liste des scores
    const ul = document.createElement("ul");
    ul.classList.add("list-unstyled");

    results.forEach(r => {
    const li = document.createElement("li");
    const date = new Date(r.timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });
    li.innerHTML = `<strong>${formattedDate}</strong><br>Score: ${r.score}`;
    li.classList.add("mb-2", "p-2", "rounded-3");
    ul.appendChild(li);
    });

    cardBody.appendChild(ul);
    card.appendChild(cardBody);
    categoryContainer.appendChild(card);

    // 🟩 Ajouter dans la grille principale
    resultDiv.appendChild(categoryContainer);

  }
}
