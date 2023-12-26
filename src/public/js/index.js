const socket = io();

socket.emit("chat: message", "User disconnect");

/*------------------------------------------realTimeProducts------------------------------------------*/

socket.on("initialProducts", (products) => {
  renderProducts(products);
});

function renderProducts(products) {
  const productList = document.getElementById("productList");
  console.log(productList);
  productList.innerHTML = "";

  products.forEach((prod) => {
    const listItem = document.createElement("li");
    const textContent = `Title: ${prod.title},
             Description: ${prod.description},
             Price: $${prod.price},
             Thumbnail: ${prod.thumbnail},
             Code: ${prod.code},
             Stock: ${prod.stock}`;

    listItem.textContent = textContent;

    productList.appendChild(listItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add");
  const updateList = document.getElementById("updateList");

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;

    if (
      title &&
      description &&
      code &&
      price &&
      stock &&
      category &&
      thumbnail
    ) {
      const newProduct = {
        title,
        description,
        price,
        category,
        thumbnail,
        code,
        stock,
      };
      socket.emit("newProduct", newProduct);
    } else {
      console.error("Los campos deben estar llenos");
    }
  });

  socket.on("updateProducts", (prod) => {
    let infoProd = "<ul>";
    prod.forEach((p) => {
      infoProd += `<li>${p.title} - ${p.price} - ${p.description} - ${p.category} - ${p.thumbnail} - ${p.code} - ${p.stock} </li>`;
    });
    infoProd += "</ul>";
    updateList.innerHTML = infoProd;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteForm = document.getElementById("deleteForm");
  const btnDelete = document.getElementById("delete");
  const idProduct = document.getElementById("idProduct");

  btnDelete.addEventListener("click", () => {
    const idToDelete = idProduct.value;
    if (idToDelete) {
      socket.emit("deleteProduct", idToDelete);
    } else {
      console.error("el campo ID esta vacio");
    }
  });
});

/*------------------------------------------Chat------------------------------------------*/

let user = null;

if (!user) {
  Swal.fire({
    title: "¡Welcome to chat!",
    text: "Insert your user",
    input: "text",
    inputValidator: (value) => {
      if (!value) return "Your user is required";
    },
  }).then((input) => {
    user = input.value;
    socket.emit("newUser", user);
  });
}

const message = document.getElementById("message");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const actions = document.getElementById("actions");

btn.addEventListener("click", () => {
  socket.emit("chat-messages", {
    user,
    message: message.value,
  });
  message.value = "";
});

socket.on("message", (arrayMsgs) => {
  actions.innerHTML = "";
  const chatRender = arrayMsgs
    .map((msg) => {
      return `<p><strong>${msg.user}</strong>: ${msg.message}</p>`;
    })
    .join(" ");
  output.innerHTML = chatRender;
});

socket.on("msg", (msg) => {
  console.log(msg);
});

socket.on("newUser", (user) => {
  Toastify({
    text: `🟢 ${user} is logged in`,
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});

message.addEventListener("keypress", () => {
  socket.emit("chat:typing", user);
});

socket.on("chat:typing", (user) => {
  actions.innerHTML = `<p>${user} is writing a message...</p>`;
});
