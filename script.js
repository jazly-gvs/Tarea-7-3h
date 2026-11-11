
// INVENTARIO INICIAL
let inventario = [
    {
        id: 1,
        nombre: "Audífonos inalámbricos",
        categoria: "Tecnología",
        cantidad: 5,
        precio: 18.99,
        agotado: false
    },
    {
        id: 2,
        nombre: "Cargador USB-C",
        categoria: "Tecnología",
        cantidad: 8,
        precio: 9.50,
        agotado: false
    },
    {
        id: 3,
        nombre: "Smartwatch",
        categoria: "Tecnología",
        cantidad: 0,
        precio: 29.99,
        agotado: true
    },
    {
        id: 4,
        nombre: "Camiseta básica",
        categoria: "Ropa",
        cantidad: 12,
        precio: 8.00,
        agotado: false
    },
    {
        id: 5,
        nombre: "Jeans clásico",
        categoria: "Ropa",
        cantidad: 4,
        precio: 22.50,
        agotado: false
    },
    {
        id: 6,
        nombre: "Vestido casual",
        categoria: "Ropa",
        cantidad: 10,
        precio: 19.99,
        agotado: false
    },
    {
        id: 7,
        nombre: "Labial mate",
        categoria: "Maquillaje",
        cantidad: 0,
        precio: 6.50,
        agotado: true
    },
    {
        id: 8,
        nombre: "Base líquida",
        categoria: "Maquillaje",
        cantidad: 6,
        precio: 12.75,
        agotado: false
    }
];

// ELEMENTOS HTML
const formulario = document.getElementById("formulario-producto");
const campoNombre = document.getElementById("nombre");
const campoCategoria = document.getElementById("categoria");
const campoCantidad = document.getElementById("cantidad");
const campoPrecio = document.getElementById("precio");
const mensajeError = document.getElementById("mensaje-error");
const filtroCategoria = document.getElementById("filtro-categoria");
const cuerpoInventario = document.getElementById("cuerpo-inventario");
const mensajeVacio = document.getElementById("mensaje-vacio");

const indicadorProductos = document.getElementById("total-productos");
const indicadorUnidades = document.getElementById("total-unidades");
const indicadorValor = document.getElementById("valor-total");
const indicadorAgotados = document.getElementById("total-agotados");

// GENERADOR DE IDENTIFICADORES CON CLOSURE
function crearGeneradorId() {
    let contador = 100;

    return function () {
        contador++;
        return contador;
    };
}

const generarId = crearGeneradorId();

// CALCULAR EL VALOR TOTAL DEL INVENTARIO
function calcularValorTotal(items) {
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        total += items[i].cantidad * items[i].precio;
    }

    return total;
}

// CONTAR TODAS LAS UNIDADES
function contarUnidades(items) {
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        total += items[i].cantidad;
    }

    return total;
}

// CONTAR PRODUCTOS POR CATEGORÍA
function contarPorCategoria(items) {
    let cantidades = {};

    for (let i = 0; i < items.length; i++) {
        let categoria = items[i].categoria;

        if (cantidades[categoria] === undefined) {
            cantidades[categoria] = 0;
        }

        cantidades[categoria]++;
    }

    return cantidades;
}

// CREAR UNA CELDA DE LA TABLA
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

// CREAR UNA FILA PARA CADA PRODUCTO
function crearFila(item) {
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(item.nombre));
    fila.appendChild(crearCelda(item.categoria));
    fila.appendChild(crearCelda(item.cantidad));
    fila.appendChild(crearCelda("$" + item.precio.toFixed(2)));

    const celdaEstado = document.createElement("td");
    const botonEstado = document.createElement("button");

    botonEstado.type = "button";
    botonEstado.className = "btn-estado";
    botonEstado.setAttribute("data-id", item.id);
    botonEstado.textContent = item.agotado ? "Agotado" : "Disponible";
    celdaEstado.appendChild(botonEstado);
    fila.appendChild(celdaEstado);

    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");

    botonEliminar.type = "button";
    botonEliminar.className = "btn-eliminar";
    botonEliminar.setAttribute("data-id", item.id);
    botonEliminar.textContent = "Eliminar";

    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);

    return fila;
}

// MOSTRAR LOS PRODUCTOS Y ACTUALIZAR LOS INDICADORES
function renderizar(items) {
    while (cuerpoInventario.firstChild) {
        cuerpoInventario.removeChild(cuerpoInventario.firstChild);
    }

    for (let i = 0; i < items.length; i++) {
        cuerpoInventario.appendChild(crearFila(items[i]));
    }

    mensajeVacio.hidden = items.length > 0;

    // Los indicadores muestran el inventario completo, no solo el filtrado.
    indicadorProductos.textContent = inventario.length;
    indicadorUnidades.textContent = contarUnidades(inventario);
    indicadorValor.textContent = "$" + calcularValorTotal(inventario).toFixed(2);

    let agotados = 0;

    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].agotado) {
            agotados++;
        }
    }

    indicadorAgotados.textContent = agotados;
}

