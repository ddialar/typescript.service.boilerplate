import express, { Router, Request, Response } from 'express';
import manifest from '@manifest';

const { MANIFEST_ROUTE } = process.env;
const manifestRoutes: Router = express.Router();

manifestRoutes.get(MANIFEST_ROUTE, (req: Request, res: Response) => {
    res.json(manifest);
});

export { manifestRoutes };
