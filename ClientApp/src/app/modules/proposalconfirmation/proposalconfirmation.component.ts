import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TitleCasePipe, DatePipe } from "@angular/common";
import { LeadsService } from "../../core/services/leads.service";
import { Lead } from "./Lead";
import { SessionService } from "../../core/services/session.service";
import { constants } from "../../core/common/constants";
import { SelectedBuilding } from "../main/selectedBuilding";
import { NgForm, FormControl } from "@angular/forms";
import * as $ from "jquery";
import "bootstrap-notify";
import { SimulatorService } from "../../core/services/simulator.service";
import { StepChanger } from "../main/stepChanger";
import { GenericsService } from "../../core/services/generics.service";
import { htmlFormats } from "../../core/common/htmlFormats";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CustomValidator } from "../../core/common/validators";
import { Messages } from "../../core/common/messages";

declare function showProgressBar(): any;
declare function hideProgressBar(): any;

@Component({
  selector: "app-proposalconfirmation",
  templateUrl: "./proposalconfirmation.component.html",
  styleUrls: ["./proposalconfirmation.component.css"],
})
export class ProposalconfirmationComponent implements OnInit {
  formName: FormGroup;

  @Input() selectedBuilding: SelectedBuilding;
  @Output()
  public nextStep: EventEmitter<StepChanger> = new EventEmitter();

  @Output()
  public simulationSent: EventEmitter<boolean> = new EventEmitter();

  objLead: Lead = new Lead();
  name: string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  leadId: number = 0;
  simulationId: number = 0;

