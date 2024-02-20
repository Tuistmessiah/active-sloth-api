import { Response } from 'express';
import { catchAsync, error } from './error-handling.utils';
import { SuccessResponse } from '../interfaces/api.interface';

export async function success<T>(res: Response, statusCode: number, data: T): Promise<SuccessResponse<T>> {
  const resObj: SuccessResponse<T> = {
    status: 'success',
    data,
  };
  await res.status(statusCode).json(resObj);
  return resObj;
}

export class ACRUD {
  static all = (Model) =>
    catchAsync(async (_req, res) => {
      const entries = await Model.find();

      res.status(200).json({ status: 'success', message: 'Get All Entries', data: { entries } });
    });

  /**
   *
   * @param fk (optional) tuple with name of reference id and the id (e.g: ['userId', '65ba0b238d9d94c80128a81c'])
   * @returns
   */
  static createOne = (Model, fk?: [string, string]) =>
    catchAsync(async (req, res, next) => {
      const newModel = req.body;
      if (fk) {
        const [refIdProp, refId] = fk;
        newModel[refIdProp] = refId;
      }
      const doc = await Model.create(newModel);

      res.status(201).json({ status: 'success', data: { data: doc } });
    });

  static readOne = (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) return error('No document found with that ID.', 404, next);

      res.status(200).json({ status: 'success', data: { data: doc } });
    });

  static updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) return error('No document found with that ID.', 404, next);

      res.status(200).json({ status: 'success', data: { data: doc } });
    });

  static deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) return error('No document found with that ID.', 404, next);

      res.status(204).json({ status: 'success', data: null });
    });
}
