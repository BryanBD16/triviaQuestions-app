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