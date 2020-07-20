import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

//Services
import { CompanyService } from "../../core/services/company.service";
import { SegmentService } from "../../core/services/segment.service";
import { BuildingService } from "../../core/services/building.service";
import { SessionService } from "../../core/services/session.service";

//Interfaces
import { ISimulator } from "../../core/models/ISimulator";

//Common
import { constants } from "../../core/common/constants";
import { SelectedBuilding } from "../main/selectedBuilding";
import { MonthDiff } from "../../core/functions/formatstring";
import { StepChanger } from "../main/stepChanger";
import { Messages } from "../../core/common/messages";

//Functions
declare function showProgressBar(): any;
declare function hideProgressBar(): any;

@Component({
  selector: "app-projectselection",
  templateUrl: "./projectselection.component.html",
  styleUrls: ["./projectselection.component.css"],
})
export class ProjectselectionComponent implements OnInit {
  public projects: any[] = [];
  public segments: any[] = [];
  public principalBuildings: any[] = [];
  public parkingBuildings: any[] = [];
  public storageBuildings: any[] = [];
  public otherBuildings: any[] = [];
  public buildingTypes: any[] = [];

  public DEFAULT_SELECT_VALUE: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;

  public companyId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public projectId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public disableProjectSelection: boolean = false;
  public segmentId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public buildingClasification: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public principalBuildingId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public parkingBuildingId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public storageBuildingId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public otherBuildingId: string = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  public visProject: number = 0;

  @Input() public selectedBuilding: ISimulator;

  @Output()
  public selectedBuildingChanged: EventEmitter<ISimulator> = new EventEmitter();

