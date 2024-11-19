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
    fetch("/api/rapports/new", {
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
