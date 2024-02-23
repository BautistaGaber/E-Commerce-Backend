/*------------------------------------------Login------------------------------------------*/

const form = document.getElementById("loginForm");

let resultOk = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 200) {
        window.location.replace("/views/users");
      } else {
        console.log(result);
      }
    })
    .then((token) => {
      if (resultOK) {
        localStorage.setItem("token", token);
        window.location.replace("/views/users");
      }
    });
});
