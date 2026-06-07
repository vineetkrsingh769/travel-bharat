const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listPlaces, listAllPlaces, getPlace, createPlace, updatePlace, updatePlaceStatus, deletePlace
} = require('../controllers/placesController');

router.get('/',      listPlaces);
router.get('/admin',  auth, listAllPlaces);
router.get('/:slug', getPlace);
router.post('/',     auth, createPlace);
router.put('/:id',   auth, updatePlace);
router.patch('/:id/status', auth, updatePlaceStatus);
router.delete('/:id', auth, deletePlace);

module.exports = router;
