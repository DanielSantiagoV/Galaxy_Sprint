import { v4 as uuidv4 } from 'uuid';
import { ExploradorIA } from '../models/ExploradorIA.js';
import { ExploradorGuerrero } from '../models/ExploradorGuerrero.js';
import { ExploradorMago } from '../models/ExploradorMago.js';
import { ExploradorArquero } from '../models/ExploradorArquero.js';

// Generador de enemigos aleatorios (SRP - Single Responsibility Principle)
export class GeneradorEnemigos {
    constructor() {
        this.nombresEnemigos = [
            'Drone Espacial', 'Robot Asesino', 'Alien Depredador', 'Pirata Espacial',
            'Mercenario', 'Ciborg Rebelde', 'Entidad Oscura', 'Guerrero Perdido',
            'Mago Caído', 'Arquero Fantasma', 'Golem Espacial', 'Dragón Cósmico'
        ];
        
        this.tiposEnemigos = [
            { clase: 'IA', probabilidad: 0.3 },
            { clase: 'Guerrero', probabilidad: 0.25 },
            { clase: 'Mago', probabilidad: 0.25 },
            { clase: 'Arquero', probabilidad: 0.2 }
        ];
    }

    generarEnemigo(nivelJugador = 1) {
        const tipo = this.seleccionarTipoEnemigo();
        const nombre = this.generarNombreEnemigo();
        const multiplicadorNivel = 1 + (nivelJugador - 1) * 0.2; // 20% más fuerte por nivel
        
        const statsBase = this.obtenerStatsBase(tipo);
        const statsEscaladas = this.escalarStats(statsBase, multiplicadorNivel);
        
        const datosEnemigo = {
            id: uuidv4(),
            nombre: nombre,
            nivel: Math.max(1, nivelJugador + Math.floor(Math.random() * 3) - 1), // ±1 nivel del jugador
            ...statsEscaladas
        };

        return this.crearEnemigo(tipo, datosEnemigo);
    }

    seleccionarTipoEnemigo() {
        const random = Math.random();
        let acumulado = 0;
        
        for (const tipo of this.tiposEnemigos) {
            acumulado += tipo.probabilidad;
            if (random <= acumulado) {
                return tipo.clase;
            }
        }
        
        return 'IA'; // Fallback
    }

    generarNombreEnemigo() {
        const nombre = this.nombresEnemigos[Math.floor(Math.random() * this.nombresEnemigos.length)];
        const sufijo = Math.floor(Math.random() * 1000);
        return `${nombre} ${sufijo}`;
    }

    obtenerStatsBase(tipo) {
        const statsBase = {
            'IA': {
                vida: 100,
                maxVida: 100,
                energia: 70,
                maxEnergia: 70,
                ataque: 10,
                defensa: 6,
                velocidad: 9
            },
            'Guerrero': {
                vida: 150,
                maxVida: 150,
                energia: 40,
                maxEnergia: 40,
                ataque: 18,
                defensa: 12,
                velocidad: 5
            },
            'Mago': {
                vida: 80,
                maxVida: 80,
                energia: 100,
                maxEnergia: 100,
                ataque: 15,
                defensa: 4,
                velocidad: 6
            },
            'Arquero': {
                vida: 100,
                maxVida: 100,
                energia: 60,
                maxEnergia: 60,
                ataque: 14,
                defensa: 6,
                velocidad: 12
            }
        };
        
        return statsBase[tipo] || statsBase['IA'];
    }

    escalarStats(statsBase, multiplicador) {
        return {
            vida: Math.floor(statsBase.vida * multiplicador),
            maxVida: Math.floor(statsBase.maxVida * multiplicador),
            energia: Math.floor(statsBase.energia * multiplicador),
            maxEnergia: Math.floor(statsBase.maxEnergia * multiplicador),
            ataque: Math.floor(statsBase.ataque * multiplicador),
            defensa: Math.floor(statsBase.defensa * multiplicador),
            velocidad: Math.floor(statsBase.velocidad * multiplicador)
        };
    }

    crearEnemigo(tipo, datos) {
        switch (tipo) {
            case 'IA':
                return new ExploradorIA(datos);
            case 'Guerrero':
                return new ExploradorGuerrero(datos);
            case 'Mago':
                return new ExploradorMago(datos);
            case 'Arquero':
                return new ExploradorArquero(datos);
            default:
                return new ExploradorIA(datos);
        }
    }

    generarEnemigoBoss(nivelJugador = 1) {
        const nombre = this.generarNombreBoss();
        const multiplicadorBoss = 1.5 + (nivelJugador - 1) * 0.3; // Boss 50% más fuerte + 30% por nivel
        
        const statsBoss = {
            vida: Math.floor(200 * multiplicadorBoss),
            maxVida: Math.floor(200 * multiplicadorBoss),
            energia: Math.floor(80 * multiplicadorBoss),
            maxEnergia: Math.floor(80 * multiplicadorBoss),
            ataque: Math.floor(20 * multiplicadorBoss),
            defensa: Math.floor(15 * multiplicadorBoss),
            velocidad: Math.floor(10 * multiplicadorBoss)
        };

        const datosBoss = {
            id: uuidv4(),
            nombre: nombre,
            nivel: nivelJugador + 2,
            ...statsBoss
        };

        return new ExploradorGuerrero(datosBoss); // Boss siempre es guerrero
    }

    generarNombreBoss() {
        const nombresBoss = [
            'Señor de la Guerra Espacial', 'Emperador Oscuro', 'Reina de los Piratas',
            'Gran Dragón Cósmico', 'Líder de los Ciborgs', 'Maestro de las Sombras'
        ];
        
        return nombresBoss[Math.floor(Math.random() * nombresBoss.length)];
    }
}
