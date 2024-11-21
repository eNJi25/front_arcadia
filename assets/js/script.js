const tokenCookieName = "X-AUTH-TOKEN";
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
  return getToken() !== null;
}

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  const role = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    switch (element.dataset.show) {
      case "disconnected":
        if (userConnected) {
          element.classList.add("d-none");
        } else {
          element.classList.remove("d-none");
        }
        break;
      case "connected":
        if (!userConnected) {
          element.classList.add("d-none");
        } else {
          element.classList.remove("d-none");
        }
        break;
      case "admin":
        if (!userConnected || role !== "admin") {
          element.classList.add("d-none");
        } else {
          element.classList.remove("d-none");
        }
        break;
      case "employee":
        if (!userConnected || role !== "employee") {
          element.classList.add("d-none");
        } else {
          element.classList.remove("d-none");
        }
        break;
      case "veterinaire":
        if (!userConnected || role !== "veterinaire") {
          element.classList.add("d-none");
        } else {
          element.classList.remove("d-none");
        }
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", showAndHideElementsForRoles);
