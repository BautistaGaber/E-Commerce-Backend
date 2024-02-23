/*------------------------------------------Register------------------------------------------*/

const form = document.getElementById("registerForm");

let resultOk = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/users/register", {
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
      }
    })
    .then((token) => {
      if (resultOk) {
        localStorage.setItem("token", token);
        window.location.replace("/views/home");
      }
      console.log(resultOk);
    });
});
