const { Router } = require('express');
const {check} = require('express-validator');

//const { asAdminRole, tieneRole } = require('../middlewares/Validar-roles');
//const {validarCampos} = require('../middlewares/validar-campos')
//const { validarJWT } = require('../middlewares/Validar-jwt');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares')

const {esRoleValido, emailExiste, existeUsuarioPorId} =require('../helpers/db-valiators');

const { usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosPut,
    usuariosDelete
} = require('../controllers/usuarios');


const router = Router();

router.get('/', [],usuariosGet);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe de ser mas de 6 letras').isLength({min:6}),
    check('correo', 'EL correo no es valido').isEmail(),
    //check('rol','No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost);

router.put('/:id',[
    check('id', "No es un ID valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    //asAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);

module.exports = router;