import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { FormatURLString } from "../functions/formatstring";
import { HttpService } from "./http.service";

@Injectable({ providedIn: "root" })
export class CompanyService {
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpService: HttpService) {}

  getCompanyProjects(idCompany: Number) {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      environment.constants.ENDPOINTS.COMPANY.ENDPOINT_COMPANYPROJECTS,
      [idCompany]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }
}