// FILTRAR PRODUCTOS POR CATEGORÍA
function filtrarPorCategoria(categoria) {
    let resultado = [];

    for (let i = 0; i < inventario.length; i++) {
        if (categoria === "todas" || inventario[i].categoria === categoria) {
            resultado.push(inventario[i]);
        }
    }

    return resultado;
}

// LLENAR EL SELECTOR CON LAS CATEGORÍAS DEL INVENTARIO
function llenarFiltroCategorias() {
    while (filtroCategoria.options.length > 1) {
        filtroCategoria.remove(1);
    }

    let categorias = [];

    for (let i = 0; i < inventario.length; i++) {
        let categoria = inventario[i].categoria;

        if (!categorias.includes(categoria)) {
            categorias.push(categoria);
        }
    }

    categorias.sort();

    for (let i = 0; i < categorias.length; i++) {
        const opcion = document.createElement("option");
        opcion.value = categorias[i];
        opcion.textContent = categorias[i];
        filtroCategoria.appendChild(opcion);
    }
}

// VALIDAR LOS DATOS DEL FORMULARIO
function validarProducto(datos) {
    if (datos.nombre === "") {
        throw new Error("Escribe el nombre del producto.");
    }

    if (datos.categoria === "") {
        throw new Error("Escribe o selecciona una categoría.");
    }

    if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
        throw new Error("La cantidad debe ser un número entero mayor que cero.");
    }

    if (!Number.isFinite(datos.precio) || datos.precio < 0) {
        throw new Error("El precio debe ser un número válido igual o mayor que cero.");
    }

    return true;
}

// AGREGAR UN PRODUCTO
function agregarProducto(event) {
    event.preventDefault();
    mensajeError.textContent = "";

    try {
        const datos = {
            nombre: campoNombre.value.trim(),
            categoria: campoCategoria.value.trim(),
            cantidad: Number(campoCantidad.value),
            precio: campoPrecio.value.trim() === "" ? NaN : Number(campoPrecio.value)
        };

        validarProducto(datos);

        const nuevoProducto = {
            id: generarId(),
            nombre: datos.nombre,
            categoria: datos.categoria,
            cantidad: datos.cantidad,
            precio: datos.precio,
            agotado: datos.cantidad === 0
        };

        inventario.push(nuevoProducto);

        llenarFiltroCategorias();
        filtroCategoria.value = "todas";
        renderizar(inventario);

        formulario.reset();

        console.log("Producto agregado:", nuevoProducto);
        console.table(inventario);

    } catch (error) {
        mensajeError.textContent = error.message;
        console.error("Error al agregar producto:", error.message);
    }
}

// ELIMINAR UN PRODUCTO
function eliminarProducto(id) {
    let nuevoInventario = [];

    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id !== id) {
            nuevoInventario.push(inventario[i]);
        }
    }

    return nuevoInventario;
}

// CAMBIAR EL ESTADO DE UN PRODUCTO
function cambiarEstado(id) {
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id === id) {
            inventario[i].agotado = !inventario[i].agotado;

            console.log(
                "Estado actualizado:",
                inventario[i].nombre,
                inventario[i].agotado ? "Agotado" : "Disponible"
            );

            break;
        }
    }
}

// EVENTO PARA ENVIAR EL FORMULARIO
formulario.addEventListener("submit", agregarProducto);

// UN SOLO EVENTO PARA LOS BOTONES DE LA TABLA
cuerpoInventario.addEventListener("click", function (event) {
    const boton = event.target.closest("button");

    if (!boton) {
        return;
    }

    const id = Number(boton.getAttribute("data-id"));

    if (boton.classList.contains("btn-eliminar")) {
        let nombreEliminado = "";

        for (let i = 0; i < inventario.length; i++) {
            if (inventario[i].id === id) {
                nombreEliminado = inventario[i].nombre;
                break;
            }
        }

        inventario = eliminarProducto(id);

        llenarFiltroCategorias();

        if (
            filtroCategoria.value !== "todas" &&
            !inventario.some(function (producto) {
                return producto.categoria === filtroCategoria.value;
            })
        ) {
            filtroCategoria.value = "todas";
        }

        renderizar(filtrarPorCategoria(filtroCategoria.value));

        console.log("Producto eliminado:", nombreEliminado);
        console.table(inventario);
    }

    if (boton.classList.contains("btn-estado")) {
        cambiarEstado(id);
        renderizar(filtrarPorCategoria(filtroCategoria.value));
        console.table(inventario);
    }
});

// EVENTO PARA FILTRAR POR CATEGORÍA
filtroCategoria.addEventListener("change", function () {
    const categoriaSeleccionada = filtroCategoria.value;
    const productosFiltrados = filtrarPorCategoria(categoriaSeleccionada);

    renderizar(productosFiltrados);
});

// CARGA INICIAL
llenarFiltroCategorias();
renderizar(inventario);

console.log("Inventario inicial:");
console.table(inventario);

console.log("Productos por categoría:");
console.table(contarPorCategoria(inventario));

console.log("Resumen del inventario:");
console.log("Total de productos:", inventario.length);
console.log("Total de unidades:", contarUnidades(inventario));
console.log("Valor total:", calcularValorTotal(inventario).toFixed(2));
