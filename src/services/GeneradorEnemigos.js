/**
 * GeneradorEnemigos.js
 * 
 * Clase responsable de generar enemigos aleatorios para las batallas.
 * Aplica el principio SRP (Single Responsibility Principle) al tener una única
 * responsabilidad: crear enemigos con estadísticas balanceadas.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importaciones de librerías externas
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

// Importaciones de modelos de enemigos
import { ExploradorIA } from '../models/ExploradorIA.js';
import { ExploradorGuerrero } from '../models/ExploradorGuerrero.js';
import { ExploradorMago } from '../models/ExploradorMago.js';
import { ExploradorArquero } from '../models/ExploradorArquero.js';

/**
 * Clase GeneradorEnemigos - Crea enemigos aleatorios para las batallas
 * 
 * Aplica principios SOLID:
 * - SRP: Solo genera enemigos
 * - OCP: Extensible para nuevos tipos de enemigos
 * - LSP: Todos los enemigos son instancias de Explorador
 */
export class GeneradorEnemigos {
    /**
     * Constructor de la clase GeneradorEnemigos
     * 
     * Inicializa las listas de nombres y tipos de enemigos con sus probabilidades.
     */
    constructor() {
        // Lista de nombres temáticos para enemigos espaciales
        this.nombresEnemigos = [
            'Drone Espacial', 'Robot Asesino', 'Alien Depredador', 'Pirata Espacial',
            'Mercenario', 'Ciborg Rebelde', 'Entidad Oscura', 'Guerrero Perdido',
            'Mago Caído', 'Arquero Fantasma', 'Golem Espacial', 'Dragón Cósmico'
        ];
        
        // Configuración de tipos de enemigos con sus probabilidades de aparición
        this.tiposEnemigos = [
            { clase: 'IA', probabilidad: 0.3 },        // 30% de probabilidad
            { clase: 'Guerrero', probabilidad: 0.25 }, // 25% de probabilidad
            { clase: 'Mago', probabilidad: 0.25 },     // 25% de probabilidad
            { clase: 'Arquero', probabilidad: 0.2 }    // 20% de probabilidad
        ];
    }

    /**
     * Genera un enemigo aleatorio con estadísticas balanceadas
     * 
     * Crea un enemigo con estadísticas escaladas según el nivel del jugador
     * para mantener el desafío apropiado.
     * 
     * @param {number} nivelJugador - Nivel del jugador para escalar dificultad
     * @returns {Explorador} Instancia del enemigo generado
     */
    generarEnemigo(nivelJugador = 1) {
        // Seleccionar tipo de enemigo aleatoriamente
        const tipo = this.seleccionarTipoEnemigo();
        
        // Generar nombre único para el enemigo
        const nombre = this.generarNombreEnemigo();
        
        // Calcular multiplicador de dificultad basado en el nivel del jugador
        // 20% más fuerte por cada nivel del jugador
        const multiplicadorNivel = 1 + (nivelJugador - 1) * 0.2;
        
        // Obtener estadísticas base del tipo de enemigo
        const statsBase = this.obtenerStatsBase(tipo);
        
        // Escalar estadísticas según el nivel del jugador
        const statsEscaladas = this.escalarStats(statsBase, multiplicadorNivel);
        
        // Crear objeto con datos del enemigo
        const datosEnemigo = {
            id: uuidv4(), // ID único para el enemigo
            nombre: nombre, // Nombre generado aleatoriamente
            nivel: Math.max(1, nivelJugador + Math.floor(Math.random() * 3) - 1), // Nivel ±1 del jugador
            ...statsEscaladas // Estadísticas escaladas
        };

        // Crear y retornar instancia del enemigo
        return this.crearEnemigo(tipo, datosEnemigo);
    }

