import { IPaymentPlan } from "../../core/models/IPaymentPlan";
export class PaymentPlan implements IPaymentPlan {
  intCuota: number;
  dtmFechaPago: Date;
  numValor: number;
  numRestante: number;
}
