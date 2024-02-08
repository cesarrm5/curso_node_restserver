const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res=response, next)=>{
    
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token en la peticions'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer a que usuario corresponde la uid
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:"Token no valido - usuario no existe"
            })
        }
        //verificar  si el uid tienen estado true
        console.log(usuario)
        if(!usuario.estado)
        {
            return res.status(401).json({
                msg:"Token no valido - usuario con estado false"
            })
        }

        req.usuario = usuario;
        
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}