const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const usuario = require('./usuario');

class Server{

    constructor(){

        this.app = express();
        this.port =  process.env.PORT;
        this.paths ={
            auth      : '/api/auth',
            buscar    : '/api/buscar',
            categorias: '/api/categorias',
            usuarios  : '/api/usuarios',
            productos : '/api/productos'
        }


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
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }

    listen(){
        this.app.listen(this.port,  ()=>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;