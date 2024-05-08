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
        resultOk = true;
        return result.text();
      } else {
        console.log(result);
      }
    })
    .then((token) => {
      if (resultOk) {
        console.log(token);
        console.log(resultOk)
        localStorage.setItem("token", token);
        window.location.replace("/views/users");
      }
    });
});
