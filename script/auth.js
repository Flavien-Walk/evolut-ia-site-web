document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://evolutia-back.onrender.com";

  // Éléments DOM
  const loginButton = document.getElementById("login-button");
  const profileButton = document.getElementById("profile-button");
  const logoutButton = document.getElementById("logout-button");
  const joinButton = document.getElementById("join-btn");
  const heroStartButton = document.getElementById("hero-start-btn");
  const globalTrialButton = document.getElementById("global-trial-btn");
  const finalStartButton = document.getElementById("final-start-btn");

  // 🔧 Détection intelligente du contexte pour les redirections
  const getCurrentContext = () => {
    const path = window.location.pathname;
    const isInHtmlFolder = path.includes('/html/');
    const isRootPage = path === '/' || path.endsWith('index.html') || path === '';
    
    return {
      isInHtmlFolder,
      isRootPage,
      basePath: isInHtmlFolder ? '../' : './',
      toHtml: isInHtmlFolder ? './' : './html/',
      toRoot: isInHtmlFolder ? '../' : './'
    };
  };

  // 🏠 Fonction de redirection vers l'accueil
  const redirectToHome = () => {
    const context = getCurrentContext();
    window.location.href = context.toRoot + 'index.html';
  };

  // 🔐 Fonction de redirection sécurisée vers login ou profil
  const handleSecureRedirect = (targetPage) => {
    const context = getCurrentContext();
    const token = localStorage.getItem("token");
    
    if (targetPage === 'profil' && !token) {
      // Si pas de token et on veut aller au profil, rediriger vers login
      window.location.href = context.toHtml + 'login.html';
      return;
    }
    
    if (targetPage === 'login' && token) {
      // Si déjà connecté et on veut aller au login, rediriger vers profil
      window.location.href = context.toHtml + 'profil.html';
      return;
    }
    
    // Redirection normale
    window.location.href = context.toHtml + targetPage + '.html';
  };

  // 🎨 Mise à jour de l'affichage des boutons d'authentification
  const updateAuthButtons = () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Utilisateur connecté
      if (loginButton) {
        loginButton.style.display = "none";
      }
      if (profileButton) {
        profileButton.style.display = "inline-block";
        profileButton.classList.add("connected");
      }
    } else {
      // Utilisateur déconnecté
      if (loginButton) {
        loginButton.style.display = "inline-block";
      }
      if (profileButton) {
        profileButton.style.display = "none";
        profileButton.classList.remove("connected");
      }
    }
  };

  // 🚀 Gestionnaire pour les boutons "Commencer" / "Essai gratuit"
  const handleStartAction = () => {
    const token = localStorage.getItem("token");
    if (token) {
      handleSecureRedirect('profil');
    } else {
      handleSecureRedirect('login');
    }
  };

  // 📱 Initialisation des event listeners
  const initializeEventListeners = () => {
    // Bouton de connexion
    if (loginButton) {
      loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleSecureRedirect('login');
      });
    }

    // Bouton de profil
    if (profileButton) {
      profileButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleSecureRedirect('profil');
      });
    }

    // Boutons "Commencer" / "Essai gratuit"
    if (joinButton) {
      joinButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleStartAction();
      });
    }

    if (heroStartButton) {
      heroStartButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleStartAction();
      });
    }

    if (globalTrialButton) {
      globalTrialButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleStartAction();
      });
    }

    if (finalStartButton) {
      finalStartButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleStartAction();
      });
    }

    // Boutons produits (redirection vers inscription/profil)
    const productButtons = document.querySelectorAll('.product-cta');
    productButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        handleStartAction();
      });
    });
  };

  // 🔄 Vérification et validation du token
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/validate-token`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        // Token invalide ou expiré
        localStorage.removeItem("token");
        updateAuthButtons();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la validation du token :", error);
      // En cas d'erreur réseau, on garde le token mais on met à jour l'affichage
      return true;
    }
  };

  // 📥 Gestion de la connexion
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        updateAuthButtons();
        
        // Redirection avec message de succès
        setTimeout(() => {
          redirectToHome();
        }, 1000);
        
        return { success: true, message: "Connexion réussie !" };
      } else {
        return { success: false, message: data.error || "Erreur de connexion." };
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      return { success: false, message: "Une erreur est survenue lors de la connexion." };
    }
  };

  // 📝 Gestion de l'inscription
  const handleRegister = async (email, username, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return { success: false, message: "Les mots de passe ne correspondent pas." };
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        updateAuthButtons();
        
        // Redirection avec message de succès
        setTimeout(() => {
          redirectToHome();
        }, 1000);
        
        return { success: true, message: "Inscription réussie !" };
      } else {
        return { success: false, message: data.error || "Erreur lors de l'inscription." };
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      return { success: false, message: "Une erreur est survenue lors de l'inscription." };
    }
  };

  // 🚪 Gestion de la déconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      } catch (error) {
        console.error("Erreur lors de la déconnexion côté serveur :", error);
      }
    }
    
    // Nettoyage local et redirection
    localStorage.removeItem("token");
    updateAuthButtons();
    
    alert("Vous avez été déconnecté.");
    redirectToHome();
  };

  // 👤 Gestion du profil utilisateur
  const loadUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleSecureRedirect('login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user-info`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const data = await response.json();

      if (response.ok && data.username && data.email) {
        // Mise à jour des éléments de profil
        const usernameElement = document.getElementById("username");
        const emailElement = document.getElementById("email");
        const offerElement = document.getElementById("selected-offer");

        if (usernameElement) usernameElement.textContent = data.username;
        if (emailElement) emailElement.textContent = data.email;
        if (offerElement) offerElement.textContent = data.selectedPlan || "Aucune";

        return data;
      } else {
        // Token invalide ou données incomplètes
        localStorage.removeItem("token");
        updateAuthButtons();
        handleSecureRedirect('login');
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      localStorage.removeItem("token");
      updateAuthButtons();
      handleSecureRedirect('login');
      return null;
    }
  };

  // 📋 Initialisation des formulaires
  const initializeForms = () => {
    // Formulaire de connexion
    const loginForm = document.querySelector(".login-right form, .login-container form, .login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const emailInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');
        
        if (!emailInput || !passwordInput) {
          alert("Formulaire de connexion invalide.");
          return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
          alert("Veuillez remplir tous les champs.");
          return;
        }

        const result = await handleLogin(email, password);
        alert(result.message);
      });
    }

    // Formulaire d'inscription
    const registerForm = document.querySelector(".register-right form, .register-container form, .register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const emailInput = registerForm.querySelector('input[type="email"]');
        const usernameInput = registerForm.querySelector('input[type="text"]');
        const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
        
        if (!emailInput || !usernameInput || passwordInputs.length < 1) {
          alert("Formulaire d'inscription invalide.");
          return;
        }

        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInputs[0].value;
        const confirmPassword = passwordInputs[1]?.value || password;

        if (!email || !username || !password) {
          alert("Veuillez remplir tous les champs.");
          return;
        }

        const result = await handleRegister(email, username, password, confirmPassword);
        alert(result.message);
      });
    }
  };

  // 🔧 Gestion spécifique des pages
  const handlePageSpecificLogic = async () => {
    const path = window.location.pathname;

    // Page de profil
    if (path.includes("profil.html")) {
      await loadUserProfile();
      
      // Gestionnaire pour le bouton de déconnexion
      if (logoutButton) {
        logoutButton.addEventListener("click", async (e) => {
          e.preventDefault();
          await handleLogout();
        });
      }
    }

    // Page de connexion - rediriger si déjà connecté
    if (path.includes("login.html")) {
      const token = localStorage.getItem("token");
      if (token && await validateToken()) {
        handleSecureRedirect('profil');
        return;
      }
    }

    // Page d'inscription - rediriger si déjà connecté
    if (path.includes("register.html")) {
      const token = localStorage.getItem("token");
      if (token && await validateToken()) {
        handleSecureRedirect('profil');
        return;
      }
    }
  };

  // 🚀 Initialisation principale
  const init = async () => {
    // Validation du token au chargement
    await validateToken();
    
    // Mise à jour de l'affichage
    updateAuthButtons();
    
    // Initialisation des event listeners
    initializeEventListeners();
    
    // Initialisation des formulaires
    initializeForms();
    
    // Logique spécifique aux pages
    await handlePageSpecificLogic();
  };

  // Démarrage de l'application
  init();

  // 🔄 Gestion des changements de token (pour la synchronisation entre onglets)
  window.addEventListener('storage', (e) => {
    if (e.key === 'token') {
      updateAuthButtons();
    }
  });

  // 🌐 Exposition de fonctions pour utilisation externe (optionnel)
  window.EvolutIA = {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateAuthButtons: updateAuthButtons,
    validateToken: validateToken
  };
});