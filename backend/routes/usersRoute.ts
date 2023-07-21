import {
    answerContactRequest,
    getUser,
    sendContactRequest
} from "../controllers/usersController";
import { verifyToken } from "../middleware/verifyToken";

import express from 'express';

export const usersRoute = express.Router();

usersRoute.route('/contact')
    .post(verifyToken, answerContactRequest)

usersRoute.route('/:id')
    .get(verifyToken, getUser)
usersRoute.route('/:email')
    .post(verifyToken, sendContactRequest)

