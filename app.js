// --- 1. Base de datos de palabras ---
const TEMAS = {
    // ... (sin cambios)
    paises: ["Argentina", "Japón", "Egipto", "Canadá", "Brasil", "Australia", "Italia", "Rusia", "India", "México"],
    futbol: ["Messi", "Ronaldo", "Maradona", "Pelé", "Neymar", "Mbappé", "Zidane", "Ronaldinho", "Beckham", "Cruyff"],
    objetos: ["Tenedor", "Lámpara", "Teléfono", "Silla", "Libro", "Reloj", "Botella", "Llaves", "Mochila", "Ventana"]
};

// --- (NUEVO) Listas de Colores ---
// Colores Fuertes para la carta tapada
const COLORES_CARTA_FUERTE = [
    '#FFD60A', // 1: Amarillo
    '#00A6FB', // 2: Azul
    '#FF595E', // 3: Rojo
    '#e83e8c', // 4: Rosa
    '#8338EC', // 5: Violeta
    '#00C49A'  // 6: Verde
];
// Colores Pálidos (los de la carta revelada)
const COLORES_CARTA_PALIDO = [
    '#FFFBEB', // 1: Amarillo Pálido
    '#E6F6FF', // 2: Azul Pálido
    '#FFF0F1', // 3: Rojo Pálido
    '#FDECF4', // 4: Rosa Pálido
    '#F3EBFF', // 5: Violeta Pálido
    '#E6FAF5'  // 6: Verde Pálido
];

// --- 2. Variables de Estado del Juego ---
let totalJugadores = 0;
let impostores = [];
let tripulantes = [];
let palabraSecreta = "";
let jugadorActual = 1;

// --- 3. Obtener Elementos del HTML ---
// ... (sin cambios en esta sección)
const pantallaConfig = document.getElementById('pantallaConfig');
const inputTotalJugadores = document.getElementById('totalJugadores');
const inputNumImpostores = document.getElementById('numImpostores');
const selectTematica = document.getElementById('selectTematica');
const inputPersonalizado = document.getElementById('inputPersonalizado');
const botonComenzar = document.getElementById('botonComenzar');
const mensajeError = document.getElementById('mensajeError');
const pantallaJuego = document.getElementById('pantallaJuego');
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
// ... (sin cambios en esta sección)
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

function iniciarJuego() {
    // ... (sin cambios)
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
    // ... (sin cambios)
    if (tema === 'personalizado') {
        palabraSecreta = palabraPersonalizada;
    } else {
        const listaPalabras = TEMAS[tema];
        const indiceAleatorio = Math.floor(Math.random() * listaPalabras.length);
        palabraSecreta = listaPalabras[indiceAleatorio];
    }
}

function seleccionarImpostores(total, num) {
    // ... (sin cambios)
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

    // Actualizamos los títulos de la carta
    document.getElementById('tituloCartaTapada').textContent = `JUGADOR ${jugadorActual}`;
    document.getElementById('tituloCartaRevelada').textContent = `JUGADOR ${jugadorActual}`;

    // --- (NUEVA LÓGICA DE COLOR) ---
    // 1. Calculamos el índice del color
    // (jugadorActual - 1) porque los arrays empiezan en 0
    // % (módulo) para que los colores se repitan (ej: 6 % 6 = 0, 7 % 6 = 1)
    const colorIndex = (jugadorActual - 1) % COLORES_CARTA_FUERTE.length;

    // 2. Obtenemos los colores de las listas
    const colorFuerte = COLORES_CARTA_FUERTE[colorIndex];
    const colorPalido = COLORES_CARTA_PALIDO[colorIndex];

    // 3. Los "inyectamos" como variables CSS en el elemento 'carta'
    carta.style.setProperty('--color-fuerte', colorFuerte);
    carta.style.setProperty('--color-palido', colorPalido);
    // --- FIN DE LÓGICA DE COLOR ---

    // Reseteamos el estado de la carta (CSS usará --color-fuerte)
    carta.classList.remove('revelada');

    // Reseteamos el resto
    cartaTapada.classList.remove('oculto');
    cartaRevelada.classList.add('oculto');
    botonSiguiente.classList.add('oculto');
    cartaRevelada.classList.remove('impostor');
    botonSiguiente.textContent = "SIGUIENTE JUGADOR";

    // Quitamos el flash por si el jugador anterior fue impostor
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

    // (NUEVO) Añadimos la clase 'revelada'
    // El CSS se encarga del resto, usando la variable --color-palido
    carta.classList.add('revelada');

    if (impostores.includes(jugadorActual)) {
        // ... (sin cambios)
        textoRol.textContent = "¡ERES EL IMPOSTOR!";
        textoPalabra.textContent = "";
        cartaRevelada.classList.add('impostor');
        pantallaJuego.classList.add('flash-impostor');
    } else {
        // ... (sin cambios)
        textoRol.textContent = "LA PALABRA ES:";
        textoPalabra.textContent = palabraSecreta;
    }

    if (jugadorActual === totalJugadores) {
        botonSiguiente.textContent = "VER QUIÉN COMIENZA";
    }
}

function siguienteTurno() {
    // ... (sin cambios)
    if (jugadorActual === totalJugadores) {
        mostrarInicioRonda();
    } else {
        jugadorActual++;
        prepararTurno();
    }
}

function mostrarInicioRonda() {
    // ... (sin cambios)
    pantallaJuego.classList.add('oculto');
    pantallaInicioRonda.classList.remove('oculto');
    const indiceAleatorio = Math.floor(Math.random() * tripulantes.length);
    const jugadorInicial = tripulantes[indiceAleatorio];
    textoJugadorInicial.textContent = `¡Comienza el Jugador ${jugadorInicial}!`;
}

function mostrarPantallaFinal() {
    // ... (sin cambios)
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
    // ... (sin cambios)
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