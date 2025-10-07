// AJoute le header centralisé
document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header");

  const resp = await fetch("header.html");
  headerContainer.innerHTML = await resp.text();

  const currentPage = window.location.pathname.split("/").pop();
  headerContainer.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href").endsWith(currentPage)) {
    link.classList.add("active");
  }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const formCategories = document.getElementById("formCategories");
  const select = document.getElementById("Categories");
  const formQuestions = document.getElementById("formQuestions");

  const btnStartQuiz = document.getElementById("btnStartQuiz");
  const btnSubmitAnswers = document.getElementById("btnSubmitAnswers");

  // État initial : start visible, submit caché
  btnStartQuiz.classList.remove("d-none");
  btnSubmitAnswers.classList.add("d-none");

  // Remplissage du select avec les catégories
  fetch("https://opentdb.com/api_category.php")
    .then(response => response.json())
    .then(data => {
      select.innerHTML = "";
      data.trivia_categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    });

  // Start Quiz : charger les questions
  formCategories.addEventListener("submit", async (e) => {
    e.preventDefault();

    btnStartQuiz.classList.add("d-none");
    btnSubmitAnswers.classList.remove("d-none");

    const categoryId = select.value;
    if (!categoryId) {
      alert("Veuillez choisir une catégorie !");
      return;
    }

    const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=medium&type=multiple`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Nettoyer les anciennes questions
      formQuestions.innerHTML = `
        <br><br>
        <button id="btnSubmitAnswers" type="submit" class="btn btn-success">
          <i class="bi bi-play-fill"></i> Submit Answers
        </button>
      `;

      // Générer les questions
      data.results.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("mb-4", "p-3", "border", "rounded");

        const qTitle = document.createElement("h5");
        qTitle.innerHTML = `${index + 1}. ${question.question}`;
        questionDiv.appendChild(qTitle);

        // Mélanger les réponses
        const answers = [...question.incorrect_answers, question.correct_answer];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
          const div = document.createElement("div");
          div.classList.add("form-check");

          const input = document.createElement("input");
          input.classList.add("form-check-input");
          input.type = "radio";
          input.name = `question-${index}`;
          input.value = answer;

          const label = document.createElement("label");
          label.classList.add("form-check-label");
          label.textContent = answer;

          div.appendChild(input);
          div.appendChild(label);
          questionDiv.appendChild(div);
        });

        // Stocker la bonne réponse en dataset pour correction
        questionDiv.dataset.correct = question.correct_answer;

        // Insérer avant le bouton "Submit Answers"
        formQuestions.insertBefore(questionDiv, formQuestions.lastElementChild);
      });
    } catch (error) {
      console.error("Erreur API :", error);
    }
  });

  // Validation des réponses
  formQuestions.addEventListener("submit", (e) => {
    e.preventDefault();
    btnStartQuiz.classList.remove("d-none");

    const btnSubmitAnswers = document.getElementById("btnSubmitAnswers");

    btnSubmitAnswers.classList.add("d-none");

    let score = 0;
    const questions = formQuestions.querySelectorAll("div[data-correct]");

    questions.forEach((qDiv, index) => {
      const correctAnswer = qDiv.dataset.correct;
      const selected = qDiv.querySelector(`input[name="question-${index}"]:checked`);

      if (selected) {
        if (selected.value === correctAnswer) {
          score++;
          selected.parentElement.classList.add("text-success");
        } else {
          selected.parentElement.classList.add("text-danger");
          // Marquer aussi la bonne réponse
          [...qDiv.querySelectorAll("input")].forEach(inp => {
            if (inp.value === correctAnswer) {
              inp.parentElement.classList.add("text-success");
            }
          });
        }
      }
    });

    alert(`Votre score : ${score} / ${questions.length}`);
  });
});
