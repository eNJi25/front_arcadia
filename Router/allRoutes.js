import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
  new Route("/", "Accueil", "/pages/home.html"),
  new Route("/services", "Services", "/pages/services.html"),
  new Route("/habitats", "Habitats", "/pages/habitats.html"),
  new Route("/contact", "Contact", "/pages/contact.html"),
  new Route("/avis", "Avis", "/pages/avis.html"),
  new Route("/connect", "Connexion", "/pages/connect.html"),
];
//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia";
