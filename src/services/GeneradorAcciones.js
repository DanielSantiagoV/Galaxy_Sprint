// GeneradorAcciones: estrategia para escoger acciones aleatorias
export const ACCIONES = ['Avanzar', 'Descansar', 'Sprint'];

/**
 * Devuelve una acción elegida aleatoriamente.
 * Se puede extender para añadir ponderaciones o comportamiento táctico.
 */
export function elegirAccionAleatoria() {
    const idx = Math.floor(Math.random() * ACCIONES.length);
    return ACCIONES[idx];
}
