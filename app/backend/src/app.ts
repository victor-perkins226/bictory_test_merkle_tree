import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes';


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/build`))

app.use('/api', routes);
app.use('/*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`)
})

const port = process.env.PORT
app.listen(port, () => {
  console.info(`server started on port ${port}`)
})

