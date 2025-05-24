import Config from '../config';
import Logger from '../logger';
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { accountApi } from './api/account';
import { inviteApi } from './api/invite';

const port = Config.port || 8080;
export const app = express();
export const server = http.createServer(app);

app.use(cookieParser());
app.use('/account', accountApi);
app.use('/invite', inviteApi);
app.use('/', express.static('./frontend'));
app.all('*', (request, response) => {
    Logger.warn(`Somebody tried to access path: ${request.path} [404]`)
    response.status(404).redirect('/?error=notFound')
});
server.listen(port, () => Logger.info('Listening at:', port));
