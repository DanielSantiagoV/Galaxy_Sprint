/**
 * GeneradorAcciones.js
 * 
 * Módulo que proporciona funcionalidad para generar acciones aleatorias.
 * Este archivo es un remanente del sistema original de carrera y se mantiene
 * para compatibilidad, aunque la lógica de IA se ha movido a GestorBatalla.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

/**
 * Lista de acciones básicas disponibles
 * 
 * Estas acciones corresponden al sistema original de carrera espacial
 * y se mantienen para compatibilidad con el código existente.
 */
export const ACCIONES = ['Avanzar', 'Descansar', 'Sprint'];

/**
 * Selecciona una acción aleatoria de la lista de acciones disponibles
 * 
 * Esta función implementa una estrategia simple de selección aleatoria
 * uniforme. Se puede extender para añadir ponderaciones o comportamiento
 * táctico más sofisticado.
 * 
 * @returns {string} Acción seleccionada aleatoriamente
 */
export function elegirAccionAleatoria() {
    // Generar índice aleatorio basado en la longitud del array
    const idx = Math.floor(Math.random() * ACCIONES.length);
    
    // Retornar la acción correspondiente al índice generado
    return ACCIONES[idx];
}
