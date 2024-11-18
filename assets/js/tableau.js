// Récupération de l'élément container des avis
const avisContainer = document.getElementById("avis-container");

if (!avisContainer) {
  console.error("Élément #avis-container introuvable");
} else {
  // Fonction pour récupérer et afficher les avis
  const fetchAvis = async () => {
    try {
      const response = await fetch(
        "https://127.0.0.1:8000/api/avis/toValidate"
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const avisList = await response.json();
      console.log(avisList); // Vérifie ce que tu récupères du serveur

      // Vérifie si des avis ont été récupérés
      if (avisList.length === 0) {
        avisContainer.innerHTML = "<p>Aucun avis à valider pour le moment.</p>";
        return;
      }

      // Parcours des avis et insertion dans le DOM
      avisList.forEach((avis) => {
        const avisHTML = `
          <div class="p-0 col-sm-12 col-md-4 col-lg-4 border border-secondary rounded">
            <div class="d-flex flex-column justify-content-between align-items-center bg-success rounded">
                <p class="m-1">${new Date(avis.createdAt).toLocaleDateString(
                  "fr-FR"
                )}</p>
                <h3 class="text-secondary fw-bold">${avis.pseudo}</h3>
                <p class="text-secondary">${avis.commentaire}</p>
                <div class="d-flex">
                    <button class="btn btn-secondary m-2" onclick="validerAvis(${
                      avis.id
                    })">Valider</button>
                    <button class="btn btn-danger m-2" onclick="supprimerAvis(${
                      avis.id
                    })">Supprimer</button>
                </div>
            </div>
          </div>
        `;
        avisContainer.innerHTML += avisHTML;
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
      avisContainer.innerHTML =
        "<p>Impossible de charger les avis à valider.</p>";
    }
  };

  // Fonction pour valider un avis
  window.validerAvis = async function (id) {
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/avis/accept/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      console.log("Avis validé:", data.message);
      alert(data.message); // Affiche un message de succès

      // Recharger les avis après la validation
      document.location.reload();
    } catch (error) {
      console.error("Erreur lors de la validation de l'avis :", error);
      alert("Erreur lors de la validation de l'avis.");
    }
  };

  // Fonction pour supprimer un avis
  window.supprimerAvis = async function (id) {
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/avis/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      console.log("Avis supprimé:", data.message);
      alert(data.message); // Affiche un message de succès

      // Recharger les avis après la suppression
      document.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
      alert("Erreur lors de la suppression de l'avis.");
    }
  };

  // Appeler la fonction pour récupérer et afficher les avis
  fetchAvis();
}
