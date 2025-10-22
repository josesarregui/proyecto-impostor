// --- 1. Base de datos de palabras ---
const TEMAS = {
    paises: ["Argentina", "Japón", "Egipto", "Canadá", "Brasil", "Australia", "Italia", "Rusia", "India", "México"],
    futbol: ["Messi", "Ronaldo", "Maradona", "Pelé", "Neymar", "Mbappé", "Zidane", "Ronaldinho", "Beckham", "Cruyff"],
    objetos: ["Tenedor", "Lámpara", "Teléfono", "Silla", "Libro", "Reloj", "Botella", "Llaves", "Mochila", "Ventana"]
};

// (NUEVO) Array de colores para los jugadores
const COLORES_JUGADOR = [
    '#007bff', // Azul
    '#28a745', // Verde
    '#ffc107', // Amarillo
    '#17a2b8', // Cian
    '#6f42c1', // Morado
    '#fd7e14', // Naranja
    '#e83e8c'  // Rosa
];

// --- 2. Variables de Estado del Juego ---
let totalJugadores = 0;
let impostores = [];
let tripulantes = [];
let palabraSecreta = "";
let jugadorActual = 1;

// --- 3. Obtener Elementos del HTML ---
// (Sin cambios aquí)
const pantallaConfig = document.getElementById('pantallaConfig');
const inputTotalJugadores = document.getElementById('totalJugadores');
const inputNumImpostores = document.getElementById('numImpostores');
const selectTematica = document.getElementById('selectTematica');
const inputPersonalizado = document.getElementById('inputPersonalizado');
const botonComenzar = document.getElementById('botonComenzar');
const mensajeError = document.getElementById('mensajeError');

const pantallaJuego = document.getElementById('pantallaJuego');
const tituloTurno = document.getElementById('tituloTurno');
const carta = document.getElementById('carta');
const cartaTapada = document.getElementById('cartaTapada');
const cartaRevelada = document.getElementById('cartaRevelada');
const textoRol = document.getElementById('textoRol');
const textoPalabra = document.getElementById('textoPalabra');
const botonSiguiente = document.getElementById('botonSiguiente');

const pantallaInicioRonda = document.getElementById('pantallaInicioRonda');
const textoJugadorInicial = document.getElementById('textoJugadorInicial');
const botonFinalizar = document.getElementById('botonFinalizar');

const pantallaFinal = document.getElementById('pantallaFinal');
const palabraFinal = document.getElementById('palabraFinal');
const impostoresFinal = document.getElementById('impostoresFinal');
const botonJugarNuevo = document.getElementById('botonJugarNuevo');


// --- 4. Event Listeners ---
// (Sin cambios aquí)
selectTematica.addEventListener('change', function() {
    if (selectTematica.value === 'personalizado') {
        inputPersonalizado.classList.remove('oculto');
    } else {
        inputPersonalizado.classList.add('oculto');
    }
});
botonComenzar.addEventListener('click', iniciarJuego);
carta.addEventListener('click', revelarCarta);
botonSiguiente.addEventListener('click', siguienteTurno);
botonFinalizar.addEventListener('click', mostrarPantallaFinal);
botonJugarNuevo.addEventListener('click', reiniciarJuego);


// --- 5. Funciones Principales ---
// (Solo cambia prepararTurno y revelarCarta)

function iniciarJuego() {
    // (Sin cambios aquí)
    mensajeError.textContent = '';
    totalJugadores = parseInt(inputTotalJugadores.value);
    const numImpostores = parseInt(inputNumImpostores.value);
    const tema = selectTematica.value;
    const palabraPersonalizada = inputPersonalizado.value;
    if (numImpostores >= totalJugadores) {
        mensajeError.textContent = 'Error: No puede haber más impostores que jugadores.';
        return;
    }
    if (tema === 'personalizado' && palabraPersonalizada.trim() === '') {
        mensajeError.textContent = 'Error: Debes escribir una palabra personalizada.';
        return;
    }
    if (totalJugadores < 3 || numImpostores < 1) {
        mensajeError.textContent = 'Error: Mínimo 3 jugadores y 1 impostor.';
        return;
    }
    jugadorActual = 1;
    seleccionarPalabra(tema, palabraPersonalizada);
    seleccionarImpostores(totalJugadores, numImpostores);
    pantallaConfig.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    prepararTurno();
}

