import chalk from 'chalk';
export class NotificadorCLI {
    info(text) { console.log(text); }
    success(text) { console.log(chalk.green(text)); }
    warn(text) { console.log(chalk.yellow(text)); }
    error(text) { console.log(chalk.red(text)); }

    mostrarEstado(estadoJugador, estadoIA) {
        console.log('--- Estado actual ---');
        console.log(`${estadoJugador.nombre} — Planeta: ${estadoJugador.posicion} | Energía: ${estadoJugador.energia}`);
        console.log(`${estadoIA.nombre} — Planeta:     ${estadoIA.posicion} | Energía: ${estadoIA.energia}`);
        console.log('---------------------\n');
    }
}
