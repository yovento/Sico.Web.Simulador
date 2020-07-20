import { Injectable } from "@angular/core";
declare var bootbox: any;

@Injectable({ providedIn: "root" })
export class Messages {
  public showModalMessage(message: string, size: string) {
    message = '<p class="text-center mb-0">' + message + "</p>";
    bootbox.alert({
      message: message,
      size: size,
    });
  }
}
