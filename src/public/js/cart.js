const checkout = document.getElementById("checkout-btn");

checkout.addEventListener("click", (e) => {
  e.preventDefault();
 
  fetch('/api/carts/purchase', {
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
      window.location.replace('/views/users')
    }) 
  })
})