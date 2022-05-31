import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { Poi } from "../models/poi";

@Injectable({
  providedIn: "root",
})
export class PoiService {
  URL = "https://challenge-backend.mobi7.io/";

  constructor(private _httpClient: HttpClient) {}

  // Obtem todos as posições de veiculos
  getPois(): Observable<Poi[]> {
    return this._httpClient
      .get<Poi[]>(this.URL + "pois")
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtem todos as posições de veiculos
  getPoiByName(poiName: string | null): Observable<Poi> {
    const url = `${this.URL}/poi/${poiName}`;
    return this._httpClient
      .get<Poi>(url)
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
