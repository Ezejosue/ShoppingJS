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

function actualizarCarrito() {
  const badge = document.querySelector(".badge");
  badge.textContent = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const carritoModalBody = document.getElementById("carritoModalBody");
  carritoModalBody.innerHTML = ""; // Limpiar contenido anterior

  carrito.forEach((producto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><input type="number" value="${
              producto.cantidad
            }" min="1" id="cantidad-${producto.id}"></td>
            <td>${producto.precio * producto.cantidad}</td>
            <td>
                <button onclick="actualizarCantidad(${
                  producto.id
                })">Actualizar</button>
                <button onclick="eliminarDelCarrito(${
                  producto.id
                })">Eliminar</button>
            </td>
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
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const doc = new jspdf.jsPDF();
  let y = 20; // Posición inicial en el eje Y
  const distanciaEntreLineas = 10;
  const total = carrito.reduce(
    (total, producto) => total + producto.cantidad * producto.precio,
    0
  );

  // Encabezado de la factura
  doc.setFontSize(18);
  doc.text("Factura de Compra", 105, y, { align: "center" });
  y += distanciaEntreLineas + 10;

  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, y);
  y += distanciaEntreLineas;

  // Tabla de productos
  doc.autoTable({
    startY: y,
    head: [["Producto", "Cantidad", "Precio Unit.", "Total"]],
    body: carrito.map((producto) => [
      producto.nombre,
      producto.cantidad,
      `$${producto.precio}`,
      `$${producto.precio * producto.cantidad}`,
    ]),
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] }, // Colores en formato RGB
    margin: { top: 10 },
  });

  // Total
  y = doc.lastAutoTable.finalY + 10; // Posición después de la tabla
  doc.setFontSize(12);
  doc.text(`Total General: $${total}`, 10, y);

  // Guardar PDF
  doc.save("factura.pdf");

  carrito = []; // Vaciar el carrito
  actualizarCarrito();
  bootstrap.Modal.getInstance(document.getElementById("carritoModal")).hide(); // Cerrar el modal
}

function actualizarCantidad(idProducto) {
  const cantidadNueva = document.getElementById(`cantidad-${idProducto}`).value;
  const productoEnCarrito = carrito.find((p) => p.id === idProducto);
  if (productoEnCarrito && cantidadNueva >= 1) {
    productoEnCarrito.cantidad = parseInt(cantidadNueva);
    actualizarCarrito();
  }
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter((p) => p.id !== idProducto);
  actualizarCarrito();
}
