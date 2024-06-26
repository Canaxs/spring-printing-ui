import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MultiStepComponent } from './components/multi-step/multi-step.component';
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {MessageBoxService} from "./service/message-box.service";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import { UploadComponent } from './pages/upload/upload.component';
import { UploadPanelComponent } from './components/upload-panel/upload-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MultiStepComponent,
    UploadComponent,
    UploadPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [HttpClientModule,MessageBoxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
