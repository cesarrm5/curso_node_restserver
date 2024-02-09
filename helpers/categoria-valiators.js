const { Categoria, Producto } = require("../models");

const existeIdCategoria = async(id) => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El ID= ${id} no existe.`)
    }    
}

const existeIdProducto = async(id) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El ID= ${id} no existe.`)
    }    
}

module.exports = {
    existeIdCategoria,
    existeIdProducto
}
