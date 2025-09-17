import chalk from 'chalk';
import { INotificador } from '../interfaces/INotificador.js';

export class NotificadorCLI extends INotificador {
    info(text) { console.log(text); }
    success(text) { console.log(chalk.green(text)); }
    warn(text) { console.log(chalk.yellow(text)); }
    error(text) { console.log(chalk.red(text)); }

    mostrarEstado(estadoJugador, estadoEnemigo) {
        console.log('--- Estado de la batalla ---');
        console.log(`${estadoJugador.nombre} (${estadoJugador.clase} Nv.${estadoJugador.nivel})`);
        console.log(`  Vida: ${estadoJugador.vida}/${estadoJugador.maxVida} | Energía: ${estadoJugador.energia}/${estadoJugador.maxEnergia}`);
        console.log(`  Ataque: ${estadoJugador.ataque} | Defensa: ${estadoJugador.defensa} | Velocidad: ${estadoJugador.velocidad}`);
        console.log(`  Experiencia: ${estadoJugador.experiencia}/${estadoJugador.nivel * 100} | Items: ${estadoJugador.inventario}`);
        
        console.log(`\n${estadoEnemigo.nombre} (${estadoEnemigo.clase} Nv.${estadoEnemigo.nivel})`);
        console.log(`  Vida: ${estadoEnemigo.vida}/${estadoEnemigo.maxVida} | Energía: ${estadoEnemigo.energia}/${estadoEnemigo.maxEnergia}`);
        console.log(`  Ataque: ${estadoEnemigo.ataque} | Defensa: ${estadoEnemigo.defensa} | Velocidad: ${estadoEnemigo.velocidad}`);
        console.log('-----------------------------\n');
    }
}
