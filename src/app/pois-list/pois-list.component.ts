import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";

import { Observable } from "rxjs";

import { Poi } from "../models/poi";

import { PoiService } from "../services/poi.service";

@Component({
  selector: "app-pois-list",
  templateUrl: "./pois-list.component.html",
  styleUrls: ["./pois-list.component.css"],
})
export class PoisListComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion();

  pois = new Observable<Poi[]>();

  constructor(private _poiService: PoiService) {}

  ngOnInit(): void {
    this.pois = this._poiService.getPois();
  }
}
