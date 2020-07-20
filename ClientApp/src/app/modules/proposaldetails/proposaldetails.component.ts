import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import * as $ from "jquery";
import "bootstrap-notify";
import { ISimulator } from "../../core/models/ISimulator";
import { Options } from "ng5-slider";
import { constants } from "../../core/common/constants";
import { PaymentPlan } from "./PaymentPlan";
import { IPaymentPlan } from "../../core/models/IPaymentPlan";
import { SimulatorService } from "../../core/services/simulator.service";
import { ProjectService } from "../../core/services/project.service";
import { GenerateGuid } from "../../core/functions/formatstring";
import { StepChanger } from "../main/stepChanger";

import {
  RemoveCurrencyFormat,
  MonthDiff,
} from "../../core/functions/formatstring";

declare function activateStep(step: number): any;

@Component({
  selector: "app-proposaldetails",
  templateUrl: "./proposaldetails.component.html",
  styleUrls: ["./proposaldetails.component.css"],
})
export class ProposaldetailsComponent implements OnInit {
  @Input() selectedBuilding: ISimulator;
  @Output()
  public selectedBuildingChanged: EventEmitter<ISimulator> = new EventEmitter();

  @Output()
  public nextStep: EventEmitter<StepChanger> = new EventEmitter();

  public financeRate: number = 1;
  public financeYears: number = 10;
  public simulationInProgress: boolean = false;
  public monthsUntilSimulationEnd: number = 1;
  private paymentPlans: {
    strFPagoProyecto: IPaymentPlan[];
    strFPagoCliente: IPaymentPlan[];
  };
  private projectPaymentPlan: IPaymentPlan[] = [];
  private clientPaymentPlan: IPaymentPlan[] = [];
  public sliderOptionsMonths: Options = {
    floor: 1,
    ceil: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
    ariaLabel: "value",
    getSelectionBarColor: (value: number): string => {
      return "#45b549";
    },
  };
  public sliderOptionsYears: Options = {
    floor: 1,
    ceil: 20,
    showSelectionBar: true,
    hideLimitLabels: true,
    ariaLabel: "value",
    getSelectionBarColor: (value: number): string => {
      return "#45b549";
    },
  };

  constructor(
    private simulatorService: SimulatorService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.initializeComponent();
  }

  public initializeComponent() {
    this.financeRate = 1;
    this.financeYears = 10;
    this.simulationInProgress = false;
    this.monthsUntilSimulationEnd = 1;

    this.paymentPlans = {
      strFPagoProyecto: [],
      strFPagoCliente: [],
    };
    this.projectPaymentPlan = [];
    this.clientPaymentPlan = [];

    this.sliderOptionsMonths = {
      floor: 1,
      ceil: 1,
      showSelectionBar: true,
      hideLimitLabels: true,
      ariaLabel: "value",
      getSelectionBarColor: (value: number): string => {
        return "#45b549";
      },
    };

    this.sliderOptionsYears = {
      floor: 1,
      ceil: 20,
      showSelectionBar: true,
      hideLimitLabels: true,
      ariaLabel: "value",
      getSelectionBarColor: (value: number): string => {
        return "#45b549";
      },
    };
  }

  public selectedBuildingExternalChange() {
    this.setMonthlySliderOptions();
    this.projectService
      .getMarketingConfiguration(this.selectedBuilding.projectId)
      .subscribe((marketingConfiguration) => {
        this.selectedBuilding.projectPrivacyLink =
          marketingConfiguration.strRutaCondicionesPrivacidad !== ""
            ? marketingConfiguration.strRutaCondicionesPrivacidad
            : "";
      }),
      (error) => {
        this.errorHandler(error);
      };
  }

  private setMonthlySliderOptions() {
    this.monthsUntilSimulationEnd = this.selectedBuilding.monthsUntilProposedSimulationEnd;

    this.sliderOptionsMonths = {
      floor: 1,
      ceil: this.selectedBuilding.monthsUntilSimulationEnd,
      showSelectionBar: true,
      hideLimitLabels: true,
      ariaLabel: "value",
      getSelectionBarColor: (value: number): string => {
        return "#45b549";
      },
    };
  }

  private projectMonthlyEstimatedInitialFeePayment() {
    return (
      (this.selectedBuilding.initialValue() -
        this.selectedBuilding.separationFeeValue) /
      this.selectedBuilding.monthsUntilSimulationEnd
    );
  }

  public clientMonthlyEstimatedInitialFeePayment() {
    return (
      (this.selectedBuilding.initialValue() -
        this.selectedBuilding.separationFeeProposedValue) /
      this.monthsUntilSimulationEnd
    );
  }

  public monthlyEstimatedFinancePayment(): number {
    if (this.selectedBuilding == undefined) {
      return 0;
    }
    return (
      this.selectedBuilding.financingValue() *
      (((1 + this.financeRate / 100) ** this.financeMonths() *
        (this.financeRate / 100)) /
        ((1 + this.financeRate / 100) ** this.financeMonths() - 1))
    );
  }

  private financeMonths(): number {
    return this.financeYears * 12;
  }

  public familiarIncome(): number {
    return this.monthlyEstimatedFinancePayment() / 0.4;
  }

  public separationChanged(event) {
    this.selectedBuilding.separationFeeProposedValue = RemoveCurrencyFormat(
      event.target.value
    );
  }

