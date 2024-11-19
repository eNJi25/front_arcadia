// Fetch affichage
fetch("https://127.0.0.1:8000/api/habitat/showAll")
  .then((response) => response.json())
  .then((habitats) => {
    const habitatsContainer = document.getElementById("habitats-container");
    habitats.forEach((habitat) => {
      // Créer la section de l'habitat
      const habitatSection = document.createElement("section");
      habitatSection.id = habitat.nom.toLowerCase();

      habitatSection.innerHTML = `
                    <div class="container-fluid p-0">
                        <h2 class="text-center text-secondary mb-3">${habitat.nom}</h2>
                        <p class="text-primary text-center">${habitat.description}</p>
                        <div class="row m-0">
                            <img class="img-habitat" src="https://127.0.0.1:8000/${habitat.image}" alt="${habitat.nom}">
                        </div>
                        <h3 class="text-center text-secondary my-3">Animaux de la ${habitat.nom}</h3>
                        <div class="row m-2 g-3" id="animals-${habitat.id}">
                        </div>
                        <div class="d-flex justify-content-center my-3">
                            <a href="#" class="btn btn-secondary">Tous les animaux de la ${habitat.nom}</a>
                        </div>
                    </div>
                `;

      habitatsContainer.appendChild(habitatSection);

      fetch(`https://127.0.0.1:8000/api/animal/showlastAnimals/${habitat.id}`)
        .then((response) => response.json())
        .then((animals) => {
          const animalsContainer = document.getElementById(
            `animals-${habitat.id}`
          );
          animals.forEach((animal) => {
            // Vérifier si l'animal a des images
            const imageSlug = animal.imageSlug;

            const animalCard = document.createElement("div");
            animalCard.classList.add("col-sm-12", "col-md-4", "col-lg-3");

            animalCard.innerHTML = `
                                <div class="img-card">
                                    <img class="w-100 rounded" src="https://127.0.0.1:8000${imageSlug}" alt="${animal.prenom}">
                                    <div class="action-image-buttons" data-show="admin">
                                        <button type="button" class="btn text-primary" data-bs-toggle="modal"
                                            data-bs-target="#EditAnimalModal"><i class="bi bi-pencil-square"></i></button>
                                        <button type="button" class="btn text-success" data-bs-toggle="modal"
                                            data-bs-target="#RapportAnimalModal"><i class="bi bi-file-medical"></i></button>
                                        <button type="button" class="btn text-danger" data-bs-toggle="modal"
                                            data-bs-target="#SuppressionAnimalModal"><i class="bi bi-trash"></i></button>
                                    </div>
                                    <button id="info-animal" data-bs-toggle="modal" data-bs-target="#InfosAnimalModal"
                                        class="btn btn-secondary info-animal">En savoir plus</button>
                                </div>
                            `;

            animalsContainer.appendChild(animalCard);
          });
        })
        .catch((error) => console.error("Error fetching animals:", error));
    });
  });

// Fecth pour ajouter un animal
document
  .getElementById("ajouter-animal-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const prenom = document.getElementById("prenomAnimalInput").value;
    const race = document.getElementById("raceAnimalInput").value;
    const etat = document.getElementById("etatAnimalInput").value;
    const habitat = document.querySelector(
      'input[name="habitatAnimal"]:checked'
    )?.value;
    const photo = document.getElementById("photoAnimalInput").files[0]; // Récupérer le fichier photo

    if (!prenom || !race || !etat || !habitat || !photo) {
      alert("Tous les champs sont nécessaires.");
      return;
    }

    const formData = new FormData();
    formData.append("prenomAnimal", prenom);
    formData.append("etatAnimal", etat);
    formData.append("habitatAnimal", habitat);
    formData.append("raceAnimal", race);
    formData.append("photo", photo);

    fetch("https://127.0.0.1:8000/api/animal/new", {
      method: "POST",
      body: formData,
      headers: {
        // Ici, je devrais ajouter le token d'authentification
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          alert("Animal ajouté avec succès!");
          document.getElementById("ajouter-animal-form").reset();
          $("#AjoutAnimalModal").modal("hide");
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'ajout de l'animal.");
      });
  });

