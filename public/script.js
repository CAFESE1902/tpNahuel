const API = "http://localhost:3000/api";

// ===== VIEW SWITCHING =====
function mostrarLogin() {
    document.getElementById("vista-registro").style.display = "none";
    document.getElementById("vista-login").style.display = "block";
    document.getElementById("vista-protegida").style.display = "none";
    limpiarMensaje();
}

function mostrarRegistro() {
    document.getElementById("vista-login").style.display = "none";
    document.getElementById("vista-registro").style.display = "block";
    document.getElementById("vista-protegida").style.display = "none";
    limpiarMensaje();
}

function mostrarProtegido() {
    document.getElementById("vista-registro").style.display = "none";
    document.getElementById("vista-login").style.display = "none";
    document.getElementById("vista-protegida").style.display = "block";
    limpiarMensaje();
    cargarCategorias();
    cargarProductos();
}

function limpiarMensaje() {
    const p = document.getElementById("mensaje");
    p.textContent = "";
}

// ===== MESSAGES =====
function mostrarMensaje(texto, tipo) {
    const p = document.getElementById("mensaje");
    p.textContent = texto;
    p.style.color = tipo === "ok" ? "#44d62c" : "#ff4444";
}

// ===== REGISTER =====
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

// ===== LOGOUT =====
function cerrarSesion() {
    localStorage.removeItem("token");
    document.getElementById("vista-protegida").style.display = "none";
    mostrarLogin();
}

// ===== GET ALL PRODUCTS =====
async function cargarProductos() {
    try {
        const respuesta = await fetch(`${API}/products`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const productos = await respuesta.json();
        const lista = document.getElementById("lista-productos");
        lista.innerHTML = "";

        productos.forEach(p => {
            const li = document.createElement("li");

            // Product info
            const texto = document.createElement("span");
            texto.textContent = `${p.name} - $${p.price} (stock: ${p.quantity}) [Cat: ${p.categoryId}]`;

            // Edit button
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "✏️";
            btnEditar.style.width = "auto";
            btnEditar.style.margin = "0 5px";
            btnEditar.onclick = () => mostrarFormularioEdicion(p);

            // Delete button
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "🗑️";
            btnEliminar.style.width = "auto";
            btnEliminar.style.margin = "0 5px";
            btnEliminar.style.background = "#ff4444";
            btnEliminar.onclick = () => eliminarProducto(p.id);

            li.appendChild(texto);
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            lista.appendChild(li);
        });
    } catch (error) {
        mostrarMensaje("❌ Error al cargar productos", "error");
    }
}

// ===== LOAD CATEGORIES =====
// ===== LOAD CATEGORIES =====
async function cargarCategorias() {
    try {
        const respuesta = await fetch(`${API}/categories`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const categorias = await respuesta.json();
        
        const listaCategorias = document.getElementById("lista-categorias");
        if (!listaCategorias) return;
        
        listaCategorias.innerHTML = "<h4>📂 Categorías disponibles:</h4>";
        categorias.forEach(c => {
            listaCategorias.innerHTML += `<p>🟢 ID: ${c.id} → ${c.name}</p>`;
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// ===== CREATE PRODUCT =====
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
            cargarProductos();
            // Clear form
            document.getElementById("prod-name").value = "";
            document.getElementById("prod-price").value = "";
            document.getElementById("prod-quantity").value = "";
            document.getElementById("prod-categoryId").value = "";
        } else {
            mostrarMensaje("❌ " + (data.error || "Error al agregar"), "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión", "error");
    }
}

// ===== DELETE PRODUCT =====
async function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
        const respuesta = await fetch(`${API}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (respuesta.ok) {
            mostrarMensaje("✅ Producto eliminado", "ok");
            cargarProductos();
        } else {
            const data = await respuesta.json();
            mostrarMensaje("❌ " + (data.error || "Error al eliminar"), "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión", "error");
    }
}

// ===== UPDATE PRODUCT =====
async function actualizarProducto(id) {
    const name = document.getElementById("edit-name").value;
    const price = Number(document.getElementById("edit-price").value);
    const quantity = Number(document.getElementById("edit-quantity").value);
    const categoryId = Number(document.getElementById("edit-categoryId").value);

    try {
        const respuesta = await fetch(`${API}/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name, price, quantity, categoryId })
        });

        if (respuesta.ok) {
            mostrarMensaje("✅ Producto actualizado", "ok");
            cargarProductos();
            cerrarFormularioEdicion();
        } else {
            const data = await respuesta.json();
            mostrarMensaje("❌ " + (data.error || "Error al actualizar"), "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión", "error");
    }
}

// ===== EDIT FORM =====
function mostrarFormularioEdicion(producto) {
    document.getElementById("edit-id").value = producto.id;
    document.getElementById("edit-name").value = producto.name;
    document.getElementById("edit-price").value = producto.price;
    document.getElementById("edit-quantity").value = producto.quantity;
    document.getElementById("edit-categoryId").value = producto.categoryId;
    document.getElementById("formulario-edicion").style.display = "block";
}

function cerrarFormularioEdicion() {
    document.getElementById("formulario-edicion").style.display = "none";
}

// ===== AUTO-LOGIN =====
if (localStorage.getItem("token")) {
    mostrarProtegido();
}