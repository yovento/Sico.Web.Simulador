import { Component, OnInit } from "@angular/core";
import { SessionService } from "../../core/services/session.service";

@Component({
  selector: "app-forbiddenaccess",
  templateUrl: "./forbiddenaccess.component.html",
  styleUrls: ["./forbiddenaccess.component.css"],
})
export class ForbiddenaccessComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.clearCookies(null);
  }
}