function seleccionarPalabra(tema, palabraPersonalizada) {
    // (Sin cambios aquí)
    if (tema === 'personalizado') {
        palabraSecreta = palabraPersonalizada;
    } else {
        const listaPalabras = TEMAS[tema];
        const indiceAleatorio = Math.floor(Math.random() * listaPalabras.length);
        palabraSecreta = listaPalabras[indiceAleatorio];
    }
}

function seleccionarImpostores(total, num) {
    // (Sin cambios aquí)
    impostores = [];
    tripulantes = [];
    let jugadores = [];
    for (let i = 1; i <= total; i++) {
        jugadores.push(i);
    }
    for (let i = jugadores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jugadores[i], jugadores[j]] = [jugadores[j], jugadores[i]];
    }
    impostores = jugadores.slice(0, num);
    for (let i = 1; i <= total; i++) {
        if (!impostores.includes(i)) {
            tripulantes.push(i);
        }
    }
}

/**
 * (FUNCIÓN ACTUALIZADA)
 * Prepara la pantalla para el turno del jugador actual
 */
function prepararTurno() {
    tituloTurno.textContent = `Turno del Jugador ${jugadorActual}`;

    // (NUEVO) Aplicar color dinámico
    // Usamos el operador % (módulo) para ciclar por el array de colores
    // (jugadorActual - 1) porque los arrays empiezan en 0, pero nuestros jugadores en 1
    const colorIndex = (jugadorActual - 1) % COLORES_JUGADOR.length;
    const colorActual = COLORES_JUGADOR[colorIndex];

    // Aplicamos el color al borde de la carta
    carta.style.borderColor = colorActual;
    // Aplicamos el color al emoji (buscándolo con querySelector)
    cartaTapada.querySelector('span').style.color = colorActual;

    // Reseteamos la carta
    cartaTapada.classList.remove('oculto');
    cartaRevelada.classList.add('oculto');
    botonSiguiente.classList.add('oculto');
    cartaRevelada.classList.remove('impostor');
    botonSiguiente.textContent = "Siguiente Jugador";

    // (NUEVO) Quitamos la clase 'flash' por si el jugador anterior fue impostor
    pantallaJuego.classList.remove('flash-impostor');
}

/**
 * (FUNCIÓN ACTUALIZADA)
 * Se ejecuta cuando el jugador toca la carta
 */
function revelarCarta() {
    cartaTapada.classList.add('oculto');
    cartaRevelada.classList.remove('oculto');
    botonSiguiente.classList.remove('oculto');

    if (impostores.includes(jugadorActual)) {
        // Es impostor
        textoRol.textContent = "¡ERES EL IMPOSTOR!";
        textoPalabra.textContent = "";
        cartaRevelada.classList.add('impostor');

        // (NUEVO) ¡Añadimos el flash rojo a toda la pantalla de juego!
        pantallaJuego.classList.add('flash-impostor');

    } else {
        // No es impostor
        textoRol.textContent = "LA PALABRA ES:";
        textoPalabra.textContent = palabraSecreta;
    }

    if (jugadorActual === totalJugadores) {
        botonSiguiente.textContent = "Ver Quién Comienza";
    }
}

function siguienteTurno() {
    // (Sin cambios aquí)
    if (jugadorActual === totalJugadores) {
        mostrarInicioRonda();
    } else {
        jugadorActual++;
        prepararTurno();
    }
}

function mostrarInicioRonda() {
    // (Sin cambios aquí)
    pantallaJuego.classList.add('oculto');
    pantallaInicioRonda.classList.remove('oculto');
    const indiceAleatorio = Math.floor(Math.random() * tripulantes.length);
    const jugadorInicial = tripulantes[indiceAleatorio];
    textoJugadorInicial.textContent = `¡Comienza el Jugador ${jugadorInicial}!`;
}

function mostrarPantallaFinal() {
    // (Sin cambios aquí)
    pantallaInicioRonda.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');
    palabraFinal.textContent = `La palabra era: ${palabraSecreta}`;
    if (impostores.length === 1) {
        impostoresFinal.textContent = `El impostor era: Jugador ${impostores[0]}`;
    } else {
        impostoresFinal.textContent = `Los impostores eran: Jugadores ${impostores.join(', ')}`;
    }
}

function reiniciarJuego() {
    // (Sin cambios aquí)
    pantallaFinal.classList.add('oculto');
    pantallaConfig.classList.remove('oculto');
    totalJugadores = 0;
    impostores = [];
    tripulantes = [];
    palabraSecreta = "";
    jugadorActual = 1;
    inputPersonalizado.value = '';
    inputPersonalizado.classList.add('oculto');
    selectTematica.value = 'paises';
}