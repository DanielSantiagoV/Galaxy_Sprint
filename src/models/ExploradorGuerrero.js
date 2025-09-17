/**
 * ExploradorGuerrero.js
 * 
 * Clase que representa un explorador guerrero con estadísticas de tanque.
 * Extiende la clase base Explorador aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Explorador } from './Explorador.js';

/**
 * Clase ExploradorGuerrero - Representa un explorador de clase Guerrero
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas del guerrero
 * - OCP: Extiende Explorador sin modificar la clase base
 * - LSP: Es completamente sustituible por Explorador
 * - ISP: Implementa interfaz específica para guerreros
 */
export class ExploradorGuerrero extends Explorador {
    /**
     * Constructor de la clase ExploradorGuerrero
     * 
     * Inicializa un explorador guerrero con estadísticas de tanque.
     * Los guerreros tienen mucha vida, defensa y ataque, pero poca energía y velocidad.
     * 
     * @param {Object} opts - Opciones de inicialización del explorador
     */
    constructor(opts) { 
        // Llamar al constructor padre con estadísticas específicas del guerrero
        super({
            ...opts,                    // Pasar todas las opciones recibidas
            clase: 'Guerrero',          // Establecer clase como Guerrero
            vida: 150,                  // Vida muy alta (tanque)
            maxVida: 150,               // Vida máxima
            energia: 40,                // Energía baja
            maxEnergia: 40,             // Energía máxima
            ataque: 18,                 // Ataque muy alto
            defensa: 12,                // Defensa muy alta
            velocidad: 5                // Velocidad baja
        });
    }

    /**
     * Habilidad especial: Golpe Devastador
     * 
     * Permite al guerrero realizar un ataque extremadamente poderoso.
     * El ataque tiene un multiplicador de daño muy alto (2x) y gran variabilidad.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado del golpe devastador
     */
    golpeDevastador(enemigo) {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 10) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño con multiplicador devastador (2x) y alta variabilidad
        const daño = Math.max(1, (this.getAtaque() * 2) - enemigo.getDefensa() + Math.floor(Math.random() * 10));
        
        // Aplicar daño al enemigo
        enemigo.recibirDaño(daño);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 10);
        
        // Retornar resultado del golpe devastador
        return { 
            success: true, 
            accion: 'Golpe Devastador', 
            daño,
            energiaUsada: 10 
        };
    }

    /**
     * Método privado para modificar energía
     * 
     * Método auxiliar necesario para las habilidades especiales ya que
     * la energía es una propiedad privada de la clase base.
     * 
     * @private
     * @param {number} valor - Nuevo valor de energía
     */
    _setEnergia(valor) {
        // Establecer energía respetando los límites mínimo y máximo
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
