// Simulación de base de datos de productos
const productos = [
  { id: 1, nombre: "Fancy Product", precio: 40, cantidad: 10 },
  { id: 2, nombre: "Special Item", precio: 18, cantidad: 20 },
  { id: 3, nombre: "Sale Item", precio: 25, cantidad: 15 },
  { id: 4, nombre: "Popular Item", precio: 40, cantidad: 5 },
  // Añade más productos según corresponda
];

let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".btn-outline-dark");

  botonesAgregar.forEach((boton, index) => {
    boton.addEventListener("click", () => agregarAlCarrito(index + 1));
  });

  actualizarCarrito();
});

function agregarAlCarrito(idProducto) {
  const productoEncontrado = productos.find(
    (producto) => producto.id === idProducto
  );
  const productoEnCarrito = carrito.find(
    (producto) => producto.id === idProducto
  );
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...productoEncontrado, cantidad: 1 });
  }
  alert(`${productoEncontrado.nombre} añadido al carrito.`);
  actualizarCarrito();
}

// Actualización para mostrar el modal del carrito
function actualizarCarrito() {
  const badge = document.querySelector(".badge");
  const totalItems = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );
  badge.textContent = totalItems;

  // Actualizar el contenido del modal del carrito
  const carritoModalBody = document.getElementById("carritoModalBody");
  carritoModalBody.innerHTML = ""; // Limpiar contenido anterior
  carrito.forEach((producto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.precio * producto.cantidad}</td>
        `;
    carritoModalBody.appendChild(tr);
  });
}

// Función para abrir el modal del carrito
function mostrarCarritoModal() {
  const carritoModal = new bootstrap.Modal(
    document.getElementById("carritoModal")
  );
  carritoModal.show();
}

// Vincula el botón del carrito para abrir el modal
document.querySelector(".btn-outline-info").addEventListener("click", (e) => {
  e.preventDefault(); // Prevenir la recarga de la página
  mostrarCarritoModal();
});

// Confirmar compra y limpiar carrito
function confirmarCompra() {
  alert("Compra confirmada. Gracias por tu compra!");
  carrito = []; // Vaciar el carrito
  actualizarCarrito();
  bootstrap.Modal.getInstance(document.getElementById("carritoModal")).hide(); // Cerrar el modal
}
