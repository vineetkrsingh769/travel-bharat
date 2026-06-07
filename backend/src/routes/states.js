const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listStates, listAllStates, getState, createState, updateState, updateStateStatus, deleteState
} = require('../controllers/statesController');

router.get('/',     listStates);
router.get('/admin', auth, listAllStates);
router.get('/:slug', getState);
router.post('/',    auth, createState);
router.put('/:id',  auth, updateState);
router.patch('/:id/status', auth, updateStateStatus);
router.delete('/:id', auth, deleteState);

module.exports = router;
