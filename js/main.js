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

// AJoute le footer centralisé
document.addEventListener("DOMContentLoaded", async () => {
  const footerContainer = document.getElementById("footer");
  footerContainer.classList.add("bg-success", "text-white", "py-3", "mt-5")
  const resp = await fetch("footer.html");
  footerContainer.innerHTML = await resp.text();
});