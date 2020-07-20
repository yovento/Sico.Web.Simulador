import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { FormatURLString } from "../functions/formatstring";
import { HttpService } from "./http.service";

@Injectable({ providedIn: "root" })
export class BuildingService {
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpService: HttpService) {}

  getBuildingsGroupedTypes(idSegment: Number) {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      environment.constants.ENDPOINTS.BUILDINGS
        .ENDPOINT_GROUPEDAVAILABLEBUILDINGS,
      [idSegment]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }

  getBuildingsByType(
    idSegment: number,
    buildingType: number,
    buildingClasification: string
  ) {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      environment.constants.ENDPOINTS.BUILDINGS.ENDPOINT_GETBUILDINGSBYTYPE,
      [idSegment, buildingType, buildingClasification]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }
}
