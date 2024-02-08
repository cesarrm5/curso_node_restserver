const { response } = require("express")
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require("../helpers/google-verify")

const login = async(req, res= response) =>{

    const {correo, password} = req.body;

    try {

        ///vericar si el email exite

        const usuario= await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - correo'
            });  
        }
        // SI el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - correo'
            });  
        }
        
        //verificar la contrase
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - correo'
            });  
        }
        //generar el JWT
        const token = await generarJWT(usuario.id);

    
        res.json({
            usuario,
            token
        })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            msg:'Hable con el administrador'
        });    
    }

}

const googleSignIn = async(req, res= response)=>{

    const {id_token} = req.body;

   // try {
        const  {correo, nombre, img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo})
        
        if(!usuario){
            //Tengo que crearlo
            const data ={
                nombre,
                correo,
                password: ':P',
                img,
                google:true,
                estado: true,
                rol: "USER_ROLE"
            };
            
            usuario = new Usuario(data);
            await usuario.save();
            
        }

        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    /*} catch (error) {
        res.status(400).json({
            ok:false,
            msg: 'Token de Google no es valido'
        })
    }*/

}

module.exports={
    login,
    googleSignIn
}