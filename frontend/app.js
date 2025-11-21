const API_URL = "http://127.0.0.1:8000/api";
let usuarioActual = null;

/* ============================
        POST - REGISTRAR
============================ */
async function registrar() {
    const data = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        password: document.getElementById("password").value
    };

    try {
        const res = await fetch(`${API_URL}/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        alert(json.mensaje || json.detail);
        
    } catch (err) {
        alert("Error al registrar usuario: " + err);
    }
}

/* ============================
        GET - LISTA
============================ */
async function cargarUsuarios() {
    try {
        const res = await fetch(`${API_URL}/usuarios`);
        const usuarios = await res.json();

        const contenedor = document.getElementById("lista");
        contenedor.innerHTML = "";

        usuarios.forEach(u => {
            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <b>ID:</b> ${u.id}<br>
                <b>Nombre:</b> ${u.nombre}<br>
                <b>Email:</b> ${u.email}<br>
                <b>Teléfono:</b> ${u.telefono}<br>

                <div class="card-actions">
                    <button class="card-btn delete-btn" onclick="borrar('${u.id}')">Eliminar</button>

                    <!-- PATCH -->
                    <button class="card-btn edit-btn" onclick="editar('${u.id}', false)">Editar (PATCH)</button>

                    <!-- PUT -->
                    <button class="card-btn put-btn" onclick="editar('${u.id}', true)">Reemplazar (PUT)</button>
                </div>
            `;

            contenedor.appendChild(card);
        });
    } catch (err) {
        alert("Error al cargar usuarios: " + err);
    }
}

/* ============================
        DELETE
============================ */
async function borrar(id) {
    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
        const json = await res.json();
        alert(json.mensaje || json.detail);
        cargarUsuarios();
    } catch (err) {
        alert("Error al eliminar usuario: " + err);
    }
}

/* ============================
        EDITAR (ABRIR FORM)
============================ */
function editar(id, esPut = false) {
    usuarioActual = id;

    fetch(`${API_URL}/usuarios/${id}`)
        .then(res => res.json())
        .then(u => {
            document.getElementById("edit-id").value = u.id;
            document.getElementById("edit-nombre").value = u.nombre;
            document.getElementById("edit-email").value = u.email;
            document.getElementById("edit-telefono").value = u.telefono;
            document.getElementById("edit-password").value = "";

            document.getElementById("editar-form").style.display = "block";
        })
        .catch(() => {
            document.getElementById("editar-form").style.display = "block";
        })
        .finally(() => {
            // Mostrar PUT si esPut = true
            document.getElementById("put-btn").style.display = esPut ? "inline-block" : "none";

            // Mostrar PATCH solo si NO es PUT
            document.querySelector("button[onclick='enviarEdicion()']").style.display =
                esPut ? "none" : "inline-block";
        });
}



function cerrarFormulario() {
    usuarioActual = null;
    document.getElementById("editar-form").style.display = "none";
}

/* ============================
        PATCH - GUARDAR
============================ */
async function enviarEdicion() {
    if (!usuarioActual) return;

    const datos = {
        nombre: document.getElementById("edit-nombre").value,
        email: document.getElementById("edit-email").value,
        telefono: document.getElementById("edit-telefono").value,
        password: document.getElementById("edit-password").value
    };

    const res = await fetch(`${API_URL}/usuarios/${usuarioActual}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const json = await res.json();
    alert(json.mensaje || json.detail);
    cerrarFormulario();
    cargarUsuarios();
}

/* ============================
        PUT - REEMPLAZAR TOTAL
============================ */
async function enviarReplace() {
    if (!usuarioActual) return;

    const datos = {
        nombre: document.getElementById("edit-nombre").value,
        email: document.getElementById("edit-email").value,
        telefono: document.getElementById("edit-telefono").value,
        password: document.getElementById("edit-password").value
    };

    const res = await fetch(`${API_URL}/usuarios/${usuarioActual}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const json = await res.json();
    alert(json.mensaje || json.detail);
    cerrarFormulario();
    cargarUsuarios();
}
