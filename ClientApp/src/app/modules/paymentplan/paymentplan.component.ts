import { Component, OnInit, Input } from "@angular/core";
import { SelectedBuilding } from "../main/selectedBuilding";
import { ISimulator } from "../../core/models/ISimulator";

@Component({
  selector: "app-paymentplan",
  templateUrl: "./paymentplan.component.html",
  styleUrls: ["./paymentplan.component.css"],
})
export class PaymentplanComponent implements OnInit {
  @Input() selectedBuilding: ISimulator;
  constructor() {}

  ngOnInit() {}
  public clientMonthlyEstimatedInitialFeePayment() {
    return (
      (this.selectedBuilding.initialValue() -
        this.selectedBuilding.separationFeeProposedValue) /
      this.selectedBuilding.monthsUntilProposedSimulationEnd
    );
  }
}
