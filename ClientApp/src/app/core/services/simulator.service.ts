import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { FormatURLString } from "../functions/formatstring";
import { HttpService } from "./http.service";
import { constants } from "../common/constants";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class SimulatorService {
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpService: HttpService) {}

  getSimulatorParams(
    segmentId: Number,
    selectedBuildings: string
  ): Observable<any> {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      constants.ENDPOINTS.SIMULATOR.ENDPOINT_GETSIMULATORPARAMETERS,
      [segmentId, selectedBuildings]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }

  calculateSimulatorValues(
    calculationMethod: string,
    paymentPlans: string,
    simulatorName: string,
    favorInterestRate: number,
    defaultInterestRate: number,
    projectInstalmentsAmount: number,
    clientInstalmentsAmount: number,
    finalInstalment: number
  ) {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      calculationMethod == constants.ENUMS.FINANCIAL_CALCULATION_METHOD.NORMAL
        ? constants.ENDPOINTS.SIMULATOR.ENDPOINT_GETNONLINEALSIMULATORVALUES
        : constants.ENDPOINTS.SIMULATOR.ENDPOINT_GETLINEALSIMULATORVALUES,
      [
        simulatorName,
        favorInterestRate,
        defaultInterestRate,
        projectInstalmentsAmount,
        clientInstalmentsAmount,
        finalInstalment,
      ]
    );

    return this.httpService.postRequest(url, paymentPlans, this.httpHeaders);
  }

  saveSimulation(jsonSimulation: string) {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      constants.ENDPOINTS.SIMULATOR.ENDPOINT_SAVE_SIMULATION,
      []
    );

    return this.httpService.postRequest(url, jsonSimulation, this.httpHeaders);
  }
}
