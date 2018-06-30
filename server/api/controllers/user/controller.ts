import * as UserModel from 'model';
import { Request, Response } from 'express';


export class Controller {
  register(req: Request, res: Response): void {

  }

  authenticate(req: Request, res: Response): void {
      UserModel.authenticate(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  create(req: Request, res: Response): void {
    ExamplesService.create(req.body.name).then(r =>
      res
        .status(201)
        .location(`/api/v1/examples/${r.id}`)
        .json(r),
    );
  }
}
export default new Controller();
