const tokenCookieName = "accesstoken";
const roleCookieName = "role";
const signOutBtn = document.getElementById("signOutBtn");
signOutBtn.addEventListener("click", signOut);

function signOut() {
  eraseCookie(tokenCookieName);
  eraseCookie(roleCookieName);
  window.location.reload("/");
}

function setToken(token) {
  setCookie(tokenCookieName, token, 7);
}

function getToken() {
  return getCookie(tokenCookieName);
}

function getRole() {
  return getCookie(roleCookieName);
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (const element of ca) {
    let c = element;
    while (c.startsWith(" ")) c = c.substring(1, c.length);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function isConnected() {
  return !(getToken() == null || getToken == undefined);
}

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  const role = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((elements) => {
    switch (elements.dataset.show) {
      case "disconnected":
        if (userConnected) {
          elements.classList.add("d-none");
        }
        break;
      case "connected":
        if (!userConnected) {
          elements.classList.add("d-none");
        }
        break;
      case "admin":
        if (!isConnected() || role != "admin") {
          elements.classList.add("d-none");
        }
        break;
      case "employee":
        if (!isConnected() || role != "employee") {
          elements.classList.add("d-none");
        }
        break;
      case "veterinaire":
        if (!isConnected() || role != "veterinaire") {
          elements.classList.add("d-none");
        }
        break;
    }
  });
}
