import express from 'express';
import * as ctrl from '../controllers';
import * as error from '../middleware/error';

const router = express.Router();

router.get('/start/:time', error.asyncWrapper(ctrl.start));
router.get('/pause', error.asyncWrapper(ctrl.pause));
router.get('/resume', error.asyncWrapper(ctrl.resume));
router.get('/stop', error.asyncWrapper(ctrl.stop));
router.get('/toggle', error.asyncWrapper(ctrl.toggle));
router.get('/default-text', error.asyncWrapper(ctrl.getDefaultText));
router.get('/config', error.asyncWrapper(ctrl.getConfig));
router.get('/config/set', error.asyncWrapper(ctrl.setConfig));

export default router;
