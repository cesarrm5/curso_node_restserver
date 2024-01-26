const express = require('express')
const cors = require('cors')

class Server{

    constructor(){

        this.app = express();
        this.port =  process.env.PORT;
        this.usuariosPath = '/api/usuarios'

        //Middlewares
        this.middlewares();
        
        //Rutas de mi aplicacion 
        this.routes();
    }

    middlewares(){
        //Directorio Público

        this.app.use(express.static('public'));
        this.app.use(express.json()); // se necesita para leer body de json
        this.app.use(cors());

    }


    routes(){

        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen(){
        this.app.listen(this.port,  ()=>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;