import './common/env';
import App from './common/server';
import routes from './routes';

const port = parseInt(process.env.PORT);
export default new App()
  .router(routes)
  .listen(port);
