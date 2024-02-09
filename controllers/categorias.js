const { response } = require("express");
const {Categoria} =require ('../models');


// obtener Categorias -  paginado - total - populate
const obtenerCategorias = async(req,res = response)=>{

    const {limite = 5, desde  =0} = req.query;
    const query = {estado:true};

    const [total, cartegorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);


    res.status(201).json({
        total,
        cartegorias,
    });

}
//obtener categoria  -populate

const getCategoria =async(req, res = response)=>{
    const {id} = req.params;
    const categoria = await  Categoria.findById(id,{estado:false}).populate('usuario').exec();
    console.log(categoria)
    if(categoria.estado){
        return res.status(400).json({
            msg:`La categoria ${id}, esta deshabilitada`
        });
    }
    res.json({
        categoria,
    });
};


const crearCategoria = async(req,res = response)=>{

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB =  await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar datos a guardar
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    
    /// Guardar en DB
    await categoria.save(); ///

    res.status(201).json(categoria);

}

//actualizar Categoria
const actualizarCategoria = async(req,res = response)=>{

    const {id} = req.params;    
    let {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    //console.log(req.usuario);
    data.usuario = req.usuario._id;

    const categoriaDB =  await Categoria.findOne(data.nombre);

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // const categoriaId =  await Categoria.findById(id);
    // //Generar datos a guardar
    // const data ={
    //     nombre,
    //     ...body
    // }

   const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true});

    res.status(201).json({
        categoria
    });

}

//borrar categoria - estado  false 
const borrarCategoria =async(req, res = response)=>{
    const {id} = req.params;
    const categoria = await  Categoria.findByIdAndUpdate(id,{estado:false}, {new:true});
 
    res.json({
        categoria
    });
};


module.exports ={
    crearCategoria,
    obtenerCategorias,
    getCategoria,
    actualizarCategoria,
    borrarCategoria
}