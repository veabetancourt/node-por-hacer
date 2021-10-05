const inquirer = require('inquirer');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
    inquirerMenu, 
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoCheckList
 } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

require('colors');

const main = async() => {
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if( tareasDB) {
      //Establecer las tareas.
      tareas.cargarTareasFromArray( tareasDB );

    }

    do{
    // imprimir el menu
      opt = await inquirerMenu();
        
      switch (opt) {
          case '1':
              const desc = await leerInput( 'Descripción:');
              tareas.crearTarea( desc );
              break;
      
          case '2':
            tareas.listadoCompletado();

              break;
          case '3': // Listar completadas
            tareas.listarPendientesCompletadas(true);
            break;
            case '4': // Listar pendientes
            tareas.listarPendientesCompletadas(false);
            break;
            case '5': // completado | pendiente
             const ids = await mostrarListadoCheckList( tareas.listadoArr);
             tareas.toggleCompletadas( ids );
            break;

            case '6': // Borrar tareas
             const id = await listadoTareasBorrar( tareas.listadoArr );
             if ( id !== '0') {
             const ok = await confirmar('¿Está seguro?');
             if ( ok ){
               tareas.borrarTarea( id );
               console.log('Tarea borrada');
             }

            }  
              break;
      }

      guardarDB( tareas.listadoArr );

      await pausa();


    }while( opt !== '0' );
   
    
}

main();