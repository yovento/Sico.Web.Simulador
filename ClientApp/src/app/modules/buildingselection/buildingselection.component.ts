import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-buildingselection",
  templateUrl: "./buildingselection.component.html",
  styleUrls: ["./buildingselection.component.css"],
})
export class BuildingselectionComponent implements OnInit {
  @Input() building: any;
  @Output() buildingChanged: EventEmitter<number> = new EventEmitter();

  public selected: boolean = false;

  constructor() {}

  ngOnInit() {}

  public buildingSelected(selectedId) {
    this.buildingChanged.emit(selectedId);
  }
}
