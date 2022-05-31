import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";

import { VehiclePosition } from "../models/vehicle-position";
import { VehiclePositionService } from "../services/vehicle-position.service";
import { Poi } from "../models/poi";

import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-details-pois",
  templateUrl: "./details-pois.component.html",
  styleUrls: ["./details-pois.component.css"],
})
export class DetailsPoisComponent implements OnInit {
  vehicleIdentifications = new Observable<VehiclePosition[]>();
  vehiclePositions = new Observable<VehiclePosition[]>();

  displayedColumns: string[] = [
    "id",
    "placa",
    "data",
    "velocidade",
    "latitude",
    "longitude",
    "ignicao",
  ];

  dataSource = new MatTableDataSource<VehiclePosition>();
  plateFilter = new FormControl();
  dateFilter = new FormControl();
  filteredValues = {
    // id: '',
    placa: "",
    data: "",
    // velocidade: '',
    // latitude: '',
    // longitude: '',
    // ignicao: ''
  };

  public hoursInPoi: any;

  dateOptionsToFilter: Array<string> = [];

  public poi: Poi | undefined;
  public vehiclesInPoi: VehiclePosition[] = [];
  public vehicleLicensePlates: VehiclePosition[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _vehiclePositionService: VehiclePositionService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((response: any) => {
      this.poi = response.poi;
    });

    // Traz as placas de veiculos e adiciona no select.
    this.vehicleIdentifications =
      this._vehiclePositionService.getVehicleIdentification();
    this.vehicleIdentifications.subscribe((vehicles) => {
      vehicles.forEach((e) => {
        this.vehicleLicensePlates.push(e);
      });
    });

    // Traz os veiculos e detalhes de posição.
    this.vehiclePositions = this._vehiclePositionService.getVehiclePositions();

    this.vehiclePositions.subscribe((vehicles) => {
      // filtra os veiculos que estão dentro de poi.
      this.vehiclesInPoi = vehicles.filter((vehicle) => {
        let distancePoiToVehicle = this.getDistancePoiToVehicle(
          this.poi?.latitude,
          this.poi?.longitude,
          vehicle.latitude,
          vehicle.longitude
        );

        return this.poi!.raio >= distancePoiToVehicle;
      });
      this.dataSource.data = this.vehiclesInPoi;
      this.getDateOptions(this.vehiclesInPoi);

      this.hoursInPoi = this.getTotalHhMmSs(this.dataSource.data);
    });

    // Filter for license plate.
    this.plateFilter.valueChanges.subscribe((plateFilterValue) => {
      this.filteredValues["placa"] = plateFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    // Filter for Date.
    this.dateFilter.valueChanges.subscribe((dateFilterValue) => {
      this.filteredValues["data"] = dateFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    const myFilterPredicate = (
      data: VehiclePosition,
      filter: string
    ): boolean => {
      let searchString = JSON.parse(filter);
      return (
        data.placa.toString().trim().indexOf(searchString.placa) !== -1 &&
        data.data
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.data.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  getDistancePoiToVehicle(lat1: any, lon1: any, lat2: any, lon2: any) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = this.km2meters(R * c); // Distance in meters
    return d;
  }

  deg2rad(deg: any) {
    return deg * (Math.PI / 180);
  }

  km2meters(kmValue: number) {
    return kmValue * 1000;
  }

  /**
   * Get date options.
   * @param vehiclesArr
   */
  getDateOptions(vehiclesArr: VehiclePosition[]) {
    this.dateOptionsToFilter = [
      ...new Set(
        vehiclesArr.map((vehicle) => {
          let dateOption = new Date(vehicle.data);
          let dateFormatted =
            dateOption.getFullYear() +
            "-" +
            (dateOption.getMonth() + 1) +
            "-" +
            dateOption.getDate();
          return dateFormatted;
        })
      ),
    ];
  }

  /**
   *
   * @param vehiclesArr
   * @returns
   */
  getTotalHhMmSs(vehiclesArr: VehiclePosition[]) {
    let licensePlates = [...new Set(vehiclesArr.map((plate) => plate.placa))];

    let lastDate: number | null;
    let totalSec = 0;
    let auxSec = 0;

    licensePlates.forEach((plate) => {
      let datesArray: string[] = [];
      vehiclesArr.forEach((vehicleDetails) => {
        if (vehicleDetails.placa === plate) {
          datesArray.push(vehicleDetails.data);
        }
      });

      datesArray.forEach((date) => {
        let firstDate = new Date(date).getTime();
        let segundos;
        if (lastDate != null) {
          let sum = firstDate - lastDate;

          segundos = sum / 1000;
          totalSec = totalSec + segundos;
        }
        lastDate = firstDate;
      });
      auxSec = auxSec + totalSec;

      totalSec = 0;
      lastDate = null;
    });
    totalSec = auxSec;

    let totalMin = totalSec / 60;
    totalSec = totalSec % 60;

    let totalHours = totalMin / 60;
    totalMin = totalMin % 60;

    let totalTime =
      Math.floor(totalHours).toString() +
      "h" +
      Math.floor(totalMin).toString() +
      "m" +
      Math.floor(totalSec).toString() +
      "s";

    return totalTime;
  }
}
