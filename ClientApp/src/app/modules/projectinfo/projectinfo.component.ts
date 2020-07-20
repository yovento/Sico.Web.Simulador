import { Component, OnInit, Input } from "@angular/core";
import { ISimulator } from "../../core/models/ISimulator";

@Component({
  selector: "app-projectinfo",
  templateUrl: "./projectinfo.component.html",
  styleUrls: ["./projectinfo.component.css"],
})
export class ProjectinfoComponent implements OnInit {
  @Input() selectedBuilding: ISimulator;

  constructor() {}

  ngOnInit() {}
}
