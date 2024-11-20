const container = document.getElementById("services-container");

fetch("https://127.0.0.1:8000/api/services/showAll")
  .then((response) => response.json())
  .then((services) => {
    container.innerHTML = "";
    services.forEach((service) => {
      const isImageLeft = service.imageDirection === "gauche";
      container.innerHTML += `
        <section class="m-3" id="service-${service.id}">
          <div class="container">
            <div class="row justify-content-center align-items-center">
              <h2 class="text-center text-secondary">${service.nom}</h2>
              ${
                isImageLeft
                  ? `
                    <div class="col-6 p-2">
                      <img class="img-fluid rounded" src="https://127.0.0.1:8000/${service.image}" alt="${service.nom}">
                    </div>
                    <div class="col-6 p-2 text-secondary">
                      <p>${service.description}</p>
                    </div>`
                  : `
                    <div class="col-6 p-2 text-secondary">
                      <p>${service.description}</p>
                    </div>
                    <div class="col-6 p-2">
                      <img class="img-fluid rounded" src="https://127.0.0.1:8000/${service.image}" alt="${service.nom}">
                    </div>`
              }
            </div>
            <div class="d-flex justify-content-center">
              <button class="mx-4 btn btn-primary" id="saveServiceBtn" data-bs-toggle="modal" data-bs-target="#EditionServiceModal" data-id="${
                service.id
              }">
                Modifier
              </button>
              <button class="btn btn-danger deleteServiceBtn" data-bs-toggle="modal" data-bs-target="#DeleteServiceModal" data-id="${
                service.id
              }">
                Supprimer
              </button>
            </div>
          </div>
        </section>
      `;
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des services :", error);
  });

document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("btn-primary") &&
    event.target.dataset.bsTarget === "#EditionServiceModal"
  ) {
    const serviceId = event.target.dataset.id;
    const saveButton = document.getElementById("saveServiceBtn");
    saveButton.dataset.id = serviceId;
    console.log(`ID du service à modifier : ${serviceId}`);
  }
});

// Fetch pour l'ajout d'un service
document
  .querySelector("#AjoutModal form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = document.getElementById("nomServiceInput").value.trim();
    const description = document
      .getElementById("descriptionInput")
      .value.trim();
    const imageFile = document.getElementById("ImageInput").files[0];
    const imageDirection =
      document.querySelector("input[name='coteChoisi']:checked")?.id ===
      "gaucheRadio"
        ? "gauche"
        : "droite";

    if (!nom || !description || !imageFile || !imageDirection) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("image", imageFile);
    formData.append("imageDirection", imageDirection);

    fetch("https://127.0.0.1:8000/api/services/new", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
      })
      .then((service) => {
        alert("Service ajouté avec succès !");
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("AjoutModal")
        );
        modal.hide();
        location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du service :", error);
        alert("Une erreur est survenue lors de l'ajout du service.");
      });
  });

// Fetch pour la modification d'un service
document
  .getElementById("editServiceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceId = document.getElementById("saveServiceBtn").dataset.id;

    const titreInput = document.getElementById("titreInput").value;
    const modifDescriptionInput = document.getElementById(
      "modifDescriptionInput"
    ).value;
    const imageInput = document.getElementById("modifImageInput").files[0];
    const imageDirection = document.querySelector(
      "input[name='coteChoisi']:checked"
    )?.value;

    const formData = new FormData();
    formData.append("nom", titreInput);
    formData.append("description", modifDescriptionInput);
    formData.append("imageDirection", imageDirection);

    if (imageInput) {
      formData.append("image", imageInput);
    }

    fetch(`https://127.0.0.1:8000/api/services/update/${serviceId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la modification du service.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Réponse du serveur :", data);
        alert("Service modifié avec succès !");
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("EditionServiceModal")
        );
        modal.hide();
        location.reload();
      })
      .catch((error) => {
        console.error("Erreur :", error);
        alert("Une erreur est survenue lors de la modification du service.");
      });
  });

// Fetch pour la suppression d'un service
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("deleteServiceBtn")) {
    const serviceId = event.target.dataset.id;

    const serviceTitle = document.querySelector(
      `#service-${serviceId} h2`
    ).textContent;
    const serviceImage = document.querySelector(
      `#service-${serviceId} img`
    ).src;

    document.getElementById("serviceTitle").textContent = serviceTitle;
    document.getElementById("serviceImage").src = serviceImage;

    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    confirmDeleteBtn.dataset.id = serviceId;
  }
});

document
  .getElementById("deleteServiceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceId = document.getElementById("confirmDeleteBtn").dataset.id;

    fetch(`https://127.0.0.1:8000/api/services/delete/${serviceId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du service.");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("DeleteServiceModal")
        );
        modal.hide();
        document.getElementById(`service-${serviceId}`).remove();
      })
      .catch((error) => {
        console.error("Erreur :", error);
        alert("Une erreur est survenue lors de la suppression du service.");
      });
  });
