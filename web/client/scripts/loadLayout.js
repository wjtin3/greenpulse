// Function to load external HTML into placeholders (#header, #footer, etc.)
async function loadLayout() {
  try {
    // Load header
    const headerEl = document.getElementById("header");
    if (headerEl) {
      const headerResponse = await fetch("header.html");
      if (!headerResponse.ok) throw new Error("Failed to load header.html");
      headerEl.innerHTML = await headerResponse.text();
    }

    // Load footer
    const footerEl = document.getElementById("footer");
    if (footerEl) {
      const footerResponse = await fetch("footer.html");
      if (!footerResponse.ok) throw new Error("Failed to load footer.html");
      footerEl.innerHTML = await footerResponse.text();
    }

    // Load calculator navigation
    const calcNavEl = document.getElementById("calc_nav");
    if (calcNavEl) {
      const calcNavResponse = await fetch("calculator_nav.html");
      if (!calcNavResponse.ok) throw new Error("Failed to load calculator_nav.html");
      calcNavEl.innerHTML = await calcNavResponse.text();
    }
  } catch (err) {
    console.error("Error loading layout:", err);
  }
}

// Run after page loads
document.addEventListener("DOMContentLoaded", loadLayout);