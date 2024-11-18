const mailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("btnSignin");

signInButton.addEventListener("click", checkCredentials);

async function checkCredentials() {
  const email = mailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("L'email et le mot de passe sont requis.");
    return;
  }

  const loginData = {
    username: email,
    password: password,
  };

  try {
    const response = await fetch("https://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok) {
      // Connexion réussie
      alert("Connexion réussie !");
      console.log("Données utilisateur :", data);

      setToken(data.apiToken);
      setCookie("role", data.roles[0], 7);

      window.location.replace("/");
    } else {
      // Erreur de connexion
      alert(data.message || "Une erreur s'est produite.");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    alert("Une erreur est survenue lors de la tentative de connexion.");
  }
}
