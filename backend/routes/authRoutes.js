import {body} from 'express-validator'
import express from 'express'
import {
    register,
    login,
    getprofile,
    updateprofile,
    changepassword,

} from '../controllers/authController.js'
import protect from '../middleware/auth.js'
const routes = express.Router();

const registeValidator = [
    body('username')
    .trim()
    .isLength({min: 3})
    .withMessage('User name atlest 3 charater'),
    body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage('Pleas provid valid email'),
    body('password')
    .notEmpty()
    .withMessage("Password is required")

];

const loginValidator = [
    body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage('Pleas provid valid email'),
    body('password')
    .notEmpty()
    .withMessage("Password is required")

];



//Public Route
routes.post('/register', registeValidator,register );
routes.post('/login', loginValidator,login);

//Protected

routes.get('/getprofile', protect, getprofile);
routes.post('/updateprofile',protect,updateprofile);
routes.post('/changepassword', protect, changepassword);


export default routes;