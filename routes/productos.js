const { Router } = require('express');
const {check} = require('express-validator');

const { validarCampos, validarJWT, isAdminRole  } = require('../middlewares');

const { crearProducto,
        obtenerProductos,
        getProducto,
        actualizarProductos,
        borrarProducto
        } = require('../controllers/productos');

const { existeIdProducto } = require('../helpers/categoria-valiators');

const router =  Router();

//obtener todas las cartegorias - publico
router.get('/',obtenerProductos);


router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatoria').not().isEmpty(),
    check('categoria','No es un id de Mongo valido').isMongoId(),
    validarCampos
]
,crearProducto);

router.get('/:id',[
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeIdProducto),
    validarCampos
], getProducto);


router.put('/:id',[
    validarJWT,
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeIdProducto),
    validarCampos
],actualizarProductos);

// //Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    //isAdminRole,
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeIdProducto),
    validarCampos
],borrarProducto);

module.exports = router;