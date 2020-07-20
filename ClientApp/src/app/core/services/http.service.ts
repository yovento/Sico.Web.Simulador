import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class HttpService {
  constructor(private http: HttpClient) {}

  getRequest(url: string, headers: HttpHeaders) {
    return this.http.get<any>(url, { headers: headers });
  }

  postRequest(url: string, body: string, headers: HttpHeaders) {
    return this.http.post<any>(url, body, { headers: headers });
  }
}
