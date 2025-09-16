import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { ExploradorHumano } from './models/ExploradorHumano.js';
import { ExploradorIA } from './models/ExploradorIA.js';
import { NotificadorCLI } from './services/NotificadorCLI.js';
import { GestorCarrera } from './services/GestorCarrera.js';

async function main() {
    const notificador = new NotificadorCLI();
    let exit = false;
    let ultimoResultado = null;

    while (!exit) {
        const { opcion } = await inquirer.prompt([{
            type: 'list',
            name: 'opcion',
            message: 'Galaxy Sprint — Menú principal',
            choices: [
                { name: 'Iniciar nueva carrera', value: 'nueva' },
                { name: 'Ver instrucciones', value: 'help' },
                { name: 'Salir', value: 'salir' }
            ]
        }]);

        if (opcion === 'nueva') {
            const { nombre } = await inquirer.prompt([{
                type: 'input',
                name: 'nombre',
                message: 'Nombre del explorador: ',
                default: 'Jugador'
            }]);

            const jugador = new ExploradorHumano({ id: uuidv4(), nombre, posicion: 1, energia: 10 });
            const ia = new ExploradorIA({ id: uuidv4(), nombre: 'Rival-X', posicion: 1, energia: 10 });

            const gestor = new GestorCarrera({ jugador, ia, notificador });
            ultimoResultado = await gestor.iniciar();
            // opcional: guardar resultado en archivo
        }
        else if (opcion === 'help') {
            console.log(`
Galaxy Sprint — Instrucciones:
- Objetivo: llegar al planeta 5 primero.
- Acciones:
  * Avanzar: avanza 1 planeta, consume 2 energía.
  * Sprint: avanza 2 planetas, consume 4 energía.
  * Descansar: recupera 3 energía.
- La IA elige acciones aleatoriamente.
      `);
        }
        else if (opcion === 'salir') {
            exit = true;
        }
    }

    notificador.info('¡Gracias por jugar Galaxy Sprint! 👋');
}
main();
