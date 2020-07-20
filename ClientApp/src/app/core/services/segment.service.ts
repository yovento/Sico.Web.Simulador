import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { FormatURLString } from "../functions/formatstring";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class SegmentService {
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpService: HttpService) {}

  getProjectSegments(idProject: Number): Observable<any> {
    let url = FormatURLString(
      environment.urlSicoCRMVb,
      environment.constants.ENDPOINTS.SEGMENTS.ENDPOINT_PROJECTSEGMENTS,
      [idProject]
    );

    return this.httpService.getRequest(url, this.httpHeaders);
  }
}