    /**
     * Selecciona un tipo de enemigo basado en probabilidades
     * 
     * Utiliza un algoritmo de selección ponderada para elegir
     * el tipo de enemigo según las probabilidades configuradas.
     * 
     * @returns {string} Tipo de enemigo seleccionado
     */
    seleccionarTipoEnemigo() {
        const random = Math.random(); // Número aleatorio entre 0 y 1
        let acumulado = 0; // Acumulador de probabilidades
        
        // Iterar sobre los tipos de enemigos
        for (const tipo of this.tiposEnemigos) {
            acumulado += tipo.probabilidad; // Sumar probabilidad al acumulador
            if (random <= acumulado) {
                return tipo.clase; // Retornar tipo si el random está en su rango
            }
        }
        
        return 'IA'; // Fallback por seguridad
    }

    /**
     * Genera un nombre único para el enemigo
     * 
     * Combina un nombre base aleatorio con un sufijo numérico
     * para garantizar unicidad.
     * 
     * @returns {string} Nombre único del enemigo
     */
    generarNombreEnemigo() {
        // Seleccionar nombre base aleatorio de la lista
        const nombre = this.nombresEnemigos[Math.floor(Math.random() * this.nombresEnemigos.length)];
        
        // Generar sufijo numérico aleatorio (0-999)
        const sufijo = Math.floor(Math.random() * 1000);
        
        // Combinar nombre base con sufijo
        return `${nombre} ${sufijo}`;
    }

    /**
     * Obtiene las estadísticas base para un tipo de enemigo
     * 
     * Define las estadísticas iniciales para cada clase de enemigo,
     * aplicando el principio OCP al permitir añadir nuevos tipos.
     * 
     * @param {string} tipo - Tipo de enemigo
     * @returns {Object} Estadísticas base del tipo de enemigo
     */
    obtenerStatsBase(tipo) {
        // Definición de estadísticas base para cada tipo de enemigo
        const statsBase = {
            'IA': {
                vida: 100,        // Vida moderada
                maxVida: 100,     // Vida máxima
                energia: 70,      // Energía moderada
                maxEnergia: 70,   // Energía máxima
                ataque: 10,       // Ataque equilibrado
                defensa: 6,       // Defensa moderada
                velocidad: 9      // Velocidad alta
            },
            'Guerrero': {
                vida: 150,        // Vida alta (tanque)
                maxVida: 150,     // Vida máxima
                energia: 40,      // Energía baja
                maxEnergia: 40,   // Energía máxima
                ataque: 18,       // Ataque alto
                defensa: 12,      // Defensa alta
                velocidad: 5      // Velocidad baja
            },
            'Mago': {
                vida: 80,         // Vida baja (frágil)
                maxVida: 80,      // Vida máxima
                energia: 100,     // Energía alta
                maxEnergia: 100,  // Energía máxima
                ataque: 15,       // Ataque alto
                defensa: 4,       // Defensa baja
                velocidad: 6      // Velocidad moderada
            },
            'Arquero': {
                vida: 100,        // Vida moderada
                maxVida: 100,     // Vida máxima
                energia: 60,      // Energía moderada
                maxEnergia: 60,   // Energía máxima
                ataque: 14,       // Ataque moderado-alto
                defensa: 6,       // Defensa moderada
                velocidad: 12     // Velocidad muy alta
            }
        };
        
        // Retornar estadísticas del tipo o fallback a IA
        return statsBase[tipo] || statsBase['IA'];
    }

    /**
     * Escala las estadísticas base según un multiplicador
     * 
     * Aplica el multiplicador a todas las estadísticas para ajustar
     * la dificultad según el nivel del jugador.
     * 
     * @param {Object} statsBase - Estadísticas base a escalar
     * @param {number} multiplicador - Factor de escalado
     * @returns {Object} Estadísticas escaladas
     */
    escalarStats(statsBase, multiplicador) {
        return {
            vida: Math.floor(statsBase.vida * multiplicador),         // Escalar vida
            maxVida: Math.floor(statsBase.maxVida * multiplicador),   // Escalar vida máxima
            energia: Math.floor(statsBase.energia * multiplicador),   // Escalar energía
            maxEnergia: Math.floor(statsBase.maxEnergia * multiplicador), // Escalar energía máxima
            ataque: Math.floor(statsBase.ataque * multiplicador),     // Escalar ataque
            defensa: Math.floor(statsBase.defensa * multiplicador),   // Escalar defensa
            velocidad: Math.floor(statsBase.velocidad * multiplicador) // Escalar velocidad
        };
    }

