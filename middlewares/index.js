
const validaRoles = require('../middlewares/Validar-roles');
const validarCampos = require('../middlewares/validar-campos')
const validarJWT  = require('../middlewares/Validar-jwt');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
}