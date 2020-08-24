import express from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import { manifestRoutes } from './routes';
import { logger } from '@utils';

import { serve as swaggerServe, setup as swaggerSetup } from 'swagger-ui-express';
import { swaggerDocument } from '@apiDocumentation';

const { APIDOC_ROUTE } = process.env;

const runServer = (port: number = 4000): Server => {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(APIDOC_ROUTE, swaggerServe, swaggerSetup(swaggerDocument));

    app.use(manifestRoutes);

    return app.listen(port, () => logger.info(`Service running on port ${port} ...`));
};

export { runServer };