// Fonction pour charger les habitats dans la modal
function chargerHabitatsDansModal() {
  fetch("https://127.0.0.1:8000/api/habitat/showAll")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des habitats.");
      }
      return response.json();
    })
    .then((habitats) => {
      const container = document.querySelector(
        "#ModificationHabitatModal .modal-body .d-flex"
      );
      container.innerHTML = "";

      habitats.forEach((habitat) => {
        const inputHtml = `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="NomHabitatInput" id="habitat-${habitat.id}" value="${habitat.id}">
            <label class="form-check-label" for="habitat-${habitat.id}">
              ${habitat.nom}
            </label>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", inputHtml);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des habitats :", error);
      const container = document.querySelector(
        "#ModificationHabitatModal .modal-body .d-flex"
      );
      container.innerHTML = "Impossible de charger les habitats.";
    });
}

// Listener pour charger les habitats à l'ouverture de la modal
document
  .getElementById("ModificationHabitatModal")
  .addEventListener("show.bs.modal", chargerHabitatsDansModal);

// Listener pour la soumission de la modification
document
  .querySelector("#ModificationHabitatModal .btn-primary")
  .addEventListener("click", () => {
    const selectedHabitat = document.querySelector(
      'input[name="NomHabitatInput"]:checked'
    );

    if (!selectedHabitat) {
      alert("Veuillez sélectionner un habitat à modifier.");
      return;
    }

    const habitatId = selectedHabitat.value;
    const nom = document.getElementById("nomHabitatInput").value.trim();
    const description = document
      .getElementById("descriptionHabitatInput")
      .value.trim();
    const imageInput = document.getElementById("ImageHabitatInput");

    const formData = new FormData();
    if (nom) formData.append("nom", nom);
    if (description) formData.append("description", description);
    if (imageInput.files.length > 0) {
      formData.append("image", imageInput.files[0]);
    }

    fetch(`https://127.0.0.1:8000/api/habitat/edit/${habitatId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour de l'habitat.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Habitat modifié avec succès :", data);
        alert("Habitat modifié avec succès.");
        location.reload(); // Rafraîchit la page après la modification
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'habitat :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
      });
  });

// Fetch pour un nouveau rapport vétérinaire
const submitButton = document.querySelector("#RapportAnimalModal .btn-primary");

if (submitButton) {
  submitButton.addEventListener("click", function () {
    const etatAnimal = document.getElementById("etatAnimalInput").value;
    const nourriturePropose = document.getElementById(
      "nourritureProposeInput"
    ).value;
    const quantitePropose = document.getElementById(
      "quantiteproposeInput"
    ).value;
    const dateRapport = document.getElementById("dateRapportInput").value;
    const detailEtatFac = document.getElementById(
      "detailEtatFacInputInput"
    ).value;
    const detailHabitat = document.getElementById("detailHabitatInput").value;

    if (!etatAnimal || !nourriturePropose || !quantitePropose || !dateRapport) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = {
      detail: `Etat de l'animal: ${etatAnimal}, Nourriture proposée: ${nourriturePropose}, Quantité: ${quantitePropose}kg, Date: ${dateRapport}, Détail de l\'état de l\'animal: ${detailEtatFac}, Détail de l\'habitat: ${detailHabitat}`,
      animal: { id: 1 },
      user: { id: 1 },
      createdAt: dateRapport,
    };

    fetch("https://127.0.0.1:8000/api/rapports/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.location) {
          alert("Rapport créé avec succès!");
          $("#RapportAnimalModal").modal("hide");
          console.log("Données du rapport:", data);
        } else {
          alert("Erreur lors de la création du rapport.");
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi des données.");
      });
  });
}
