import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/home.html", [], "/assets/js/home.js"),
  new Route("/services", "Services", "/pages/services.html", []),
  new Route("/habitats", "Habitats", "/pages/habitats.html", [], "/assets/js/habitat.js"),
  new Route("/contact", "Contact", "/pages/contact.html", []),
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
    []
  ),
];
//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia";
