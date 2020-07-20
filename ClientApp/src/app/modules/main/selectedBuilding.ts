import { ISimulator } from "../../core/models/ISimulator";
import { constants } from "../../core/common/constants";
import { IPaymentPlan } from "../../core/models/IPaymentPlan";
export class SelectedBuilding implements ISimulator {
  public projectPaymentPlan: IPaymentPlan[];
  public clientPaymentPlan: IPaymentPlan[];
  public paymentPlanId: string;
  public projectId: number;
  public projectName: string;
  public projectToken: string;
  public financialCalculationMethod: string =
    constants.ENUMS.FINANCIAL_CALCULATION_METHOD.NORMAL;
  public segmentId: number;
  public segmentName: string;
  public monthsUntilSimulationEnd: number = 0;
  public monthsUntilProposedSimulationEnd: number = 0;
  public buildingId: number;
  public buildingName: string;
  public buildingArea: number;
  public buildingValue: number = 0;
  public parkingId: number;
  public parkingName: string;
  public parkingValue: number = 0;
  public storageId: number;
  public storageName: string;
  public storageValue: number = 0;
  public otherId: number;
  public otherName: string;
  public otherValue: number = 0;
  public companyLogo: string;
  public companyName: string;
  public projectLogo: string;
  public projectPrivacyLink: string = "";
  public financingMonths: number = 0;
  public favorInterestRate: number = 0;
  public defaultInterestRate: number = 0;
  public separationFeeValue: number = 0;
  public separationFeeProposedValue: number = 0;
  public initialFeePercentage: number = 0;
  public financingFeePercentage: number = 0;
  public initialValue = (): number => {
    return this.originalTotalValue * (this.initialFeePercentage / 100);
  };
  public initialProposedValue: number = 0;
  public financingValue = (): number => {
    return this.originalTotalValue * (this.financingFeePercentage / 100);
  };
  public financingProposedValue: number = 0;
  public financingProposedRate: number = 1;
  public financingProposedYears: number = 10;
  public simulationInterestValue: number = 0;
  public originalTotalValue: number = 0;
  public totalValue: number = 0;
}
