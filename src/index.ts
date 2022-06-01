import express, {Express} from 'express';
import bodyParser from 'body-parser';
import config from './config';
import apiRoutes from './api';

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use('/', apiRoutes);

const port: number = config.APP.PORT;
app.listen(port, () => console.log('Listening on ' + port));

