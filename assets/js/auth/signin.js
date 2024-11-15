const mailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("btnSignin");

signInButton.addEventListener("click", checkCredentials);

function checkCredentials() {
  // Appel API
  if (mailInput.value === "test" && passwordInput.value === "test") {
    // Depui l'API, integrer le vrai token et le vrai role
    const token = "azerty";
    const role = "admin";
    window.location.replace("/");
    setToken(token);
    setCookie("role", role, 7);
  }
}
