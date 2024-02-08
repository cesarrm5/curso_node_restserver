const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){

        this.app = express();
        this.port =  process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';


        // Conectar a base de datos
        this.conentarDB();

        //Middlewares
        this.middlewares();
        
        //Rutas de mi aplicacion 
        this.routes();
    }

    async conentarDB(){
        await dbConnection();
    }

    middlewares(){
        //Directorio Público
        this.app.use(cors());
        this.app.use(express.json()); // se necesita para leer body de json
        this.app.use(express.static('public'));
        

    }


    routes(){
        
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
       

    }

    listen(){
        this.app.listen(this.port,  ()=>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;