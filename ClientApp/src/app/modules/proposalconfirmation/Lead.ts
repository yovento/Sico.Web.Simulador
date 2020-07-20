import { ILead } from "../../core/models/ILead";
import { constants } from "../../core/common/constants";

export class Lead implements ILead {
  name: string;
  lastname: string;
  email: string;
  origin: string;
  medio: string;
  phone: string;
  message: string = constants.DEFAULT.DEFAULT_LEAD_MESSAGE;
  city: string;
  strToken: string;
  intIdObra: number;
  idEmpresa: number;
  fullName = () => {
    return this.name + " " + this.lastname;
  };
}
