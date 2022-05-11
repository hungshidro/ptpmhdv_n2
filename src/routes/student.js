const router = require('express').Router();
const studentController = require('../controller/StudentController');

router.post('/add', studentController.addNewStudent);
router.get('/:id',studentController.getStudent);
router.get('/login/:id',studentController.validateStudent);
router.get('/getAllService/:id', studentController.getAllServiceOfStudent)

module.exports = router;