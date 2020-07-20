import { Component, OnInit, Input } from "@angular/core";
import { ISimulator } from "../../core/models/ISimulator";
import { SelectedBuilding } from "../main/selectedBuilding";

@Component({
  selector: "app-costs",
  templateUrl: "./costs.component.html",
  styleUrls: ["./costs.component.css"],
})
export class CostsComponent implements OnInit {
  @Input() selectedBuilding: ISimulator;

  constructor() {}

  ngOnInit() {}
}
