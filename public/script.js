const API = "http://localhost:3000/api";

// ===== CAMBIAR ENTRE VISTAS =====
function mostrarLogin() {
    document.getElementById("vista-registro").style.display = "none";
    document.getElementById("vista-login").style.display = "block";
}

function mostrarRegistro() {
    document.getElementById("vista-login").style.display = "none";
    document.getElementById("vista-registro").style.display = "block";
}

// ===== REGISTRO =====
async function registrar() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
        const respuesta = await fetch(`${API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("✅ Cuenta creada, ahora iniciá sesión", "ok");
            mostrarLogin();
        } else {
            mostrarMensaje("❌ " + data.error, "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión", "error");
    }
}

// ===== LOGIN =====
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const respuesta = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem("token", data.token);
            mostrarProtegido();
        } else {
            mostrarMensaje("❌ " + data.error, "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión", "error");
    }
}

// ===== MOSTRAR VISTA PROTEGIDA =====
function mostrarProtegido() {
    document.getElementById("vista-registro").style.display = "none";
    document.getElementById("vista-login").style.display = "none";
    document.getElementById("vista-protegida").style.display = "block";
    cargarProductos();   // ← al entrar, carga la lista de productos
}

// ===== CERRAR SESIÓN =====
function cerrarSesion() {
    localStorage.removeItem("token");
    document.getElementById("vista-protegida").style.display = "none";
    mostrarLogin();
}

// ===== MENSAJE AL USUARIO =====
function mostrarMensaje(texto, tipo) {
    const p = document.getElementById("mensaje");
    p.textContent = texto;
    p.style.color = tipo === "ok" ? "#44d62c" : "#ff4444";
}

// ===== TRAER Y MOSTRAR PRODUCTOS =====
async function cargarProductos() {
    try {
        const respuesta = await fetch(`${API}/products`);
        const productos = await respuesta.json();

        const lista = document.getElementById("lista-productos");
        lista.innerHTML = "";

        productos.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} - $${p.price} (stock: ${p.quantity})`;
            lista.appendChild(li);
        });
    } catch (error) {
        mostrarMensaje("❌ Error al cargar productos", "error");
    }
}

// ===== AGREGAR UN PRODUCTO =====
async function agregarProducto() {
    const name = document.getElementById("prod-name").value;
    const price = Number(document.getElementById("prod-price").value);
    const quantity = Number(document.getElementById("prod-quantity").value);
    const categoryId = Number(document.getElementById("prod-categoryId").value);

    try {
        const respuesta = await fetch(`${API}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, quantity, categoryId })
        });
        const data = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("✅ Producto agregado", "ok");
            cargarProductos();   // ← recarga la lista para mostrar el nuevo
        } else {
            mostrarMensaje("❌ " + (data.error || "Error al agregar"), "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión", "error");
    }
}

// ===== AL CARGAR LA PÁGINA: si hay token, mostrar protegido =====
if (localStorage.getItem("token")) {
    mostrarProtegido();
}