    /**
     * Crea una instancia del enemigo según su tipo
     * 
     * Aplica el Factory Pattern y el principio LSP al crear
     * instancias de diferentes tipos que son sustituibles.
     * 
     * @param {string} tipo - Tipo de enemigo a crear
     * @param {Object} datos - Datos del enemigo
     * @returns {Explorador} Instancia del enemigo creado
     */
    crearEnemigo(tipo, datos) {
        // Factory Pattern para crear enemigos según su tipo
        switch (tipo) {
            case 'IA':
                return new ExploradorIA(datos);        // Crear enemigo IA
            case 'Guerrero':
                return new ExploradorGuerrero(datos);  // Crear enemigo Guerrero
            case 'Mago':
                return new ExploradorMago(datos);      // Crear enemigo Mago
            case 'Arquero':
                return new ExploradorArquero(datos);   // Crear enemigo Arquero
            default:
                return new ExploradorIA(datos);        // Fallback a IA
        }
    }

    /**
     * Genera un enemigo boss con estadísticas superiores
     * 
     * Crea un enemigo especial más poderoso que los enemigos normales,
     * con estadísticas base más altas y escalado adicional.
     * 
     * @param {number} nivelJugador - Nivel del jugador para escalar dificultad
     * @returns {ExploradorGuerrero} Instancia del boss generado
     */
    generarEnemigoBoss(nivelJugador = 1) {
        // Generar nombre especial para el boss
        const nombre = this.generarNombreBoss();
        
        // Calcular multiplicador especial para boss
        // Boss 50% más fuerte que enemigo normal + 30% adicional por nivel
        const multiplicadorBoss = 1.5 + (nivelJugador - 1) * 0.3;
        
        // Definir estadísticas base del boss (más altas que enemigos normales)
        const statsBoss = {
            vida: Math.floor(200 * multiplicadorBoss),         // Vida base alta
            maxVida: Math.floor(200 * multiplicadorBoss),      // Vida máxima
            energia: Math.floor(80 * multiplicadorBoss),       // Energía moderada
            maxEnergia: Math.floor(80 * multiplicadorBoss),    // Energía máxima
            ataque: Math.floor(20 * multiplicadorBoss),        // Ataque alto
            defensa: Math.floor(15 * multiplicadorBoss),       // Defensa alta
            velocidad: Math.floor(10 * multiplicadorBoss)      // Velocidad moderada
        };

        // Crear objeto con datos del boss
        const datosBoss = {
            id: uuidv4(),                    // ID único
            nombre: nombre,                  // Nombre especial del boss
            nivel: nivelJugador + 2,         // Nivel superior al jugador
            ...statsBoss                     // Estadísticas del boss
        };

        // Boss siempre es un Guerrero (más resistente y poderoso)
        return new ExploradorGuerrero(datosBoss);
    }

    /**
     * Genera un nombre especial para un boss
     * 
     * Selecciona un nombre épico de una lista predefinida
     * para darle más importancia al enemigo boss.
     * 
     * @returns {string} Nombre épico del boss
     */
    generarNombreBoss() {
        // Lista de nombres épicos para bosses
        const nombresBoss = [
            'Señor de la Guerra Espacial', 'Emperador Oscuro', 'Reina de los Piratas',
            'Gran Dragón Cósmico', 'Líder de los Ciborgs', 'Maestro de las Sombras'
        ];
        
        // Seleccionar nombre aleatorio de la lista
        return nombresBoss[Math.floor(Math.random() * nombresBoss.length)];
    }
}
