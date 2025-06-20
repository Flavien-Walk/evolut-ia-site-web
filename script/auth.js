document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://evolutia-back.onrender.com";

  const loginButton = document.getElementById("login-button");
  const profileButton = document.getElementById("profile-button");
  const logoutButton = document.getElementById("logout-button");

  // 🔧 Dossier où se trouvent les pages HTML
  const getBasePath = () => "/html/";

  const redirectTo = (page) => {
    window.location.href = getBasePath() + page;
  };

  const updateAuthButtons = () => {
    const token = localStorage.getItem("token");
    if (token) {
      if (loginButton) loginButton.style.display = "none";
      if (profileButton) {
        profileButton.style.display = "inline-block";
        profileButton.classList.add("connected");
      }
    } else {
      if (loginButton) loginButton.style.display = "inline-block";
      if (profileButton) {
        profileButton.style.display = "none";
        profileButton.classList.remove("connected");
      }
    }
  };

  if (profileButton) {
    profileButton.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const currentPath = window.location.pathname;

      // ⚠️ Ne redirige pas vers login si on est déjà sur profil.html
      if (currentPath.includes("profil.html")) return;

      redirectTo(token ? "profil.html" : "login.html");
    });
  }

  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      redirectTo(token ? "profil.html" : "login.html");
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.error("Erreur lors de la déconnexion côté serveur :", e);
        }
      }
      localStorage.removeItem("token");
      alert("Vous avez été déconnecté.");
      updateAuthButtons();
      window.location.href = "/index.html"; // Redirection vers la page d'accueil
    });
  }

  const loadUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirectTo("login.html");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.username && data.email) {
        document.getElementById("username").textContent = data.username;
        document.getElementById("email").textContent = data.email;
        const offerElement = document.getElementById("selected-offer");
        if (offerElement) offerElement.textContent = data.selectedPlan || "Aucune";
      } else {
        localStorage.removeItem("token");
        updateAuthButtons();
        redirectTo("login.html");
      }
    } catch (error) {
      console.error("Erreur profil :", error);
      localStorage.removeItem("token");
      updateAuthButtons();
      redirectTo("login.html");
    }
  };

  if (window.location.pathname.includes("profil.html")) {
    loadUserProfile();
  }

  updateAuthButtons();
});
