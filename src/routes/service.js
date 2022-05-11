const router = require('express').Router();
const serviceController = require('../controller/ServiceController');

router.get('/:id', serviceController.getService);
router.get('/start/:id', serviceController.startService);
router.get('/stop/:id', serviceController.stopService);

module.exports = router;