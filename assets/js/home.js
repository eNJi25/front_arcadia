// Fetch des habitats

fetch("https://127.0.0.1:8000/api/habitat/showAll", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des habitats");
    }
    return response.json();
  })
  .then((data) => {
    const habitatContainer = document.getElementById("habitat-container");

    data.forEach((habitat) => {
      const habitatCard = document.createElement("div");
      habitatCard.classList.add("col-sm-12", "col-md-4", "col-lg-4");

      habitatCard.innerHTML = `
            <div class="card">
                <img class="card-img" src="https://127.0.0.1:8000/${habitat.image}" alt="${habitat.nom}">
                <div class="d-flex flex-column justify-content-between align-items-center card-img-overlay">
                    <h2 class="card-title text-white">${habitat.nom}</h2>
                    <a href="/habitats" class="btn btn-secondary">Découvrir</a>
                </div>
            </div>
        `;

      habitatContainer.appendChild(habitatCard);
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des habitats:", error);
  });

// Fetch des services
fetch("https://127.0.0.1:8000/api/services/showAll", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const carouselContainer = document.getElementById("carouselItemsContainer");
    let isActive = true;

    data.forEach((service, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (isActive) {
        carouselItem.classList.add("active");
        isActive = false;
      }

      carouselItem.innerHTML = `
        <img src="https://127.0.0.1:8000/${service.image}" class="d-block w-100" alt="${service.nom}">
        <div class="carousel-caption d-flex justify-content-start">
            <h3>${service.nom}</h3>
        </div>
      `;

      carouselContainer.appendChild(carouselItem);
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des services:", error);
  });

//Fetch des animaux
fetch("https://127.0.0.1:8000/api/animal/showAnimalsHome")
  .then((response) => response.json())
  .then((data) => {
    const animalsElement = document.getElementById("animals");

    if (data && data.length > 0) {
      data.forEach((item) => {
        const animal = item.animal;

        const cardHTML = `
                    <div class="col-sm-12 col-md-4 col-lg-4">
                        <div class="card">
                            <img class="card-img" src="https://127.0.0.1:8000/${animal.images[0]}" alt="${animal.prenom}">
                            <div class="d-flex flex-column justify-content-between align-items-center card-img-overlay">
                                <h2 class="card-title text-white">${animal.prenom}</h2>
                                <a href="#" class="btn btn-secondary">Découvrir</a>
                            </div>
                        </div>
                    </div>`;

        animalsElement.innerHTML += cardHTML;
      });
    } else {
      animalsElement.innerHTML = "<p>Aucun animal trouvé.</p>";
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des animaux:", error);
  });

// Fetch des avis
const avisContainer = document.getElementById("avis-container");

if (avisContainer) {
  fetch("https://127.0.0.1:8000/api/avis/valides")
    .then((response) => response.json())
    .then((avis) => {
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

// Fetch de l'envoi d'un avis

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
    avisContainer.innerHTML = "";
  } catch (error) {
    alert("Une erreur est survenue, veuillez réessayer.");
  }
});
