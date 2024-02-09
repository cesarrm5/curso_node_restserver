const {response} = require('express');
const { Producto } = require('../models');

const crearProducto = async(req,res = response)=>{

    const {nombre, ...data} = req.body;
    data.nombre = nombre.toUpperCase();
    const productoDB =  await Producto.findOne({nombre})

    if(productoDB){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre}, ya existe`
        });
    }
    //Generar datos a guardar

    const producto = new Producto(data);
    
    /// Guardar en DB
    await producto.save(); ///

    res.status(201).json(producto);

}

const obtenerProductos = async(req,res = response)=>{

    const {limite = 5, desde  =0} = req.query;
    const query = {estado:true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('categoria')
        .populate('usuario')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);


    res.status(201).json({
        total,
        productos,
    });

}

const getProducto =async(req, res = response)=>{
    const {id} = req.params;
    const producto = await  Producto.findById(id)
                            .populate('usuario')
                            .populate('categoria')
                            .exec();
    if(!producto.estado){
        return res.status(400).json({
            msg:`El producto ${id}, esta deshabilitado`
        });
    }
    res.json({
        producto
    });
};

//actualizar Categoria
const actualizarProductos = async(req,res = response)=>{
    const {id} = req.params;    

    const {...data} = req.body;
    
   const producto = await Producto.findByIdAndUpdate(id,data,{new:true})
                            .populate('usuario')
                            .populate('categoria');

    res.status(201).json({
        producto
    });

}

const borrarProducto =async(req, res = response)=>{
    const {id} = req.params;
    const producto = await  Producto.findByIdAndUpdate(id,{estado:false}, {new:true});
 
    res.json({
        producto
    });
};

module.exports={
    crearProducto,
    obtenerProductos,
    getProducto,
    actualizarProductos,
    borrarProducto
}