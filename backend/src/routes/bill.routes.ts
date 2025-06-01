import { Router } from "express";

import { validateQueryAndTransformRequest } from "@middlewares/validation.middleware";
import { getMonthlyBillSchema } from "@validations/bill.yup";
import billController from "@controllers/bill.controller";

const billRouter = Router();

billRouter.get(
  "/",
  validateQueryAndTransformRequest(getMonthlyBillSchema),
  billController.getMonthlyMessBill
);

export default billRouter;
