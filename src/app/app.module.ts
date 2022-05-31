import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AgmCoreModule } from "@agm/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PoisListComponent } from "./pois-list/pois-list.component";
import { AngularMaterialModule } from "./shared/angular-material/angular-material.module";
import { DetailsPoisComponent } from "./details-pois/details-pois.component";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [AppComponent, PoisListComponent, DetailsPoisComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: environment.agmKey,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
