document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://evolutia-back.onrender.com";

  const loginButton = document.getElementById("login-button");
  const profileButton = document.getElementById("profile-button");
  const logoutButton = document.getElementById("logout-button");

  // 🔁 Détection du contexte (racine ou sous-dossier)
  const isRoot = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
  const pathPrefix = isRoot ? "evolut-IAlanding/html/" : "";

  const redirectToRoot = () => {
    window.location.href = window.location.origin + "/index.html";
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

  updateAuthButtons();

  // 🔐 Redirection depuis le bouton "Profil"
  if (profileButton) {
    profileButton.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      window.location.href = token
        ? `${pathPrefix}profil.html`
        : `${pathPrefix}login.html`;
    });
  }

  // 📥 Connexion
  const loginForm = document.querySelector(".login-right form, .login-container form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Connexion réussie !");
          localStorage.setItem("token", data.token);
          updateAuthButtons();
          redirectToRoot();
        } else {
          alert(data.error || "Erreur de connexion.");
        }
      } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        alert("Une erreur est survenue lors de la connexion.");
      }
    });
  }

  // 📝 Inscription
  const registerForm = document.querySelector(".register-right form, .register-container form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = registerForm.querySelector('input[type="email"]').value;
      const username = registerForm.querySelector('input[type="text"]').value;
      const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
      const password = passwordInputs[0]?.value || "";
      const confirmPassword = passwordInputs[1]?.value || password;

      if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Inscription réussie !");
          localStorage.setItem("token", data.token);
          updateAuthButtons();
          redirectToRoot();
        } else {
          alert(data.error || "Erreur lors de l'inscription.");
        }
      } catch (err) {
        console.error("Erreur lors de l'inscription :", err);
        alert("Une erreur est survenue lors de l'inscription.");
      }
    });
  }

  // 👤 Affichage des infos sur la page profil
  if (window.location.pathname.includes("profil.html")) {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/user-info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username && data.email) {
            document.getElementById("username").textContent = data.username;
            document.getElementById("email").textContent = data.email;

            const offerElement = document.getElementById("selected-offer");
            if (offerElement) {
              offerElement.textContent = data.selectedPlan || "Aucune";
            }
          } else {
            localStorage.removeItem("token");
            updateAuthButtons();
            window.location.href = `${pathPrefix}login.html`;
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du profil :", error);
          localStorage.removeItem("token");
          updateAuthButtons();
          window.location.href = `${pathPrefix}login.html`;
        });
    }
  }

  // 🚪 Déconnexion
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Erreur lors de la déconnexion :", error);
        }
      }
      localStorage.removeItem("token");
      alert("Vous avez été déconnecté.");
      updateAuthButtons();
      redirectToRoot(); // 🔁 Redirection propre vers /index.html
    });
  }
});
