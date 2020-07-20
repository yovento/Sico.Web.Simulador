//Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { TitleCasePipe, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Ng5SliderModule } from "ng5-slider";
import { NgxCleaveDirectiveModule } from "ngx-cleave-directive";

// Routes
import { AppRoutingModule } from "./app-routing.module";

//Services
import { CookieService } from "ngx-cookie-service";

//Components
import { AppComponent } from "./app.component";
import { MainComponent } from "./modules/main/main.component";
import { ProjectselectionComponent } from "./modules/projectselection/projectselection.component";
import { ProposaldetailsComponent } from "./modules/proposaldetails/proposaldetails.component";
import { ProposalconfirmationComponent } from "./modules/proposalconfirmation/proposalconfirmation.component";
import { ProjectinfoComponent } from "./modules/projectinfo/projectinfo.component";
import { CostsComponent } from "./modules/costs/costs.component";
import { PaymentplanComponent } from "./modules/paymentplan/paymentplan.component";
import { ForbiddenaccessComponent } from "./modules/forbiddenaccess/forbiddenaccess.component";
import { BuildingselectionComponent } from "./modules/buildingselection/buildingselection.component";
import { HttpErrorInterceptor } from "./core/services/http-error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ProjectselectionComponent,
    ProposaldetailsComponent,
    ProposalconfirmationComponent,
    ProjectinfoComponent,
    CostsComponent,
    PaymentplanComponent,
    ForbiddenaccessComponent,
    BuildingselectionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    Ng5SliderModule,
    NgxCleaveDirectiveModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    CookieService,
    TitleCasePipe,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
