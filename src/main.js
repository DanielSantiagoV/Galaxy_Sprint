/**
 * Galaxy Sprint - Batallas Espaciales
 * 
 * Punto de entrada principal de la aplicación.
 * Maneja el menú principal y coordina todas las funcionalidades del juego.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importaciones de librerías externas
import inquirer from 'inquirer';           // Para menús interactivos de consola
import { v4 as uuidv4 } from 'uuid';       // Para generar IDs únicos

// Importaciones de modelos (entidades del juego)
import { ExploradorHumano } from './models/ExploradorHumano.js';
import { ExploradorGuerrero } from './models/ExploradorGuerrero.js';
import { ExploradorMago } from './models/ExploradorMago.js';
import { ExploradorArquero } from './models/ExploradorArquero.js';

// Importaciones de servicios (lógica de negocio)
import { NotificadorCLI } from './services/NotificadorCLI.js';
import { GestorBatalla } from './services/GestorBatalla.js';
import { GestorGuardado } from './services/GestorGuardado.js';
import { GeneradorEnemigos } from './services/GeneradorEnemigos.js';

// Importaciones de items del inventario
import { Pocion } from './models/items/Pocion.js';
import { Arma } from './models/items/Arma.js';
import { Armadura } from './models/items/Armadura.js';
import { Energia } from './models/items/Energia.js';

/**
 * Función principal de la aplicación.
 * Inicializa los servicios necesarios y maneja el bucle principal del menú.
 * 
 * Aplica el principio SRP (Single Responsibility Principle) al coordinar
 * diferentes servicios sin implementar lógica específica de cada uno.
 */
async function main() {
    // Inicialización de servicios principales (DIP - Dependency Inversion Principle)
    const notificador = new NotificadorCLI();      // Manejo de notificaciones
    const gestorGuardado = new GestorGuardado();   // Persistencia de datos
    const generadorEnemigos = new GeneradorEnemigos(); // Generación de enemigos
    
    // Inicializar sistema de guardado
    try {
        await gestorGuardado.inicializar();
        notificador.success('Sistema de guardado inicializado correctamente');
    } catch (error) {
        notificador.error(`Error inicializando guardado: ${error.message}`);
    }

    let exit = false; // Control del bucle principal

    // Bucle principal del menú (aplicando principio de responsabilidad única)
    while (!exit) {
        const { opcion } = await inquirer.prompt([{
            type: 'list',
            name: 'opcion',
            message: '🚀 Galaxy Sprint — Batallas Espaciales 🚀',
            choices: [
                { name: 'Crear nuevo personaje', value: 'crear' },
                { name: 'Cargar personaje existente', value: 'cargar' },
                { name: 'Ver personajes guardados', value: 'listar' },
                { name: 'Iniciar batalla', value: 'batalla' },
                { name: 'Ver estadísticas', value: 'stats' },
                { name: 'Ver instrucciones', value: 'help' },
                { name: 'Salir', value: 'salir' }
            ]
        }]);

        // Router de opciones (aplicando principio Open/Closed)
        switch (opcion) {
            case 'crear':
                await crearPersonaje(gestorGuardado, notificador);
                break;
            case 'cargar':
                await cargarPersonaje(gestorGuardado, notificador);
                break;
            case 'listar':
                await listarPersonajes(gestorGuardado, notificador);
                break;
            case 'batalla':
                await iniciarBatalla(gestorGuardado, generadorEnemigos, notificador);
                break;
            case 'stats':
                await mostrarEstadisticas(gestorGuardado, notificador);
                break;
            case 'help':
                mostrarAyuda(notificador);
                break;
            case 'salir':
                exit = true;
                break;
        }
    }

    notificador.info('¡Gracias por jugar Galaxy Sprint! 👋');
}

