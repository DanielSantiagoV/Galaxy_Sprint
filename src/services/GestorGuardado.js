import fs from 'fs/promises';
import path from 'path';
import { Explorador } from '../models/Explorador.js';
import { ExploradorHumano } from '../models/ExploradorHumano.js';
import { ExploradorIA } from '../models/ExploradorIA.js';
import { ExploradorGuerrero } from '../models/ExploradorGuerrero.js';
import { ExploradorMago } from '../models/ExploradorMago.js';
import { ExploradorArquero } from '../models/ExploradorArquero.js';
import { Pocion } from '../models/items/Pocion.js';
import { Arma } from '../models/items/Arma.js';
import { Armadura } from '../models/items/Armadura.js';
import { Energia } from '../models/items/Energia.js';

// Gestor de guardado y carga (SRP - Single Responsibility Principle)
export class GestorGuardado {
    constructor() {
        this.directorioGuardado = './data';
        this.archivoPersonajes = path.join(this.directorioGuardado, 'personajes.json');
        this.archivoPartidas = path.join(this.directorioGuardado, 'partidas.json');
    }

    async inicializar() {
        try {
            await fs.mkdir(this.directorioGuardado, { recursive: true });
            
            // Crear archivos si no existen
            try {
                await fs.access(this.archivoPersonajes);
            } catch {
                await fs.writeFile(this.archivoPersonajes, JSON.stringify([], null, 2));
            }
            
            try {
                await fs.access(this.archivoPartidas);
            } catch {
                await fs.writeFile(this.archivoPartidas, JSON.stringify([], null, 2));
            }
        } catch (error) {
            throw new Error(`Error inicializando sistema de guardado: ${error.message}`);
        }
    }

    async guardarPersonaje(personaje) {
        try {
            const personajes = await this.cargarPersonajes();
            const indiceExistente = personajes.findIndex(p => p.id === personaje.getId());
            
            const datosPersonaje = this.serializarPersonaje(personaje);
            
            if (indiceExistente >= 0) {
                personajes[indiceExistente] = datosPersonaje;
            } else {
                personajes.push(datosPersonaje);
            }
            
            await fs.writeFile(this.archivoPersonajes, JSON.stringify(personajes, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Error guardando personaje: ${error.message}`);
        }
    }

    async cargarPersonajes() {
        try {
            const contenido = await fs.readFile(this.archivoPersonajes, 'utf-8');
            const datos = JSON.parse(contenido);
            return datos.map(datosPersonaje => this.deserializarPersonaje(datosPersonaje));
        } catch (error) {
            throw new Error(`Error cargando personajes: ${error.message}`);
        }
    }

    async eliminarPersonaje(idPersonaje) {
        try {
            const personajes = await this.cargarPersonajes();
            const personajesFiltrados = personajes.filter(p => p.getId() !== idPersonaje);
            await fs.writeFile(this.archivoPersonajes, JSON.stringify(personajesFiltrados.map(p => this.serializarPersonaje(p)), null, 2));
            return true;
        } catch (error) {
            throw new Error(`Error eliminando personaje: ${error.message}`);
        }
    }

    async guardarPartida(datosPartida) {
        try {
            const partidas = await this.cargarPartidas();
            partidas.push({
                ...datosPartida,
                fecha: new Date().toISOString()
            });
            
            await fs.writeFile(this.archivoPartidas, JSON.stringify(partidas, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Error guardando partida: ${error.message}`);
        }
    }

    async cargarPartidas() {
        try {
            const contenido = await fs.readFile(this.archivoPartidas, 'utf-8');
            return JSON.parse(contenido);
        } catch (error) {
            throw new Error(`Error cargando partidas: ${error.message}`);
        }
    }

    serializarPersonaje(personaje) {
        const datos = personaje.toJSON();
        datos.clase = personaje.getClase(); // Asegurar que la clase esté incluida
        return datos;
    }

    deserializarPersonaje(datos) {
        // Crear el tipo correcto de personaje según la clase
        let personaje;
        
        switch (datos.clase) {
            case 'Humano':
                personaje = new ExploradorHumano(datos);
                break;
            case 'IA':
                personaje = new ExploradorIA(datos);
                break;
            case 'Guerrero':
                personaje = new ExploradorGuerrero(datos);
                break;
            case 'Mago':
                personaje = new ExploradorMago(datos);
                break;
            case 'Arquero':
                personaje = new ExploradorArquero(datos);
                break;
            default:
                personaje = new Explorador(datos);
        }

        // Restaurar inventario
        if (datos.inventario) {
            personaje.inventario = datos.inventario.map(itemData => this.deserializarItem(itemData));
        }

        return personaje;
    }

    deserializarItem(datos) {
        switch (datos.tipo) {
            case 'pocion':
                return new Pocion(datos);
            case 'arma':
                return new Arma(datos);
            case 'armadura':
                return new Armadura(datos);
            case 'energia':
                return new Energia(datos);
            default:
                return datos; // Item genérico
        }
    }

    async obtenerEstadisticas() {
        try {
            const personajes = await this.cargarPersonajes();
            const partidas = await this.cargarPartidas();
            
            return {
                totalPersonajes: personajes.length,
                totalPartidas: partidas.length,
                personajesPorClase: this.contarPersonajesPorClase(personajes),
                partidasRecientes: partidas.slice(-5)
            };
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    }

    contarPersonajesPorClase(personajes) {
        const conteo = {};
        personajes.forEach(personaje => {
            const clase = personaje.getClase();
            conteo[clase] = (conteo[clase] || 0) + 1;
        });
        return conteo;
    }
}
