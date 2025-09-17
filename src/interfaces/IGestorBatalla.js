// Interface para gestores de batalla (DIP - Dependency Inversion Principle)
export class IGestorBatalla {
    iniciar() {
        throw new Error('Método iniciar() debe ser implementado');
    }
    
    ejecutarTurno() {
        throw new Error('Método ejecutarTurno() debe ser implementado');
    }
    
    verificarGanador() {
        throw new Error('Método verificarGanador() debe ser implementado');
    }
}