/**
 * Crea un nuevo personaje del juego.
 * 
 * Aplica el principio OCP (Open/Closed Principle) al permitir añadir nuevas clases
 * de personaje sin modificar esta función, solo extendiendo el switch.
 * 
 * @param {GestorGuardado} gestorGuardado - Servicio para guardar el personaje
 * @param {NotificadorCLI} notificador - Servicio para mostrar mensajes
 */
async function crearPersonaje(gestorGuardado, notificador) {
    // Recopilar información del usuario
    const { nombre, clase } = await inquirer.prompt([
        {
            type: 'input',
            name: 'nombre',
            message: 'Nombre del explorador:',
            default: 'Jugador'
        },
        {
            type: 'list',
            name: 'clase',
            message: 'Selecciona la clase de tu explorador:',
            choices: [
                { name: 'Humano - Equilibrado (Vida: 120, Ataque: 12, Defensa: 8)', value: 'Humano' },
                { name: 'Guerrero - Tanque (Vida: 150, Ataque: 18, Defensa: 12)', value: 'Guerrero' },
                { name: 'Mago - Hechicero (Vida: 80, Ataque: 15, Defensa: 4, Energía: 100)', value: 'Mago' },
                { name: 'Arquero - Velocidad (Vida: 100, Ataque: 14, Velocidad: 12)', value: 'Arquero' }
            ]
        }
    ]);

    // Crear instancia del personaje según la clase seleccionada
    let personaje;
    const datosBase = { id: uuidv4(), nombre }; // ID único para el personaje

    // Factory pattern para crear personajes (aplicando LSP - Liskov Substitution Principle)
    switch (clase) {
        case 'Humano':
            personaje = new ExploradorHumano(datosBase);
            break;
        case 'Guerrero':
            personaje = new ExploradorGuerrero(datosBase);
            break;
        case 'Mago':
            personaje = new ExploradorMago(datosBase);
            break;
        case 'Arquero':
            personaje = new ExploradorArquero(datosBase);
            break;
    }

    // Dar items iniciales al personaje (composición)
    personaje.agregarItem(new Pocion({ 
        id: uuidv4(), 
        nombre: 'Poción de Vida', 
        descripcion: 'Restaura 30 puntos de vida', 
        curacion: 30 
    }));
    personaje.agregarItem(new Energia({ 
        id: uuidv4(), 
        nombre: 'Bebida Energética', 
        descripcion: 'Restaura 20 puntos de energía', 
        bonusEnergia: 20 
    }));

    // Persistir el personaje y notificar éxito
    await gestorGuardado.guardarPersonaje(personaje);
    notificador.success(`¡Personaje ${nombre} (${clase}) creado exitosamente!`);
}

/**
 * Carga y muestra información de un personaje existente.
 * 
 * Aplica el principio SRP al manejar únicamente la carga y visualización
 * de personajes, delegando la persistencia al GestorGuardado.
 * 
 * @param {GestorGuardado} gestorGuardado - Servicio para cargar personajes
 * @param {NotificadorCLI} notificador - Servicio para mostrar mensajes
 */
async function cargarPersonaje(gestorGuardado, notificador) {
    try {
        // Cargar todos los personajes guardados
        const personajes = await gestorGuardado.cargarPersonajes();
        
        // Validar que existan personajes
        if (personajes.length === 0) {
            notificador.warn('No hay personajes guardados. Crea uno primero.');
            return;
        }

        // Crear opciones para el menú de selección
        const opciones = personajes.map(p => ({
            name: `${p.getNombre()} (${p.getClase()} Nv.${p.getNivel()}) - Vida: ${p.getVida()}/${p.getMaxVida()}`,
            value: p.getId()
        }));

        // Permitir al usuario seleccionar un personaje
        const { personajeId } = await inquirer.prompt([{
            type: 'list',
            name: 'personajeId',
            message: 'Selecciona un personaje:',
            choices: opciones
        }]);

        // Encontrar y mostrar información del personaje seleccionado
        const personaje = personajes.find(p => p.getId() === personajeId);
        notificador.success(`Personaje ${personaje.getNombre()} cargado exitosamente!`);
        
        // Mostrar estado detallado del personaje
        const estado = personaje.estado();
        notificador.info(`Estado: ${estado.nombre} (${estado.clase} Nv.${estado.nivel})`);
        notificador.info(`Vida: ${estado.vida}/${estado.maxVida} | Energía: ${estado.energia}/${estado.maxEnergia}`);
        notificador.info(`Ataque: ${estado.ataque} | Defensa: ${estado.defensa} | Velocidad: ${estado.velocidad}`);
        notificador.info(`Experiencia: ${estado.experiencia}/${estado.nivel * 100} | Items: ${estado.inventario}`);

    } catch (error) {
        notificador.error(`Error cargando personaje: ${error.message}`);
    }
}

