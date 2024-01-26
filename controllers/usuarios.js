const {response, request} = require('express');


const usuariosGet = (req = request,res = response)=>{
    
    const {q, nombre='No Name', apikey, page=1, limit} = req.query;

    res.json({
        msg: 'get API-controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req, res = response)=>{
    
    console.log(req)

    const body = req.body;

    res.json({
        msg: 'POST API - controlador',
        body
    });
};

const usuariosPut =(req, res = response)=>{
    const {id}= req.params;
    res.json({
        msg: 'Put API - controlador',
        id
    });
};

const usuariosPatch = (req, res = response)=>{
    res.json({
        msg: 'patch API - controlador'
    });
};

const usuariosDelete =(req, res = response)=>{
    res.json({
        msg: 'Delete API - controlador'
    });
};


module.exports ={
    usuariosGet,
    usuariosDelete,
    usuariosPatch,
    usuariosPut,
    usuariosPost
}