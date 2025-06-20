document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://evolutia-back.onrender.com";
  const loginButton = document.getElementById("login-button");
  const profileButton = document.getElementById("profile-button");
  const logoutButton = document.getElementById("logout-button");

  // Chemin de base pour les redirections
  const getBasePath = () => "/html/";

  // Redirige vers la page cible (en ajoutant le préfixe du dossier)
  const redirectTo = (page) => {
    window.location.href = getBasePath() + page;
  };

  // Met à jour l'affichage des boutons selon l'état de connexion
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

  // Action quand on clique sur "Mon profil"
  if (profileButton) {
    profileButton.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      redirectTo(token ? "profil.html" : "login.html");
    });
  }

  // Action quand on clique sur "Se connecter"
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      redirectTo(token ? "profil.html" : "login.html");
    });
  }

  // Action quand on clique sur "Se déconnecter"
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
      window.location.href = "/index.html";
    });
  }

  // Charge les infos du profil si on est sur profil.html
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
        const usernameEl = document.getElementById("username");
        const emailEl = document.getElementById("email");
        const offerEl = document.getElementById("selected-offer");

        if (usernameEl) usernameEl.textContent = data.username;
        if (emailEl) emailEl.textContent = data.email;
        if (offerEl) offerEl.textContent = data.selectedPlan || "Aucune";
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

  // Si on est sur la page profil, on charge les infos
  if (window.location.pathname.includes("profil.html")) {
    loadUserProfile();
  }

  // Met à jour l'affichage des boutons
  updateAuthButtons();
});
