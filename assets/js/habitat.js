// Fetch affichage des 4 derniers animaux de chaque habitat
fetch("https://127.0.0.1:8000/api/habitat/showAll")
  .then((response) => response.json())
  .then((habitats) => {
    const habitatsContainer = document.getElementById("habitats-container");
    habitats.forEach((habitat) => {
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
            const imageSlug = animal.imageSlug;
            const animalID = animal.id;
            const animalCard = document.createElement("div");
            animalCard.classList.add("col-sm-12", "col-md-4", "col-lg-3");
            animalCard.innerHTML = `
                <div class="img-card">
                  <img class="w-100 rounded" src="https://127.0.0.1:8000${imageSlug}" alt="${animal.prenom}">
                  <div class="action-image-buttons">
                    <button type="button" class="btn text-primary edit-animal" data-id="${animal.id}" data-bs-toggle="modal" data-bs-target="#EditAnimalModal">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" class="btn text-success create-rapport" data-id="${animalID}" data-name="${animal.prenom}"
                      data-image="https://127.0.0.1:8000${imageSlug}" data-bs-toggle="modal" data-bs-target="#RapportAnimalModal">
                      <i class="bi bi-file-medical"></i>
                    </button>
                    <button type="button" class="btn text-danger delete-animal" data-id="${animalID}" data-name="${animal.prenom}" 
                      data-image="https://127.0.0.1:8000${imageSlug}" data-bs-toggle="modal" data-bs-target="#SuppressionAnimalModal">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <button class="btn btn-secondary info-animal" data-id="${animalID}" data-bs-toggle="modal" data-bs-target="#InfosAnimalModal">
                    En savoir plus
                  </button>
                </div>
      `;

            animalsContainer.appendChild(animalCard);

            const rapportButton = animalCard.querySelector(".create-rapport");
            rapportButton.addEventListener("click", function () {
              const animalId = this.getAttribute("data-id");
              document.getElementById("animalId").value = animalId;
            });

            const infoButton = animalCard.querySelector(".info-animal");
            infoButton.addEventListener("click", function () {
              const animalId = this.getAttribute("data-id");
              fetch(`https://127.0.0.1:8000/api/animal/show/${animalId}`)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(
                      "Erreur lors de la récupération des informations de l'animal."
                    );
                  }
                  return response.json();
                })
                .then((animal) => {
                  const modalLabel = document.getElementById(
                    "InfosAnimalModalLabel"
                  );
                  const lastMealDate = document.getElementById("lastMealDate");
                  const lastMealFood = document.getElementById("lastMealFood");
                  const lastMealQuantity =
                    document.getElementById("lastMealQuantity");

                  if (modalLabel) {
                    modalLabel.textContent = `Informations sur ${animal.prenom}`;
                  }
                  if (lastMealDate) {
                    lastMealDate.textContent = animal.date_repas
                      ? new Date(animal.date_repas).toLocaleDateString("fr-FR")
                      : "Non disponible";
                  }
                  if (lastMealFood) {
                    lastMealFood.textContent =
                      animal.nourriture || "Non disponible";
                  }
                  if (lastMealQuantity) {
                    lastMealQuantity.textContent = animal.quantite_repas
                      ? `${animal.quantite_repas} kg`
                      : "Non disponible";
                  }

                  const modalElement =
                    document.getElementById("InfosAnimalModal");
                  if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                  } else {
                    console.error("La modale InfosAnimalModal n'existe pas.");
                  }
                })
                .catch((error) => {
                  console.error(
                    "Erreur lors de la récupération des informations de l'animal :",
                    error
                  );
                  alert(
                    "Impossible de récupérer les informations de l'animal."
                  );
                });
            });

            const deleteButton = animalCard.querySelector(".delete-animal");
            deleteButton.addEventListener("click", function () {
              const animalId = this.getAttribute("data-id");
              const animalName = this.getAttribute("data-name");
              const animalImage = this.getAttribute("data-image");

              document.getElementById("delete-animal-id").value = animalId;
              document.getElementById(
                "SuppressionAnimalModalLabel"
              ).textContent = `Êtes-vous sûr de vouloir supprimer ${animalName}?`;
              document.getElementById("delete-animal-image").src = animalImage;
            });
          });
        })
        .catch((error) => console.error("Error fetching animals:", error));
    });
  });