/**
 * Lista todos los personajes guardados con su información básica.
 * 
 * Aplica el principio SRP al manejar únicamente la visualización
 * de la lista de personajes, delegando la carga al GestorGuardado.
 * 
 * @param {GestorGuardado} gestorGuardado - Servicio para cargar personajes
 * @param {NotificadorCLI} notificador - Servicio para mostrar mensajes
 */
async function listarPersonajes(gestorGuardado, notificador) {
    try {
        // Cargar todos los personajes guardados
        const personajes = await gestorGuardado.cargarPersonajes();
        
        // Validar que existan personajes
        if (personajes.length === 0) {
            notificador.warn('No hay personajes guardados.');
            return;
        }

        // Mostrar encabezado de la lista
        notificador.info('--- Personajes Guardados ---');
        
        // Iterar y mostrar información de cada personaje
        personajes.forEach(personaje => {
            const estado = personaje.estado();
            notificador.info(`${estado.nombre} (${estado.clase} Nv.${estado.nivel}) - Vida: ${estado.vida}/${estado.maxVida} | Items: ${estado.inventario}`);
        });
        
        // Mostrar pie de la lista
        notificador.info('----------------------------');

    } catch (error) {
        notificador.error(`Error listando personajes: ${error.message}`);
    }
}

/**
 * Inicia una batalla entre el personaje del jugador y un enemigo.
 * 
 * Aplica el principio DIP (Dependency Inversion Principle) al depender
 * de abstracciones (GestorGuardado, GeneradorEnemigos, NotificadorCLI)
 * en lugar de implementaciones concretas.
 * 
 * @param {GestorGuardado} gestorGuardado - Servicio para cargar/guardar datos
 * @param {GeneradorEnemigos} generadorEnemigos - Servicio para generar enemigos
 * @param {NotificadorCLI} notificador - Servicio para mostrar mensajes
 */
async function iniciarBatalla(gestorGuardado, generadorEnemigos, notificador) {
    try {
        // Cargar personajes disponibles
        const personajes = await gestorGuardado.cargarPersonajes();
        
        // Validar que existan personajes
        if (personajes.length === 0) {
            notificador.warn('No hay personajes guardados. Crea uno primero.');
            return;
        }

        // Crear opciones de personajes para selección
        const opciones = personajes.map(p => ({
            name: `${p.getNombre()} (${p.getClase()} Nv.${p.getNivel()})`,
            value: p.getId()
        }));

        // Recopilar configuración de la batalla
        const { personajeId, tipoEnemigo } = await inquirer.prompt([
            {
                type: 'list',
                name: 'personajeId',
                message: 'Selecciona tu personaje:',
                choices: opciones
            },
            {
                type: 'list',
                name: 'tipoEnemigo',
                message: 'Tipo de enemigo:',
                choices: [
                    { name: 'Enemigo Normal', value: 'normal' },
                    { name: 'Boss (más difícil)', value: 'boss' }
                ]
            }
        ]);

        // Obtener el personaje seleccionado
        const jugador = personajes.find(p => p.getId() === personajeId);
        
        // Generar enemigo según el tipo seleccionado
        const enemigo = tipoEnemigo === 'boss' 
            ? generadorEnemigos.generarEnemigoBoss(jugador.getNivel())
            : generadorEnemigos.generarEnemigo(jugador.getNivel());

        // Crear y ejecutar la batalla
        const gestorBatalla = new GestorBatalla({ jugador, enemigo, notificador });
        const resultado = await gestorBatalla.iniciar();

        // Persistir resultado de la partida
        await gestorGuardado.guardarPartida({
            jugador: jugador.getNombre(),
            enemigo: enemigo.getNombre(),
            resultado: resultado.tipo,
            turnos: gestorBatalla.turno
        });

        // Guardar personaje actualizado (con experiencia ganada)
        await gestorGuardado.guardarPersonaje(jugador);

    } catch (error) {
        notificador.error(`Error en la batalla: ${error.message}`);
    }
}

