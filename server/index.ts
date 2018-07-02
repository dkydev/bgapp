import './common/env';
import App from './common/server';
import routes from './routes';

const port = parseInt(process.env.PORT);
export default new App()
    .initDB(process.env.DB_NAME)
    .router(routes)
    .listen(port);