  constructor(
    private messages: Messages,
    private leadsService: LeadsService,
    private simulatorService: SimulatorService,
    private genericsService: GenericsService,
    private sessionService: SessionService,
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formName = new FormGroup({
      name: new FormControl(),
      lastname: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      termsAccepted: new FormControl(),
    });
    this.formName = this.fb.group({
      name: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, CustomValidator.phoneValidator]],
      termsAccepted: ["", [Validators.required, Validators.requiredTrue]],
    });
  }

  public proposalConfirmed(form: NgForm) {
    event.preventDefault();

    if (form.valid) {
      this.objLead.intIdObra = this.selectedBuilding.projectId;
      this.objLead.origin = constants.DEFAULT.DEFAULT_LEAD_ORIGIN;
      this.objLead.medio = this.sessionService.getCookie(
        constants.SESSION.SOURCE_NAME
      );
      this.objLead.strToken = this.selectedBuilding.projectToken;

      this.objLead.name = this.titleCasePipe.transform(form.value.name);
      this.objLead.lastname = this.titleCasePipe.transform(form.value.lastname);
      this.objLead.email = form.value.email;
      this.objLead.phone = form.value.phone;

      showProgressBar();
      this.getPaymentPlan();
    } else {
      this.messages.showModalMessage(
        constants.ENUMS.MESSAGES.SIMULATION_INPUT_DATA_VALIDATION,
        constants.ENUMS.MODAL_MESSAGES_SIZE.MEDIUM
      );
    }
  }

  private getPaymentPlan() {
    this.genericsService
      .getGenericList(
        constants.DEFAULT.GENERIC_LISTS.SEGMENT_PAYMENT_PLANS,
        false,
        String(this.selectedBuilding.segmentId)
      )
      .subscribe(
        (paymentPlansResult: any) => {
          let paymentPlans = JSON.parse(paymentPlansResult);
          for (let index = 0; index < paymentPlans.length; index++) {
            let row = paymentPlans[index];
            if (
              Number(row.strAux) ==
                this.selectedBuilding.initialFeePercentage &&
              Number(row.strAux2) ==
                this.selectedBuilding.financingFeePercentage
            ) {
              this.selectedBuilding.paymentPlanId = row.intId;
              this.saveLead();
              return;
            }
          }

          this.errorHandler("Plan de pago no configurado");
        },
        (error: string) => {
          this.errorHandler(error);
        }
      );
  }

  private saveLead() {
    if (this.leadId > 0) {
      this.saveSimulation();
    } else {
      this.leadsService.saveLead(JSON.stringify(this.objLead)).subscribe(
        (leadResult: any) => {
          this.leadId = leadResult.intIdVisitaXObra;
          this.saveSimulation();
        },
        (error: string) => {
          this.errorHandler(error);
        }
      );
    }
  }

  private saveSimulation() {
    let jsonSimulation = this.prepareSimulationForSave();

    this.simulatorService.saveSimulation(jsonSimulation).subscribe(
      (simulationResult: any) => {
        this.simulationId = simulationResult.intIdCotizacion;
        this.sendSimulationEmail();
        this.emitSimulationSent();
        hideProgressBar();

        this.messages.showModalMessage(
          constants.ENUMS.MESSAGES.SIMULATION_SENT(this.objLead.email),
          constants.ENUMS.MODAL_MESSAGES_SIZE.MEDIUM
        );
      },
      (error: string) => {
        this.errorHandler(error);
      }
    );
  }

  private sendSimulationEmail() {
    let jsonSimulation = this.prepareSimulationToSend();

    this.genericsService.sendEmail(jsonSimulation).subscribe(
      (simulationSendResult: any) => {},
      (error: string) => {
        this.errorHandler(error);
      }
    );
  }

  private prepareSimulationForSave(): string {
    let maximumInterestRate =
      this.selectedBuilding.defaultInterestRate >
      this.selectedBuilding.favorInterestRate
        ? this.selectedBuilding.defaultInterestRate
        : this.selectedBuilding.favorInterestRate;
    let minimumInterestRate =
      this.selectedBuilding.defaultInterestRate >
      this.selectedBuilding.favorInterestRate
        ? this.selectedBuilding.favorInterestRate
        : this.selectedBuilding.defaultInterestRate;
    let objCotizacion = {
      intIdCotizacion: 0,
      intIdEtapa: this.selectedBuilding.segmentId,
      intIdObra: this.selectedBuilding.projectId,
      strNombreCliente: this.objLead.name + " " + this.objLead.lastname,
      strTelefonoFijo: this.objLead.phone,
      strTelefonoMovil: this.objLead.phone,
      intIdPlanPago: this.selectedBuilding.paymentPlanId,
      datFechaPrimerPago: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ),
      numTasa:
        this.selectedBuilding.simulationInterestValue >= 0
          ? maximumInterestRate
          : minimumInterestRate,
      intPlazo: this.selectedBuilding.monthsUntilSimulationEnd,
      numCuotaInicial: this.selectedBuilding.initialValue(),
      numSeparacion: this.selectedBuilding.separationFeeValue,
      numFinanciacion: this.selectedBuilding.financingValue(),
      numCuotaInicialCliente: this.selectedBuilding.initialProposedValue,
      numSeparacionCliente: this.selectedBuilding.separationFeeProposedValue,
      numFinanciacionCliente: this.selectedBuilding.financingProposedValue,
      intIdVisita: this.leadId,
      intAplicarDescuentoA:
        constants.DEFAULT.DEFAULT_APPLY_SIMULATOR_DISCOUNTS_TO,
      intIdPlantillaCotizacion: constants.DEFAULT.DEFAULT_SELECT_VALUE,
      strUsuario: constants.DEFAULT.DEFAULT_LEAD_ORIGIN,
      xmlInmuebles: this.generateBuildingsXML(),
      xmlFPagoProyecto: this.generateProjectPaymentPlanXML(),
      xmlFPagoCliente: this.generateClientPaymentPlanXML(),
      numDescuentoComercial: 0,
      numInteresesManual: 0,
      numInteresesCalculados: this.selectedBuilding.simulationInterestValue,
      strDescripcionAcabado: "",
      numValorAcabado: 0,
      bitEsArriendo: false,
      intIdMedioPublicitario: -1,
      intDiaPago: 30,
      bitCotizacionFormatoExcel: true,

      strCorreoElectronico: this.objLead.email,
      strObservaciones: "",

      strCondicionesMejoras: "",
      strCondicionesRenovacion: "",

      datFechaEntregaArriendo: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ),

      strPorcentajeSobreVentas: "0",
      strCondicionesIncremento: "",
      intPlazoContrato: 0,

      numCanonMinimoMensual: 0,
      numCuotaAdministracion: 0,
    };

    var lstCondiciones = [];

    let jsonCotizacion = {
      objCotizacion: objCotizacion,
      objCondicionesArriendo: JSON.stringify(lstCondiciones),
      bitOpcionar: false,
      datFechaInicialOpcion: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ),
      datFechaFinalOpcion: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ),
    };

    return JSON.stringify(jsonCotizacion);
  }

  private prepareSimulationToSend(): string {
    //[CLIENTNAME]
    let htmlEmail = htmlFormats.SIMULATOR_EMAIL_FORMAT.replace(
      "[CLIENTNAME]",
      this.objLead.fullName()
    )
      .replace("[COMPANYLOGO]", this.selectedBuilding.companyLogo)
      .replace("[COMPANYNAME]", this.selectedBuilding.companyName);

    let objCorreo = {
      intIdObra: this.selectedBuilding.projectId,
      strAsunto:
        "Cotización - " +
        this.titleCasePipe.transform(this.selectedBuilding.projectName),
      strDestinatarios: this.objLead.email,
      strAdjuntosExternos: "",
      strAdjuntos: this.simulationId + ",0,",
      strAdjuntosInternos:
        this.simulationId +
        ",0, Cotización -" +
        this.titleCasePipe.transform(this.selectedBuilding.projectName) +
        ",Presentación: " +
        this.titleCasePipe.transform(this.selectedBuilding.projectName),
      strHTMLEnvio: htmlEmail,
      strCuerpoMensaje: "",
      strCuerpoMensajePlano:
        "Cotización - " +
        this.titleCasePipe.transform(this.selectedBuilding.projectName),
      strNombreDestinatario: this.titleCasePipe.transform(
        this.objLead.fullName()
      ),
      strUsuario: constants.DEFAULT.DEFAULT_LEAD_ORIGIN,
      strModuloEnvioCorreo: constants.DEFAULT.DEFAULT_PROSPECT_MODULE_NAME,
      intIdRegistroRelacionado: this.leadId,
    };

    return JSON.stringify(objCorreo);
  }

  private generateBuildingsXML(): string {
    let buildingsXML = "";
    buildingsXML = "<InmueblesGeneral>";

    buildingsXML = buildingsXML + "<Inmuebles>";
    buildingsXML =
      buildingsXML +
      "<intIdInmueble>" +
      this.selectedBuilding.buildingId +
      "</intIdInmueble>";
    buildingsXML =
      buildingsXML +
      "<numValorInmueble>" +
      this.selectedBuilding.buildingValue +
      "</numValorInmueble>";
    buildingsXML = buildingsXML + "</Inmuebles>";

    if (this.selectedBuilding.parkingId > 0) {
      buildingsXML = buildingsXML + "<Inmuebles>";
      buildingsXML =
        buildingsXML +
        "<intIdInmueble>" +
        this.selectedBuilding.parkingId +
        "</intIdInmueble>";
      buildingsXML =
        buildingsXML +
        "<numValorInmueble>" +
        this.selectedBuilding.parkingValue +
        "</numValorInmueble>";
      buildingsXML = buildingsXML + "</Inmuebles>";
    }

    if (this.selectedBuilding.storageId > 0) {
      buildingsXML = buildingsXML + "<Inmuebles>";
      buildingsXML =
        buildingsXML +
        "<intIdInmueble>" +
        this.selectedBuilding.storageId +
        "</intIdInmueble>";
      buildingsXML =
        buildingsXML +
        "<numValorInmueble>" +
        this.selectedBuilding.storageValue +
        "</numValorInmueble>";
      buildingsXML = buildingsXML + "</Inmuebles>";
    }

    if (this.selectedBuilding.otherId > 0) {
      buildingsXML = buildingsXML + "<Inmuebles>";
      buildingsXML =
        buildingsXML +
        "<intIdInmueble>" +
        this.selectedBuilding.otherId +
        "</intIdInmueble>";
      buildingsXML =
        buildingsXML +
        "<numValorInmueble>" +
        this.selectedBuilding.otherValue +
        "</numValorInmueble>";
      buildingsXML = buildingsXML + "</Inmuebles>";
    }

    buildingsXML = buildingsXML + "</InmueblesGeneral>";

    return buildingsXML;
  }

  private generateProjectPaymentPlanXML(): string {
    let projectPaymentPlanXML = "";
    projectPaymentPlanXML = "<FormaPagoProyectoGeneral>";

    this.selectedBuilding.projectPaymentPlan.forEach((row) => {
      projectPaymentPlanXML = projectPaymentPlanXML + "<FormaPagoProyecto>";
      projectPaymentPlanXML =
        projectPaymentPlanXML + "<intCuota>" + row.intCuota + "</intCuota>";
      projectPaymentPlanXML =
        projectPaymentPlanXML +
        "<txtdatFechaPago>" +
        this.datePipe.transform(row.dtmFechaPago, "yyyyMMdd") +
        "</txtdatFechaPago>";
      projectPaymentPlanXML =
        projectPaymentPlanXML +
        "<txtValorCuota>" +
        row.numValor +
        "</txtValorCuota>";
      projectPaymentPlanXML = projectPaymentPlanXML + "</FormaPagoProyecto>";
    });

    projectPaymentPlanXML =
      projectPaymentPlanXML + "</FormaPagoProyectoGeneral>";

    return projectPaymentPlanXML;
  }

  private generateClientPaymentPlanXML(): string {
    let clientPaymentPlanXML = "";
    clientPaymentPlanXML = "<FormaPagoClienteGeneral>";

    this.selectedBuilding.clientPaymentPlan.forEach((row) => {
      clientPaymentPlanXML = clientPaymentPlanXML + "<FormaPagoCliente>";
      clientPaymentPlanXML =
        clientPaymentPlanXML + "<intCuota>" + row.intCuota + "</intCuota>";
      clientPaymentPlanXML =
        clientPaymentPlanXML +
        "<dtmFechaPago>" +
        this.datePipe.transform(row.dtmFechaPago, "yyyyMMdd") +
        "</dtmFechaPago>";
      clientPaymentPlanXML =
        clientPaymentPlanXML + "<numValor>" + row.numValor + "</numValor>";
      clientPaymentPlanXML =
        clientPaymentPlanXML +
        "<numRestante>" +
        row.numRestante +
        "</numRestante>";
      clientPaymentPlanXML = clientPaymentPlanXML + "</FormaPagoCliente>";
    });

    clientPaymentPlanXML = clientPaymentPlanXML + "</FormaPagoClienteGeneral>";

    return clientPaymentPlanXML;
  }

  private emitSimulationSent() {
    this.simulationSent.emit(true);
  }

  errorHandler(error: string) {
    this.messages.showModalMessage(
      constants.ENUMS.MESSAGES.SIMULATION_ERROR,
      constants.ENUMS.MODAL_MESSAGES_SIZE.MEDIUM
    );
    hideProgressBar();
  }

  public activateStep(step) {
    event.preventDefault();
    const currentStep: number = 3;

    let stepChanger: StepChanger = { currentStep: currentStep, nextStep: step };
    this.nextStep.emit(stepChanger);
  }
}