// Fetch pour ajouter un animal
document
  .getElementById("ajouter-animal-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const prenom = document.getElementById("prenomAnimalInput").value;
    const race = document.getElementById("raceAnimalInput").value;
    const habitat = document.querySelector(
      'input[name="habitatAnimal"]:checked'
    )?.value;
    const photo = document.getElementById("photoAnimalInput").files[0];

    if (!prenom || !race || !habitat || !photo) {
      alert("Tous les champs sont nécessaires.");
      return;
    }

    const formData = new FormData();
    formData.append("prenomAnimal", prenom);
    formData.append("habitatAnimal", habitat);
    formData.append("raceAnimal", race);
    formData.append("photo", photo);

    fetch("https://127.0.0.1:8000/api/animal/new", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          alert("Animal ajouté avec succès!");
        }
      })
      .then(() => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("AjoutAnimalModal")
        );
        modal.hide();
        location.reload();
      })
      .catch((error) => {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'ajout de l'animal.");
      });
  });

// Fetch pour modifier un animal
document
  .getElementById("editAnimalForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const animalId = document.querySelector(".edit-animal").dataset.id;
    const formData = {
      dateRepas: document.getElementById("dateRepasInput").value,
      nourriture: document.getElementById("nourritureAnimalInput").value,
      quantite: parseFloat(document.getElementById("quantiteInput").value) || 0,
    };

    fetch(`https://127.0.0.1:8000/api/animal/edit/${animalId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la modification de l'animal.");
        }
        return response.json();
      })
      .then((data) => {
        alert(
          "Les informations de l'animal ont été mises à jour avec succès !"
        );
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("EditAnimalModal")
        );
        modal.hide();
        location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la modification de l'animal :", error);
        alert("Une erreur est survenue lors de la mise à jour.");
      });
  });

// Fetch pour un nouveau rapport vétérinaire
document
  .getElementById("submitRapportButton")
  .addEventListener("click", function () {
    const animalId = document.getElementById("animalId").value.trim();
    const etatAnimal = document.getElementById("etatAnimalInput").value.trim();
    const nourriturePropose = document
      .getElementById("nourritureProposeInput")
      .value.trim();
    const quantitePropose =
      parseFloat(document.getElementById("quantiteProposeInput").value) || 0;
    const dateRapport = document
      .getElementById("dateRapportInput")
      .value.trim();
    const detailHabitat = document
      .getElementById("detailHabitatInput")
      .value.trim();

    if (!animalId || !etatAnimal) {
      alert("L'ID de l'animal et l'état de l'animal sont requis !");
      return;
    }

    const formData = {
      animal: animalId,
      etat_animal: etatAnimal,
      nourriture_propose: nourriturePropose,
      quantite_propose: quantitePropose,
      date_rapport: dateRapport,
      detail_habitat: detailHabitat,
    };

    fetch("https://127.0.0.1:8000/api/rapports/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la création du rapport.");
        }
        return response.json();
      })
      .then((data) => {
        alert("Le rapport vétérinaire a été ajouté avec succès !");
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("RapportAnimalModal")
        );
        modal.hide();
        location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la création du rapport :", error);
        alert("Une erreur est survenue lors de l'ajout du rapport.");
      });
  });

// Fetch pour supprimer un animal
function openDeleteModal(animalId, animalName) {
  const modalLabel = document.getElementById("SuppressionAnimalModalLabel");
  const deleteInput = document.getElementById("delete-animal-id");

  modalLabel.textContent = `Supprimer ${animalName} ?`;
  deleteInput.value = animalId;

  const modal = new bootstrap.Modal(
    document.getElementById("SuppressionAnimalModal")
  );
  modal.show();
}

document
  .getElementById("confirmDeleteButton")
  .addEventListener("click", function () {
    const animalId = document.getElementById("delete-animal-id").value;
    const animalName = document
      .getElementById("SuppressionAnimalModalLabel")
      .textContent.split(" ")[1];

    fetch(`https://127.0.0.1:8000/api/animal/delete/${animalId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'animal.");
        }
        return response.json();
      })
      .then(() => {
        alert(`L'animal ${animalName} a été supprimé avec succès !`);
        location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'animal :", error);
        alert("Une erreur est survenue lors de la suppression.");
      });
  });
