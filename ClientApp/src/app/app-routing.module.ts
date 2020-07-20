import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./modules/main/main.component";
import { ForbiddenaccessComponent } from "./modules/forbiddenaccess/forbiddenaccess.component";

const routes: Routes = [
  { path: "simulator/:companyid/:sourcename", component: MainComponent },
  {
    path: "simulator/:companyid/:projectid/:sourcename",
    component: MainComponent,
  },
  { path: "forbidden", component: ForbiddenaccessComponent },
  { path: "**", pathMatch: "full", redirectTo: "forbidden" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
