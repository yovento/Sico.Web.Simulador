import { Component, OnInit, ViewChild } from "@angular/core";
import { SessionService } from "../../core/services/session.service";
import { ISimulator } from "../../core/models/ISimulator";
import { SelectedBuilding } from "./selectedBuilding";
import { ProposaldetailsComponent } from "../proposaldetails/proposaldetails.component";
import { StepChanger } from "./stepChanger";
import { ProjectselectionComponent } from "../projectselection/projectselection.component";
declare function initializeNavigation(): void;
declare function reinitializeSimulator(): void;
declare function activateStep(step: number): any;

@Component({
  selector: "app-home",
  templateUrl: "./main.component.html",
})
export class MainComponent implements OnInit {
  selectedBuilding: ISimulator = new SelectedBuilding();
  showRestart: boolean = false;

  constructor(private sessionService: SessionService) {}

  @ViewChild(ProjectselectionComponent, { static: true })
  projectselectionComponent: ProjectselectionComponent;

  @ViewChild(ProposaldetailsComponent, { static: true })
  proposaldetailsComponent: ProposaldetailsComponent;

  ngOnInit() {
    initializeNavigation();
    this.startSimulation();
  }

  selectedBuildingChanged(selectedBuilding: SelectedBuilding) {
    this.selectedBuilding = selectedBuilding;
  }

  simulationSent(simularionResult) {
    this.showRestart = true;
  }

  startSimulation() {
    this.sessionService.clearCookies(null);

    this.selectedBuilding = new SelectedBuilding();
    this.projectselectionComponent.initializeComponent();
    this.proposaldetailsComponent.initializeComponent();

    this.showRestart = false;
    activateStep(1);
    reinitializeSimulator();
  }

  changeStep(stepChanger: StepChanger) {
    if (
      stepChanger.nextStep == 2 &&
      stepChanger.currentStep < stepChanger.nextStep
    ) {
      this.proposaldetailsComponent.selectedBuildingExternalChange();
    }
    activateStep(stepChanger.nextStep);
  }
}
