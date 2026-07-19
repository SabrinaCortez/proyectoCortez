let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", () => {
    configurarBotones();
    configurarModal();
    renderizarCarrito();
});

// Función personalizada para mostrar el aviso estético sin la IP
function mostrarAvisoPasteleria(mensaje) {
    const contenedor = document.getElementById("notificacion-pasteleria");
    const texto = document.getElementById("texto-notificacion");
    
    if (contenedor && texto) {
        texto.innerText = mensaje;
        contenedor.style.display = "block";
        
        // El cartel aparece y se esconde automáticamente a los 3 segundos
        setTimeout(() => {
            contenedor.style.display = "none";
        }, 3000);
    }
}

function configurarBotones() {
    const tarjetas = document.querySelectorAll(".card");

    tarjetas.forEach(tarjeta => {
        const boton = tarjeta.querySelector("button");
        const nombre = tarjeta.querySelector("h4").innerText;
        const precioTexto = tarjeta.querySelectorAll("p")[1].innerText;
        const precio = parseInt(precioTexto.replace("$", "").replace(" ", "").replace(".", ""));

        boton.addEventListener("click", () => {
            agregarAlCarrito(nombre, precio);
        });
    });
}

function configurarModal() {
    const btnVerCarrito = document.getElementById("ver-carrito");
    const btnCerrarCarrito = document.getElementById("cerrar-carrito");
    const modal = document.getElementById("modal-carrito");
    const btnFinalizar = document.getElementById("finalizar-compra");

    btnVerCarrito.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    btnCerrarCarrito.addEventListener("click", () => {
        modal.style.display = "none";
    });

    btnFinalizar.addEventListener("click", () => {
        // Validamos si realmente está vacío antes de avanzar
        if (carrito.length === 0) {
            mostrarAvisoPasteleria("El carrito está vacío.");
            return;
        }

        // 1. Primero mostramos el agradecimiento real con los productos en pantalla
        mostrarAvisoPasteleria("¡Muchas gracias por tu compra en Gi Bakkery!");
        
        // 2. Vaciamos las variables y la memoria del navegador
        carrito = [];
        localStorage.removeItem("carrito");

        // 3. Esperamos un segundo y medio antes de limpiar la lista visual y cerrar todo
        setTimeout(() => {
            renderizarCarrito();
            modal.style.display = "none";
        }, 1500);
    });
}

function agregarAlCarrito(nombre, precio) {
    const productoExiste = carrito.find(item => item.nombre === nombre);

    if (productoExiste) {
        productoExiste.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, quantity: 1, cantidad: 1 }); // Mantiene compatibilidad
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    mostrarAvisoPasteleria(`¡Agregaste ${nombre} al carrito!`);
}

function renderizarCarrito() {
    const listaModal = document.getElementById("lista-carrito-modal");
    const txtTotal = document.getElementById("total-carrito");
    
    if (!listaModal) return;

    listaModal.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        listaModal.innerHTML = "<p style='color: gray;'>El carrito está vacío</p>";
        txtTotal.innerText = "Total: $0";
        return;
    }

    carrito.forEach((producto, index) => {
        total += producto.precio * producto.cantidad;

        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justify = "space-between";
        div.style.alignItems = "center";
        div.style.marginBottom = "10px";
        div.style.borderBottom = "1px solid #eee";
        div.style.paddingBottom = "5px";

        div.innerHTML = `
            <div style="text-align: left;">
                <strong style="color: black;">${producto.nombre}</strong> <br>
                <span style="color: #555;">${producto.cantidad} x $${producto.precio.toLocaleString()}</span>
            </div>
            <button class="btn-eliminar" data-index="${index}" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Eliminar</button>
        `;
        listaModal.appendChild(div);
    });

    txtTotal.innerText = `Total: $${total.toLocaleString()}`;

    const botonesEliminar = listaModal.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            eliminarDelCarrito(index);
        });
    });
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    mostrarAvisoPasteleria("Producto eliminado del carrito.");
}