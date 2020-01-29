import express, { Express } from 'express';
import router from './routes';
import BarTimer from './models/BarTimer';
import config from './utils/config';
import * as error from './middleware/error';

const startServer = (server: Express) => {
  const port = config.get('port');
  server.listen(port);
  console.log(`Server running on port ${port}`);
};

const server = express();
server.use('/bartime', router);
server.use(error.log);
server.use(error.notify);
server.use(error.handler);

startServer(server);

export const Timer = new BarTimer();

export default server;
