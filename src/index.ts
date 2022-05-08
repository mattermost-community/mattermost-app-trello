import express, {Express} from 'express';
import bodyParser from 'body-parser';
import config from './config';

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const port: number = config.APP.PORT;
app.listen(port, () => console.log('Listening on ' + port));

