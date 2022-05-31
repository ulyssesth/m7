import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { VehiclePosition } from "../models/vehicle-position";

@Injectable({
  providedIn: "root",
})
export class VehiclePositionService {
  URL = "https://challenge-backend.mobi7.io/posicao";

  constructor(private _httpClient: HttpClient) {}

  // Obtem todos as posições de veiculos
  getVehiclePositions(): Observable<VehiclePosition[]> {
    return this._httpClient
      .get<VehiclePosition[]>(this.URL)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtem todas as placas de veiculos
  getVehicleIdentification(): Observable<VehiclePosition[]> {
    return this._httpClient
      .get<VehiclePosition[]>(this.URL + "/placas")
      .pipe(retry(2), catchError(this.handleError));
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage =
        `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
