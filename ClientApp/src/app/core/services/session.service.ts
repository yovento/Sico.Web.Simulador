import { Injectable, NgZone } from "@angular/core";
import { constants } from "../common/constants";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: "root" })
export class SessionService {
  constructor(private cookies: CookieService) {}

  getCookie(key: string) {
    return this.cookies.get(key);
  }

  setCookie(key, value) {
    this.cookies.set(key, value);
  }

  clearCookies(key: string) {
    if (key !== null && key !== "") this.cookies.delete(key);
    else this.cookies.deleteAll();
  }
}
