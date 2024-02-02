const {response, request} = require('express');
const Usuario = require('../models/usuario')

const bcryptjs = require('bcryptjs');

const usuariosGet = async(req = request,res = response)=>{
    
    //const {q, nombre='No Name', apikey, page=1, limit} = req.query;
    const { limite=5, desde=0 } = req.query;
    const query = {estado:true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response)=>{
    
    const {nombre,correo, password, rol} = req.body;
    const usuario = new Usuario({nombre,correo, password, rol});

    //Encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save(); // guarda los datos en la base.
 
    res.json({
        msg: 'POST API - controlador',
        usuario
    });
};

const usuariosPut = async(req, res = response)=>{

    const {id}= req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    //TODO VALIDAR 
    if (password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    console.log(id,resto)
    const usuario = await  Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'Put API - controlador',
        usuario
    });
};

const usuariosPatch = (req, res = response)=>{
    res.json({
        msg: 'patch API - controlador'
    });
};

const usuariosDelete =async(req, res = response)=>{
    const {id} = req.params;

    //físicamente lo borramos
    //const usuario = await  Usuario.findByIdAndDelete(id);

    const usuario = await  Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
        usuario
    });
};


module.exports ={
    usuariosGet,
    usuariosDelete,
    usuariosPatch,
    usuariosPut,
    usuariosPost
}