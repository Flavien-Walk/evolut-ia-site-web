// Sélectionner les boutons
const joinButton = document.querySelector('.primary-btn');
const learnMoreButton = document.querySelector('.secondary-btn');

// Ajouter les événements de clic
joinButton.addEventListener('click', () => {
    window.location.href = "https://votre-lien-d-inscription.com"; // Remplacez ce lien par celui de votre page d'inscription
});

learnMoreButton.addEventListener('click', () => {
    window.location.href = "#plus-d-infos"; // Remplacez cela par l'ID d'une section pour plus d'informations
});
