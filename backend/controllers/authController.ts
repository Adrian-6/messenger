require('dotenv').config()
import axios from 'axios';
import Express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { pusherServer } from '../pusherServer';

const pusher = pusherServer

interface IUser extends mongoose.Document {
    username: string;
    avatar: string;
    email: string;
    contactRequests: string[]
    refreshToken: string;
    contacts?: string[];
}

const authWithGoogle = async (req: Express.Request, res: Express.Response) => {
    try {
        const { code, redirect_uri } = req.query; // code from service provider which is appended to the frontend's URL
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_SECRET;
        const grant_type = 'authorization_code'; // this tells the service provider to return a code which will be used to get a token for making requests to the service provider
        const url = 'https://oauth2.googleapis.com/token'; // link to api to exchange code for token.
        const access_type = 'offline'
        const { data } = await axios({
            url,
            method: 'POST',
            params: {
                access_type,
                client_id,
                client_secret,
                redirect_uri,
                code,
                grant_type,
            }
        });

        const tokenFromGoogle = data.access_token;
        const urlForGettingUserInfo = 'https://openidconnect.googleapis.com/v1/userinfo';

        const userData = await axios({
            url: urlForGettingUserInfo,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenFromGoogle}`,
            },
        });

        let userEmail = userData.data.email
        let foundUser = await User.findOne({ email: userEmail }, '-__v -refreshToken')

        if (!foundUser) {
            await User.create({
                username: userData.data.name,
                email: userEmail,
                avatar: userData.data.picture,
                refreshToken: data.refresh_token
            })
            foundUser = await User.findOne({ email: userEmail }, '-__v -refreshToken')
        }
        if (!foundUser) {
            console.log('create user failed')
            return res.json({ message: "Error. Please try again" })
        }
        //strore users' access token in DB
        foundUser.refreshToken = data.refresh_token
        await foundUser.save()
        const idToken = data.id_token
        const userId = foundUser._id
        console.log('id token: ', idToken, 'userId: ', userId)
        res.cookie('idToken', idToken, { maxAge: 24 * 60 * 60 * 1000 }) //24 hours
        res.cookie('access_token', tokenFromGoogle, {maxAge: 24 * 60 * 60 * 1000 }) //24 hours
        res.cookie('user_id', userId, { maxAge: 30 * 24 * 60 * 60 * 1000 }) //1 month
        const { username, contacts, avatar, email, id } = foundUser
        console.log(foundUser)
        res.json(foundUser);
        
    } catch (err: any) {
        console.log(err.message)
        return res.json(err)
    }
}

const pusherAuth = async (req: Express.Request, res: Express.Response) => {
    const query = req.query;
    const socketId: any = query.socket_id;
    const callback: any = query.callback
    const userId = req.cookies.user_id as string
    if (!query || !socketId || !callback || !userId) return res.status(401)
    try {
        const foundUser = await User.findOne({ _id: userId })
        if (!foundUser) return res.status(401).json({ message: "auth failed" })
        const { username, contacts, avatar, email } = foundUser
        const user = {
            id: userId,
            user_info: {
                username,
                avatar,
                email
            },
            watchlist: contacts
        };

        const auth = JSON.stringify(
            pusher.authenticateUser(socketId, user)
        );
        const cb = callback.replace(/\\"/g, "") + "(" + auth + ");";

        res.set({
            "Content-Type": "application/javascript"
        });

        res.send(cb);
    } catch (err: any) {
        console.log(err)
        return res.status(400).json({ message: "Error. Please try again later" })
    }

}

const getCredentials = async (req: Express.Request, res: Express.Response) => {

    const tokenFromGoogle = req.cookies.access_token;

    const urlForGettingUserInfo = 'https://openidconnect.googleapis.com/v1/userinfo';
    try {
        const userData = await axios({
            url: urlForGettingUserInfo,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenFromGoogle}`,
            },
        });

        let userEmail = userData.data.email

        let foundUser: IUser | null = await User.findOne({ email: userEmail }, '-__v -refreshToken')
        if (!foundUser) { return }
        const { username, contacts, avatar, email, id, contactRequests } = foundUser
        res.json({ username, contacts, avatar, email, id, contactRequests });
    } catch (error: any) {
        console.log(error.message)
    }
}

const handleLogout = async (req: Express.Request, res: Express.Response) => {
    const cookies = req.cookies;
    try {
        const userId = cookies.user_id;
        const foundUser = await User.findOne({ _id: userId })
        if (foundUser) {
            foundUser.refreshToken = '0'
            await foundUser.save()
        }
        // Delete refreshToken in db
    } finally {
        res.clearCookie('access_token', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
        res.clearCookie('idToken', { httpOnly: true, sameSite: 'none', secure: true });
        res.clearCookie('user_id', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(204);
    }
}


export { authWithGoogle, getCredentials, handleLogout, pusherAuth };