  @Output()
  public nextStep: EventEmitter<StepChanger> = new EventEmitter();

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private companyService: CompanyService,
    private segmentService: SegmentService,
    private buildingService: BuildingService,
    private messages: Messages,
    private router: Router
  ) {}

  ngOnInit() {}

  public initializeComponent() {
    this.projects = [];
    this.segments = [];
    this.principalBuildings = [];
    this.parkingBuildings = [];
    this.storageBuildings = [];
    this.otherBuildings = [];
    this.buildingTypes = [];
    this.DEFAULT_SELECT_VALUE = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.projectId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.segmentId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.buildingClasification = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.principalBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.parkingBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.storageBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.otherBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.visProject = 0;
    this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.companyId = params[constants.PARAMS.COMPANY_ID];
        let sourceName = params[constants.PARAMS.SOURCE_NAME];

        if (params[constants.PARAMS.PROJECT_ID] != null) {
          this.projectId = params[constants.PARAMS.PROJECT_ID];
          this.disableProjectSelection = true;
        }

        this.sessionService.setCookie(
          constants.SESSION.COMPANY_ID,
          this.companyId
        );
        this.sessionService.setCookie(
          constants.SESSION.SOURCE_NAME,
          sourceName
        );

        this.getCompanyProjects();
      },
      (error) => {
        this.errorHandler(error);
      }
    );
  }

  getCompanyProjects() {
    showProgressBar();
    let companyId: Number = Number(
      this.sessionService.getCookie(constants.SESSION.COMPANY_ID)
    );

    this.companyService.getCompanyProjects(companyId).subscribe(
      (projects: any) => {
        this.projects = projects.Records;

        if (this.projects.length == 0) {
          this.router.navigate(["forbidden"]);
        }

        this.sessionService.setCookie(
          constants.SESSION.PROYECT_LIST,
          this.projects
        );
        this.updateSelectedBuilding();
        hideProgressBar();
      },
      (error) => {
        this.errorHandler(error);
      }
    );
  }

  public projectChanged() {
    this.getProjectSegments();
    this.updateSelectedBuilding();

    this.buildingClasification = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.segmentId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.principalBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.parkingBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.storageBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.otherBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
  }

  getProjectSegments() {
    this.segmentService.getProjectSegments(Number(this.projectId)).subscribe(
      (segments: any) => {
        this.segments = segments;

        if (this.projects.length == 0) {
          this.router.navigate(["forbidden"]);
        }

        this.sessionService.setCookie(
          constants.SESSION.SEGMENT_LIST,
          this.segments
        );
      },
      (error) => {
        this.errorHandler(error);
      }
    );
  }

  public segmentChanged() {
    let segment = this.segments.filter(
      (p) => p.intIdObraInmueble == this.segmentId
    )[0];

    this.getBuildingsGroupedTypes();
    this.getBuildingsByType(
      constants.DEFAULT.PARKING_BUILDING_TYPE_ID,
      constants.DEFAULT.DEFAULT_SELECT_VALUE
    );

    this.getBuildingsByType(
      constants.DEFAULT.STORAGE_BUILDING_TYPE_ID,
      constants.DEFAULT.DEFAULT_SELECT_VALUE
    );

    this.getBuildingsByType(
      constants.DEFAULT.OTHER_BUILDING_TYPE_ID,
      constants.DEFAULT.DEFAULT_SELECT_VALUE
    );

    this.updateSelectedBuilding();
  }

  getBuildingsGroupedTypes() {
    this.buildingService
      .getBuildingsGroupedTypes(Number(this.segmentId))
      .subscribe(
        (buildingTypes: any[]) => {
          this.buildingTypes = buildingTypes;
        },
        (error) => {
          this.errorHandler(error);
        }
      );
  }

  getBuildingsByType(buildingTypeId: number, buildingClasification: string) {
    this.buildingService
      .getBuildingsByType(
        Number(this.segmentId),
        buildingTypeId,
        buildingClasification
      )
      .subscribe(
        (buildings: any[]) => {
          for (var i = 0; i < buildings.length; i++) {
            buildings[i].selected = false;
          }

          switch (buildingTypeId) {
            case constants.DEFAULT.PRINCIPAL_BUILDING_TYPE_ID:
              this.principalBuildings = buildings;
              break;
            case constants.DEFAULT.PARKING_BUILDING_TYPE_ID:
              this.parkingBuildings = buildings;
              break;
            case constants.DEFAULT.STORAGE_BUILDING_TYPE_ID:
              this.storageBuildings = buildings;
              break;
            case constants.DEFAULT.OTHER_BUILDING_TYPE_ID:
              this.otherBuildings = buildings;
              break;
            default:
              break;
          }
        },
        (error) => {
          this.errorHandler(error);
        }
      );
  }

  public buildingSelected(selectedBuildingId: number) {
    this.principalBuildingId = String(selectedBuildingId);

    for (var i = 0; i < this.principalBuildings.length; i++) {
      this.principalBuildings[i].selected =
        this.principalBuildings[i].intIdInmueble == this.principalBuildingId
          ? true
          : false;
    }

    this.updateSelectedBuilding();
  }

  public updateSelectedBuilding() {
    let totalValue: number = 0;
    this.selectedBuilding = new SelectedBuilding();

    if (this.companyId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      this.selectedBuilding.companyLogo = this.projects[0].strURLLogoEmpresa;
      this.selectedBuilding.companyName = this.projects[0].strRazonSocial;
    }

    if (this.projectId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      let selectedProject = this.projects.filter(
        (p) => p.intIdObra == this.projectId
      )[0];

      this.selectedBuilding.projectId = selectedProject.intIdObra;
      this.selectedBuilding.projectName = selectedProject.strDescripcion;
      this.selectedBuilding.projectLogo = selectedProject.strUrlImagen;
      this.selectedBuilding.projectToken = selectedProject.strTokenMercadeo;
      this.selectedBuilding.financialCalculationMethod = selectedProject.bitCotizacionFormatoExcelLineal
        ? constants.ENUMS.FINANCIAL_CALCULATION_METHOD.LINEAL
        : constants.ENUMS.FINANCIAL_CALCULATION_METHOD.NORMAL;
    }

    if (this.segmentId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      let selectedSegment = this.segments.filter(
        (p) => p.intIdObraInmueble == this.segmentId
      )[0];

      this.visProject = selectedSegment.bitEsProyectoVIS;
      this.selectedBuilding.monthsUntilSimulationEnd = MonthDiff(
        new Date(),
        new Date(selectedSegment.datFechaFinVentas.substring(0, 10))
      );
      this.selectedBuilding.monthsUntilProposedSimulationEnd = this.selectedBuilding.monthsUntilSimulationEnd;
      this.selectedBuilding.favorInterestRate = selectedSegment.numTasaFavor;
      this.selectedBuilding.defaultInterestRate = selectedSegment.numTasaContra;
    }

    if (this.principalBuildingId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      let selectedPrincipalBuilding = this.principalBuildings.filter(
        (p) => p.intIdInmueble == this.principalBuildingId
      )[0];

      this.selectedBuilding.buildingId =
        selectedPrincipalBuilding.intIdInmueble;
      this.selectedBuilding.buildingName =
        selectedPrincipalBuilding.strDescripcionInmueble;
      this.selectedBuilding.segmentId =
        selectedPrincipalBuilding.intIdObraInmueble;
      this.selectedBuilding.segmentName = selectedPrincipalBuilding.strEtapa;
      this.selectedBuilding.buildingArea =
        selectedPrincipalBuilding.numAreaConstruida;
      this.selectedBuilding.buildingValue =
        selectedPrincipalBuilding.numValorInmueble;
      this.selectedBuilding.separationFeeValue =
        selectedPrincipalBuilding.numSeparacion;
      this.selectedBuilding.initialFeePercentage =
        selectedPrincipalBuilding.numCuotaInicial;
      this.selectedBuilding.financingFeePercentage =
        selectedPrincipalBuilding.numFinanciacion;
      totalValue += selectedPrincipalBuilding.numValorInmueble;
    }

    if (this.parkingBuildingId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      let selectedParkingBuilding = this.parkingBuildings.filter(
        (p) => p.intIdInmueble == this.parkingBuildingId
      )[0];

      this.selectedBuilding.parkingId = selectedParkingBuilding.intIdInmueble;
      this.selectedBuilding.parkingName =
        selectedParkingBuilding.strDescripcionInmueble;
      this.selectedBuilding.parkingValue =
        selectedParkingBuilding.numValorInmueble;

      totalValue += selectedParkingBuilding.numValorInmueble;
    }

    if (this.storageBuildingId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      let selectedStorageBuilding = this.storageBuildings.filter(
        (p) => p.intIdInmueble == this.storageBuildingId
      )[0];

      this.selectedBuilding.storageId = selectedStorageBuilding.intIdInmueble;
      this.selectedBuilding.storageName =
        selectedStorageBuilding.strDescripcionInmueble;
      this.selectedBuilding.storageValue =
        selectedStorageBuilding.numValorInmueble;

      totalValue += selectedStorageBuilding.numValorInmueble;
    }

    if (this.otherBuildingId != constants.DEFAULT.DEFAULT_SELECT_VALUE) {
      let selectedOtherBuilding = this.otherBuildings.filter(
        (p) => p.intIdInmueble == this.otherBuildingId
      )[0];

      this.selectedBuilding.otherId = selectedOtherBuilding.intIdInmueble;
      this.selectedBuilding.otherName =
        selectedOtherBuilding.strDescripcionInmueble;
      this.selectedBuilding.otherValue = selectedOtherBuilding.numValorInmueble;

      totalValue += selectedOtherBuilding.numValorInmueble;
    }

    this.selectedBuilding.separationFeeProposedValue = this.selectedBuilding.separationFeeValue;
    this.selectedBuilding.originalTotalValue = totalValue;
    this.selectedBuilding.totalValue = totalValue;
    this.selectedBuilding.initialProposedValue = this.selectedBuilding.initialValue();
    this.selectedBuilding.financingProposedValue = this.selectedBuilding.financingValue();

    this.selectedBuildingChanged.emit(this.selectedBuilding);
  }

  public buildingTypeChanged() {
    this.principalBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.parkingBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.storageBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;
    this.otherBuildingId = constants.DEFAULT.DEFAULT_SELECT_VALUE;

    this.getBuildingsByType(
      constants.DEFAULT.PRINCIPAL_BUILDING_TYPE_ID,
      this.buildingClasification
    );
  }

  errorHandler(error) {
    console.log(error);
    hideProgressBar();
  }

  public activateStep(step) {
    event.preventDefault();
    const currentStep: number = 1;

    if (step > currentStep) {
      if (this.selectedBuilding.buildingId == null) {
        this.messages.showModalMessage(
          constants.ENUMS.MESSAGES.SIMULATION_BUILDING_SELECTION_REQUIRED,
          constants.ENUMS.MODAL_MESSAGES_SIZE.MEDIUM
        );
        return;
      }
    }

    let stepChanger: StepChanger = { currentStep: currentStep, nextStep: step };
    this.nextStep.emit(stepChanger);
  }
}
