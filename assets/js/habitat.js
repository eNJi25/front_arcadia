// Fetch affichage
// Appel pour récupérer tous les habitats
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
                            <img class="img-habitat" src="${habitat.image}" alt="${habitat.nom}">
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

      // Appel pour récupérer les 4 derniers animaux de l'habitat
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
                                    <img class="w-100 rounded" src="${imageSlug}" alt="${animal.prenom}">
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


  
// Fetch pour un nouveau rapport vétérinaire
const submitButton = document.querySelector("#RapportAnimalModal .btn-primary");

if (submitButton) {
  submitButton.addEventListener("click", function () {
    // Récupérer les valeurs du formulaire
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

    // Vérifier si les champs obligatoires sont remplis
    if (!etatAnimal || !nourriturePropose || !quantitePropose || !dateRapport) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Créer un objet avec les données du formulaire
    const formData = {
      detail: `Etat de l'animal: ${etatAnimal}, Nourriture proposée: ${nourriturePropose}, Quantité: ${quantitePropose}kg, Date: ${dateRapport}, Détail de l\'état de l\'animal: ${detailEtatFac}, Détail de l\'habitat: ${detailHabitat}`,
      animal: { id: 1 }, // Remplacez 1 par l'ID réel de l'animal
      user: { id: 1 }, // Remplacez 1 par l'ID réel de l'utilisateur
      createdAt: dateRapport, // Date du rapport
    };

    // Envoyer les données avec Fetch API
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
          $("#RapportAnimalModal").modal("hide"); // Fermer la modale après la création
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
