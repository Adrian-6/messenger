import { authWithGoogle, pusherAuth, getCredentials } from '../controllers/authController'
import express from 'express';
import { verifyToken } from "../middleware/verifyToken";


export const authRoute = express.Router();

authRoute.route('/google')
    .get(authWithGoogle)
authRoute.route('/pusher')
    .post(pusherAuth)
    .get(pusherAuth)
authRoute.route('/userinfo')
    .get(verifyToken, getCredentials)