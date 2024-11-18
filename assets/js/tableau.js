const avisContainer = document.getElementById("avis-container");

if (!avisContainer) {
  console.error("Élément #avis-container introuvable");
} else {
  const fetchAvis = async () => {
    try {
      const response = await fetch(
        "https://127.0.0.1:8000/api/avis/toValidate"
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const avisList = await response.json();

      if (avisList.length === 0) {
        avisContainer.innerHTML = "<p>Aucun avis à valider pour le moment.</p>";
        return;
      }

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
      alert(data.message);

      document.location.reload();
    } catch (error) {
      console.error("Erreur lors de la validation de l'avis :", error);
      alert("Erreur lors de la validation de l'avis.");
    }
  };

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
      alert(data.message);

      document.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
      alert("Erreur lors de la suppression de l'avis.");
    }
  };
  fetchAvis();
}

const form = document.getElementById("user-creation");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const isVeterinaire = document.getElementById("veterinaire").checked;
    const isEmployee = document.getElementById("employee").checked;

    if (!email || !password || (!isVeterinaire && !isEmployee)) {
      alert(
        "Tous les champs sont obligatoires et un rôle doit être sélectionné."
      );
      return;
    }

    const apiUrl = isVeterinaire
      ? "https://127.0.0.1:8000/api/registration/veterinaire"
      : "https://127.0.0.1:8000/api/registration/employee";

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Utilisateur créé avec succès.");
        form.reset();
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      alert(
        "Une erreur est survenue lors de la communication avec le serveur."
      );
    }
  });
}