  public calculateSimulatorValues() {
    this.simulationInProgress = true;
    this.createPaymentPlans();

    this.simulatorService
      .calculateSimulatorValues(
        this.selectedBuilding.financialCalculationMethod,
        JSON.stringify(this.paymentPlans),
        GenerateGuid(),
        this.selectedBuilding.favorInterestRate,
        this.selectedBuilding.defaultInterestRate,
        this.selectedBuilding.monthsUntilSimulationEnd,
        this.monthsUntilSimulationEnd,
        this.selectedBuilding.monthsUntilSimulationEnd + 1
      )
      .subscribe(
        (simulatorResult: any) => {
          this.selectedBuilding.financingProposedValue =
            simulatorResult.numFinanciacion;

          this.selectedBuilding.simulationInterestValue =
            simulatorResult.numFinancieros;

          this.resolveFinanceSimulationDifferences();

          this.selectedBuilding.monthsUntilProposedSimulationEnd = this.monthsUntilSimulationEnd;

          this.selectedBuilding.totalValue =
            this.selectedBuilding.separationFeeProposedValue +
            this.selectedBuilding.financingProposedValue +
            this.selectedBuilding.monthsUntilProposedSimulationEnd *
              this.clientMonthlyEstimatedInitialFeePayment();

          this.selectedBuilding.financingProposedRate = this.financeRate;
          this.selectedBuilding.financingProposedYears = this.financeYears;
          setTimeout(() => {
            $("#cuotas-container").slideToggle();
            $("#financiacion-container").slideToggle();
            $("#propuestacuotainicial-block").slideToggle();
            $("#propuestafinanciacion-block").slideToggle();
            $("#btn-ajustar").show();
            $("#btn-verpropuesta").hide();

            this.simulationInProgress = false;
          }, 1500);

          this.emitPaymentPlanChanges();
        },
        (error) => {
          this.errorHandler(error);
        }
      );
  }

  private resolveFinanceSimulationDifferences() {
    let difference: number =
      this.selectedBuilding.financingValue() +
      this.selectedBuilding.initialValue() -
      (this.selectedBuilding.financingProposedValue +
        this.selectedBuilding.initialProposedValue);

    if (Math.abs(difference) <= constants.DEFAULT.SIMULATOR_RESULT_TOLERANCE) {
      if (difference > 0) {
        this.selectedBuilding.financingProposedValue -= difference;
      } else {
        this.selectedBuilding.financingProposedValue += difference;
      }
    }
  }

  private createPaymentPlans() {
    this.projectPaymentPlan = this.buildPaymentPlan(
      this.selectedBuilding.separationFeeValue,
      this.selectedBuilding.monthsUntilSimulationEnd,
      this.projectMonthlyEstimatedInitialFeePayment()
    );
    this.clientPaymentPlan = this.buildPaymentPlan(
      this.selectedBuilding.separationFeeProposedValue,
      this.monthsUntilSimulationEnd,
      this.clientMonthlyEstimatedInitialFeePayment()
    );

    this.paymentPlans = {
      strFPagoProyecto: this.projectPaymentPlan,
      strFPagoCliente: this.clientPaymentPlan,
    };
  }

  private buildPaymentPlan(
    separationFee: number,
    monthsToFinishSimulation: number,
    estimatedInitialFeePayment: number
  ): IPaymentPlan[] {
    let paymentPlan: IPaymentPlan[] = [];

    for (
      let index = 0;
      index <= this.selectedBuilding.monthsUntilSimulationEnd;
      index++
    ) {
      let projectPaymentPlan: PaymentPlan = {
        intCuota: index,
        dtmFechaPago: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1 + index,
          0
        ),
        numValor:
          index == 0
            ? separationFee
            : index > monthsToFinishSimulation
            ? 0
            : estimatedInitialFeePayment,
        numRestante: 0,
      };

      paymentPlan.push(projectPaymentPlan);
    }

    let index = this.selectedBuilding.monthsUntilSimulationEnd + 1;
    let projectPaymentPlan: PaymentPlan = {
      intCuota: index,
      dtmFechaPago: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1 + index,
        0
      ),
      numValor: this.selectedBuilding.financingValue(),
      numRestante: 0,
    };

    paymentPlan.push(projectPaymentPlan);

    return paymentPlan;
  }

  separationValueIsValid(): boolean {
    return this.selectedBuilding.separationFeeProposedValue == undefined
      ? false
      : this.selectedBuilding.separationFeeProposedValue <=
          this.selectedBuilding.initialValue() &&
          this.selectedBuilding.separationFeeProposedValue >=
            this.selectedBuilding.separationFeeValue;
  }

  private emitPaymentPlanChanges() {
    this.selectedBuildingChanged.emit(this.selectedBuilding);
  }

  private errorHandler(error) {
    console.log(error);
  }

  public activateStep(step) {
    event.preventDefault();
    const currentStep: number = 2;

    if (step > currentStep) {
      this.createPaymentPlans();
      this.selectedBuilding.projectPaymentPlan = this.paymentPlans.strFPagoProyecto;
      this.selectedBuilding.clientPaymentPlan = this.paymentPlans.strFPagoCliente;
      this.emitPaymentPlanChanges();
    }

    let stepChanger: StepChanger = { currentStep: currentStep, nextStep: step };
    this.nextStep.emit(stepChanger);
  }
}
