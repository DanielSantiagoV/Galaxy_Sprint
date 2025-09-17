import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { ExploradorHumano } from './models/ExploradorHumano.js';
import { ExploradorGuerrero } from './models/ExploradorGuerrero.js';
import { ExploradorMago } from './models/ExploradorMago.js';
import { ExploradorArquero } from './models/ExploradorArquero.js';
import { NotificadorCLI } from './services/NotificadorCLI.js';
import { GestorBatalla } from './services/GestorBatalla.js';
import { GestorGuardado } from './services/GestorGuardado.js';
import { GeneradorEnemigos } from './services/GeneradorEnemigos.js';
import { Pocion } from './models/items/Pocion.js';
import { Arma } from './models/items/Arma.js';
import { Armadura } from './models/items/Armadura.js';
import { Energia } from './models/items/Energia.js';

async function main() {
    const notificador = new NotificadorCLI();
    const gestorGuardado = new GestorGuardado();
    const generadorEnemigos = new GeneradorEnemigos();
    
    // Inicializar sistema de guardado
    try {
        await gestorGuardado.inicializar();
        notificador.success('Sistema de guardado inicializado correctamente');
    } catch (error) {
        notificador.error(`Error inicializando guardado: ${error.message}`);
    }

    let exit = false;

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

async function crearPersonaje(gestorGuardado, notificador) {
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

    let personaje;
    const datosBase = { id: uuidv4(), nombre };

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

    // Dar items iniciales
    personaje.agregarItem(new Pocion({ id: uuidv4(), nombre: 'Poción de Vida', descripcion: 'Restaura 30 puntos de vida', curacion: 30 }));
    personaje.agregarItem(new Energia({ id: uuidv4(), nombre: 'Bebida Energética', descripcion: 'Restaura 20 puntos de energía', bonusEnergia: 20 }));

    await gestorGuardado.guardarPersonaje(personaje);
    notificador.success(`¡Personaje ${nombre} (${clase}) creado exitosamente!`);
}

async function cargarPersonaje(gestorGuardado, notificador) {
    try {
        const personajes = await gestorGuardado.cargarPersonajes();
        
        if (personajes.length === 0) {
            notificador.warn('No hay personajes guardados. Crea uno primero.');
            return;
        }

        const opciones = personajes.map(p => ({
            name: `${p.getNombre()} (${p.getClase()} Nv.${p.getNivel()}) - Vida: ${p.getVida()}/${p.getMaxVida()}`,
            value: p.getId()
        }));

        const { personajeId } = await inquirer.prompt([{
            type: 'list',
            name: 'personajeId',
            message: 'Selecciona un personaje:',
            choices: opciones
        }]);

        const personaje = personajes.find(p => p.getId() === personajeId);
        notificador.success(`Personaje ${personaje.getNombre()} cargado exitosamente!`);
        
        // Mostrar estado del personaje
        const estado = personaje.estado();
        notificador.info(`Estado: ${estado.nombre} (${estado.clase} Nv.${estado.nivel})`);
        notificador.info(`Vida: ${estado.vida}/${estado.maxVida} | Energía: ${estado.energia}/${estado.maxEnergia}`);
        notificador.info(`Ataque: ${estado.ataque} | Defensa: ${estado.defensa} | Velocidad: ${estado.velocidad}`);
        notificador.info(`Experiencia: ${estado.experiencia}/${estado.nivel * 100} | Items: ${estado.inventario}`);

    } catch (error) {
        notificador.error(`Error cargando personaje: ${error.message}`);
    }
}

async function listarPersonajes(gestorGuardado, notificador) {
    try {
        const personajes = await gestorGuardado.cargarPersonajes();
        
        if (personajes.length === 0) {
            notificador.warn('No hay personajes guardados.');
            return;
        }

        notificador.info('--- Personajes Guardados ---');
        personajes.forEach(personaje => {
            const estado = personaje.estado();
            notificador.info(`${estado.nombre} (${estado.clase} Nv.${estado.nivel}) - Vida: ${estado.vida}/${estado.maxVida} | Items: ${estado.inventario}`);
        });
        notificador.info('----------------------------');

    } catch (error) {
        notificador.error(`Error listando personajes: ${error.message}`);
    }
}

async function iniciarBatalla(gestorGuardado, generadorEnemigos, notificador) {
    try {
        const personajes = await gestorGuardado.cargarPersonajes();
        
        if (personajes.length === 0) {
            notificador.warn('No hay personajes guardados. Crea uno primero.');
            return;
        }

        const opciones = personajes.map(p => ({
            name: `${p.getNombre()} (${p.getClase()} Nv.${p.getNivel()})`,
            value: p.getId()
        }));

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

        const jugador = personajes.find(p => p.getId() === personajeId);
        const enemigo = tipoEnemigo === 'boss' 
            ? generadorEnemigos.generarEnemigoBoss(jugador.getNivel())
            : generadorEnemigos.generarEnemigo(jugador.getNivel());

        const gestorBatalla = new GestorBatalla({ jugador, enemigo, notificador });
        const resultado = await gestorBatalla.iniciar();

        // Guardar resultado de la partida
        await gestorGuardado.guardarPartida({
            jugador: jugador.getNombre(),
            enemigo: enemigo.getNombre(),
            resultado: resultado.tipo,
            turnos: gestorBatalla.turno
        });

        // Guardar personaje actualizado
        await gestorGuardado.guardarPersonaje(jugador);

    } catch (error) {
        notificador.error(`Error en la batalla: ${error.message}`);
    }
}

async function mostrarEstadisticas(gestorGuardado, notificador) {
    try {
        const stats = await gestorGuardado.obtenerEstadisticas();
        
        notificador.info('--- Estadísticas del Juego ---');
        notificador.info(`Total de personajes: ${stats.totalPersonajes}`);
        notificador.info(`Total de partidas: ${stats.totalPartidas}`);
        
        notificador.info('\nPersonajes por clase:');
        Object.entries(stats.personajesPorClase).forEach(([clase, cantidad]) => {
            notificador.info(`  ${clase}: ${cantidad}`);
        });

        if (stats.partidasRecientes.length > 0) {
            notificador.info('\nPartidas recientes:');
            stats.partidasRecientes.forEach(partida => {
                const fecha = new Date(partida.fecha).toLocaleString();
                notificador.info(`  ${fecha}: ${partida.jugador} vs ${partida.enemigo} - ${partida.resultado}`);
            });
        }
        
        notificador.info('----------------------------');

    } catch (error) {
        notificador.error(`Error obteniendo estadísticas: ${error.message}`);
    }
}

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

main().catch(console.error);
