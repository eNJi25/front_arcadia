const avisContainer = document.getElementById("avis-container");

if (avisContainer) {
  // Effectuer le fetch dès que le script est chargé
  fetch("https://127.0.0.1:8000/api/avis/valides")
    .then((response) => response.json())
    .then((avis) => {
      console.log(avis); // Vérifie la structure de la réponse

      avis.forEach((avisItem) => {
        const avisHTML = `
                    <div class="p-2 col-sm-12 col-md-4 col-lg-4">
                        <div class="d-flex flex-column justify-content-between align-items-center bg-success">
                            <p class="m-1">${new Date(
                              avisItem.createdAt
                            ).toLocaleDateString("fr-FR")}</p>
                            <h3 class="text-secondary fw-bold">${
                              avisItem.pseudo
                            }</h3>
                            <p class="text-secondary">${
                              avisItem.commentaire
                            }</p>
                        </div>
                    </div>
                `;
        avisContainer.innerHTML += avisHTML;
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des avis :", error);
      avisContainer.innerHTML =
        "<p>Impossible de charger les avis pour le moment.</p>";
    });
} else {
  console.error("Élément #avis-container introuvable");
}

const form = document.getElementById("avis-form");
const usernameInput = document.getElementById("usernameInput");
const avisInput = document.getElementById("avisInput");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const avis = avisInput.value;

  console.log(username, avis);
  if (!username || !avis) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const data = {
    pseudo: username,
    commentaire: avis,
  };

  try {
    const response = await fetch("https://127.0.0.1:8000/api/avis/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const responseData = await response.json();

    usernameInput.value = "";
    avisInput.value = "";

    alert("Merci pour votre avis !");

    // Recharge les avis après l'envoi du nouveau
    avisContainer.innerHTML = ""; // Réinitialise l'affichage des avis
  } catch (error) {
    alert("Une erreur est survenue, veuillez réessayer.");
  }
});
