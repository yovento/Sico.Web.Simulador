import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { FormatURLString } from "../functions/formatstring";
import { HttpService } from "./http.service";
import { constants } from "../common/constants";

@Injectable({ providedIn: "root" })
export class LeadsService {
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpService: HttpService) {}

  saveLead(objLead: string) {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      constants.ENDPOINTS.LEADS.ENDPOINT_SAVELEAD,
      []
    );

    return this.httpService.postRequest(url, objLead, this.httpHeaders);
  }
}
