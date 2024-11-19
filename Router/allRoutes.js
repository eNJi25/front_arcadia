import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/home.html", [], "/assets/js/home.js"),
  new Route(
    "/services",
    "Services",
    "/pages/services.html",
    [],
    "/assets/js/services.js"
  ),
  new Route(
    "/habitats",
    "Habitats",
    "/pages/habitats.html",
    [],
    "/assets/js/habitat.js"
  ),
  new Route(
    "/contact",
    "Contact",
    "/pages/contact.html",
    [],
    "/assets/js/contact.js"
  ),
  new Route(
    "/tableau",
    "Tableau de bord",
    "/pages/tableau.html",
    ["admin", "employee"],
    "/assets/js/tableau.js"
  ),
  new Route(
    "/signin",
    "Connexion",
    "/pages/auth/signin.html",
    [],
    "/assets/js/auth/signin.js"
  ),
  new Route(
    "/editPassword",
    "Mot de passe oublié",
    "/pages/auth/editPassword.html",
    []
  ),
  new Route(
    "/rapports",
    "Rapports vétérinaires",
    "/pages/rapports.html",
    [],
    "/assets/js/rapports.js"
  ),
  new Route(
    "/savane",
    "Animaux de la savane",
    "/pages/animaux/savane.html",
    [],
    "/assets/js/animaux/savane.js"
  ),
  new Route(
    "/jungle",
    "Animaux de la jungle",
    "/pages/animaux/jungle.html",
    [],
    "/assets/js/animaux/jungle.js"
  ),
  new Route(
    "/savane",
    "Animaux du marais",
    "/pages/animaux/marais.html",
    [],
    "/assets/js/animaux/marais.js"
  ),
];
//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia";
