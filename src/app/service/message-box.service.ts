import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  messageTitle: string = "Spring-Printing";

  constructor(private toaStr: ToastrService) { }

  error(message: string){
    this.toaStr.error(message,this.messageTitle);
  }
  info(message: string){
    this.toaStr.info(message,this.messageTitle);
  }
  success(message: string){
    this.toaStr.success(message,this.messageTitle);
  }

}
