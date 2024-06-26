import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {UploadComponent} from "./pages/upload/upload.component";

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
