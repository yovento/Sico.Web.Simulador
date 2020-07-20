import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { FormatURLString } from "../functions/formatstring";
import { HttpService } from "./http.service";
import { constants } from "../common/constants";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class GenericsService {
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpService: HttpService) {}

  getGenericList(
    listName: string,
    includeSelectOption: boolean = false,
    param1: string = "",
    param2: string = "",
    param3: string = "",
    param4: string = "",
    includeAllOption: boolean = false
  ): Observable<any> {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      constants.ENDPOINTS.GENERICS.ENDPOINT_QUERY_GENERIC_LIST,
      [
        listName,
        includeSelectOption,
        param1,
        param2,
        param3,
        param4,
        includeAllOption,
      ]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }

  sendEmail(emailObject: string): Observable<any> {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      constants.ENDPOINTS.GENERICS.ENDPOINT_SEND_SIMULATOR_EMAIL,
      []
    );

    return this.httpService.postRequest(url, emailObject, this.httpHeaders);
  }

  validateEmailExistance(email: string): Observable<any> {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      constants.ENDPOINTS.GENERICS.ENDPOINT_VALIDATE_EMAIL_EXISTANCE,
      [email]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }
}
