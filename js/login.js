// Admin prédéfini
const adminUser = { username: "admin", password: "admin123" };

// Sélecteurs
const form = document.getElementById('login-form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const errorMsg = document.getElementById('error-msg');

// Redirection si déjà connecté
if(localStorage.getItem("adminLoggedIn") === "true") {
  window.location.href = "index.html"; // vers le dashboard
}

// Gestion du formulaire
form.onsubmit = function(e) {
  e.preventDefault();

  if(username.value === adminUser.username && password.value === adminUser.password) {
    // Connexion réussie → enregistrer session
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "index.html"; // redirection vers dashboard
  } else {
    errorMsg.innerText = "Nom d'utilisateur ou mot de passe incorrect";
    errorMsg.style.display = "block";
  }
};
