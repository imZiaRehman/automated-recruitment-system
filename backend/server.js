import express from 'express';
import { config } from 'dotenv';
import connect from './database/cons.js';
import router from './router/routes.js';
import morgan from 'morgan';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieParser());


config();
const port = process.env.PORT || 8080;

/* routes */
app.get('/', (req, res) => {
  try {
    res.json('Get Request');
  } catch (error) {
    res.json(error);
  }
});

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server started at port #${port}`);
      });
    } catch (error) {
      console.log(`Cannot connect to port#${port}`);
    }
  })
  .catch((error) => {
    console.log('Database connection failed');
  });

/** routes */
app.use('/api', router); /** apis */
