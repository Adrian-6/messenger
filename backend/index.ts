import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { connect } from 'mongoose';
import { authRoute } from './routes/authRoutes';
import { chatRoute } from './routes/chatRoutes';
import { usersRoute } from './routes/usersRoute';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsConfig = {
    credentials: true,
    origin: 'https://messenger-v9zk.onrender.com',
};

app.use(cors(corsConfig))

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(cookieParser())

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
    res.set('Access-Control-Allow-Origin', 'https://messenger-v9zk.onrender.com')
    next();
});

async function dbConnect() {
    let dbUrl = process.env.DATABASE_URL as string
    // 4. Connect to MongoDB
    await connect(dbUrl)

    console.log('DB connected');
}
dbConnect()

app.use('/auth', authRoute)

app.use('/user', usersRoute);

app.use('/chat', chatRoute)

app.get('/', (req: Request, res: Response) => {
    res.send('messaging app api');
});

app.listen(3000, () => {
    console.log(`Server is running`);
});

