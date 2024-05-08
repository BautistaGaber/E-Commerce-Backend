const form = document.getElementById("cartForm");

let resultOk = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
 
  fetch('/api/cart/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(() => {
    Swal.fire({
      title: 'Se realizó la compra con éxito',
      toast: true,
      showConfirmButton: false,
      position: 'top-end',
      timer: 1000,
    }).then(() => {
      window.location.replace('/views/profile')
    })
  })
})