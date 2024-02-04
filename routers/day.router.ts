import express from 'express';

import dayController from '../controllers/day.controller';
import { checkOwnership, protect } from '../middleware/permissions.middleware';

const router = express.Router();

router.use(protect());

// * Routes

router.get('/currentMonth', dayController.getDaysInCurrentMonth);
router.get('/range', dayController.getDaysInMonths);

router.use('/:dayId', checkOwnership({ model: 'Day', key: 'params', idField: 'dayId' }));

// prettier-ignore
router.route('/:dayId')
    .patch(dayController.updateDay)
    .delete(dayController.deleteDay)

router.put('/:dayId/entries', dayController.updateEntries);

// prettier-ignore
router.route('/')
    .post(dayController.createDay);

export default router;

// TODO: put admin controller in separate file

// router.use(restrictTo('admin'));
// router.route('/all').get(ACRUD.all(Day));

// // prettier-ignore
// router.route('/:id')
//     .get(ACRUD.readOne(Day))
//     .patch(ACRUD.updateOne(Day))
//     .delete(ACRUD.deleteOne(Day))

// // prettier-ignore
// router.route('/')
//     .post(ACRUD.createOne(Day))
