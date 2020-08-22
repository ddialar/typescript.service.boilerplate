import express, { Router, Request, Response } from 'express';
import manifest from '@manifest';

const { MANIFEST_URI } = process.env;
const manifestRoutes: Router = express.Router();

manifestRoutes.get(MANIFEST_URI, (req: Request, res: Response) => {
    res.json(manifest);
});

export { manifestRoutes };