/**
 * Muestra estadísticas generales del juego.
 * 
 * Aplica el principio SRP al manejar únicamente la visualización
 * de estadísticas, delegando la obtención de datos al GestorGuardado.
 * 
 * @param {GestorGuardado} gestorGuardado - Servicio para obtener estadísticas
 * @param {NotificadorCLI} notificador - Servicio para mostrar mensajes
 */
async function mostrarEstadisticas(gestorGuardado, notificador) {
    try {
        // Obtener estadísticas del sistema
        const stats = await gestorGuardado.obtenerEstadisticas();
        
        // Mostrar estadísticas generales
        notificador.info('--- Estadísticas del Juego ---');
        notificador.info(`Total de personajes: ${stats.totalPersonajes}`);
        notificador.info(`Total de partidas: ${stats.totalPartidas}`);
        
        // Mostrar distribución por clases
        notificador.info('\nPersonajes por clase:');
        Object.entries(stats.personajesPorClase).forEach(([clase, cantidad]) => {
            notificador.info(`  ${clase}: ${cantidad}`);
        });

        // Mostrar partidas recientes si existen
        if (stats.partidasRecientes.length > 0) {
            notificador.info('\nPartidas recientes:');
            stats.partidasRecientes.forEach(partida => {
                const fecha = new Date(partida.fecha).toLocaleString();
                notificador.info(`  ${fecha}: ${partida.jugador} vs ${partida.enemigo} - ${partida.resultado}`);
            });
        }
        
        // Mostrar pie de estadísticas
        notificador.info('----------------------------');

    } catch (error) {
        notificador.error(`Error obteniendo estadísticas: ${error.message}`);
    }
}

/**
 * Muestra la ayuda y instrucciones del juego.
 * 
 * Aplica el principio SRP al manejar únicamente la visualización
 * de información de ayuda, sin lógica de negocio.
 * 
 * @param {NotificadorCLI} notificador - Servicio para mostrar mensajes
 */
function mostrarAyuda(notificador) {
    notificador.info(`
🚀 Galaxy Sprint — Batallas Espaciales 🚀

OBJETIVO:
Derrota a enemigos espaciales en batallas por turnos para ganar experiencia y subir de nivel.

CLASES DE EXPLORADORES:
• Humano: Equilibrado, buena versatilidad
• Guerrero: Tanque con mucha vida y defensa
• Mago: Poderoso pero frágil, usa magia
• Arquero: Rápido y ágil, ataques múltiples

SISTEMA DE BATALLA:
• Cada turno puedes atacar, usar habilidades especiales, descansar o usar items
• La velocidad determina el orden de los turnos
• Gana experiencia al derrotar enemigos
• Sube de nivel para mejorar tus estadísticas

ITEMS:
• Pociones: Restauran vida
• Bebidas energéticas: Restauran energía
• Armas: Mejoran el ataque
• Armaduras: Mejoran la defensa

GUARDADO:
• Tu progreso se guarda automáticamente
• Puedes crear múltiples personajes
• Las estadísticas se mantienen entre sesiones

¡Disfruta explorando la galaxia! 🌌
    `);
}

// Ejecutar la aplicación principal
// Manejo de errores global para capturar cualquier excepción no controlada
main().catch(console.error);
