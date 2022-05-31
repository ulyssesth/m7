import { NgModule, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";

import { PoisListComponent } from "./pois-list/pois-list.component";
import { DetailsPoisComponent } from "./details-pois/details-pois.component";
import { Poi } from "./models/poi";
import { PoiService } from "./services/poi.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PoiResolver implements Resolve<Poi> {
  constructor(private _service: PoiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Poi> | Promise<Poi> | Poi {
    return this._service.getPoiByName(route.paramMap.get("poi_name"));
  }
}

const routes: Routes = [
  { path: "pois-list", component: PoisListComponent },
  {
    path: "details-pois/:poi_name",
    component: DetailsPoisComponent,
    resolve: {
      poi: PoiResolver,
    },
  },
  { path: "", redirectTo: "/pois-list", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
