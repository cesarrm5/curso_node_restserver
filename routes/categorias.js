const { Router } = require('express');
const {check} = require('express-validator');

const { validarCampos, validarJWT, isAdminRole  } = require('../middlewares');
const { 
    crearCategoria, 
    obtenerCategorias,
    getCategoria,
    actualizarCategoria,
    borrarCategoria,
    } = require('../controllers/categorias');

const { existeIdCategoria } = require('../helpers/categoria-valiators');

const router =  Router();

//obtener todas las cartegorias - publico
router.get('/',obtenerCategorias);

//obtener una cartegorias po id - publico
router.get('/:id',[
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeIdCategoria),
    validarCampos
], getCategoria);

//Crear categoria - privado - caulquier pesona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquier token valido.
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeIdCategoria),
    validarCampos
],actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    //isAdminRole,
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeIdCategoria),
    validarCampos
],borrarCategoria);

module.exports = router;