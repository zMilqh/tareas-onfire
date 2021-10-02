/// Inicializar base de datos firestore
var db = firebase.firestore();

/// Esto es para que funcione el acordeón
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems, {});
});

/// Objeto que contiene todas las tareas
let arrTareas = [];

/// Funcion para mostrar una tarea en pantalla
const mostrarTarea = (id, titulo, detalles, completada) => {
    let estatus = completada ? "checked" : "";
    let cadenaHTML = `<li>
    <div class="collapsible-header">
        <label>
            <input type="checkbox" class="filled-in" ${estatus} onclick="marcarCompletada('${id}')"/>
            <span>${titulo}</span>
        </label>
    </div>
    <div class="collapsible-body">
        <span>${detalles}</span>
        <br />
        
        <br /> <br />
        <a class="waves-effect waves-light btn indigo darken-2" onclick="modificarTarea('${id}')"
                >MODIFICAR</a
            >
        <a class="waves-effect waves-light btn red darken-2" onclick="borrarTarea('${id}')"
                >BORRAR</a
            >
    </div>
</li>`;
    lista.innerHTML += cadenaHTML;
};

/// Funcion para mostrar las tareas del arrreglo en la página
const mostrarTareas = () => {
    for (let t of arrTareas) {
        mostrarTarea(t.id, t.titulo, t.detalles, t.completada);
    }
};

/// Funcion para traer los datos de Firebase
db.collection("tareas").onSnapshot((docs) => {
    let arr = [];
    docs.forEach((doc) => {
        let objeto = doc.data(); /// {titulo: "Este es el titulo", detalles: "estos son los detalles"}
        objeto.id = doc.id; // Le agregamos el id al objeto
        arr.push(objeto);
    });
    arrTareas = [...arr];
    lista.innerHTML = "";
    mostrarTareas();
});

function agregarTarea() {
    let tarea = {
        titulo: txtTitulo.value,
        detalles: txtDetalles.value
    };

    db.collection("tareas").doc().set(tarea);

    txtTitulo.value = "";
    txtDetalles.value = "";
}

function borrarTarea(id) {
    db.collection("tareas").doc(id).delete();
}

// En esta variable guardamos el id para actualizar
let idActual;

function modificarTarea(id) {
    idActual = id;
    let tarea = arrTareas.find((t) => t.id == id);

    txtTitulo.value = tarea.titulo;
    txtDetalles.value = tarea.detalles;

    //ocultar el boton de agregar
    btnAgregar.style.display = "none";

    // mostrar el boton de actualizar
    btnActualizar.style.display = "";

    // mostrar el boton de cancelar
    btnCancelar.style.display = "";
}

function limpiarBotones() {
    txtTitulo.value = "";
    txtDetalles.value = "";

    //mostrar el boton de agregar
    btnAgregar.style.display = "";

    // ocultar el boton de actualizar
    btnActualizar.style.display = "none";

    // ocultar el boton de cancelar
    btnCancelar.style.display = "none";
}

function actualizarTarea() {
    let tarea = {
        titulo: txtTitulo.value,
        detalles: txtDetalles.value
    };

    db.collection("tareas").doc(idActual).update(tarea);

    limpiarBotones();
}

function marcarCompletada(id) {
    let tarea = arrTareas.find((t) => t.id == id);

    tarea.completada = !tarea.completada;

    db.collection("tareas").doc(id).update(tarea);
}
