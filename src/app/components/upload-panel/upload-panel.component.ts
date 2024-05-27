import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MessageBoxService} from "../../service/message-box.service";

@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss']
})
export class UploadPanelComponent implements OnInit {
  htmlFile: any;
  cssFile: any;

  constructor(private http: HttpClient,private messageBox:  MessageBoxService) { }

  ngOnInit(): void {
    document.getElementById("htmlFileID").addEventListener("change", (e) => {
      let fileName = (<HTMLInputElement> e.target).files[0].name;
      this.htmlFile = (<HTMLInputElement> e.target).files[0];
      document.querySelector("#html_dropbox").innerHTML ="<div><p>"+fileName+"<i class='bi bi-check' style='color: green;font-size: 18px'></i></p></div>";
    })
    document.getElementById("cssFileId").addEventListener("change", (e) => {
      let fileName = (<HTMLInputElement> e.target).files[0].name;
      this.cssFile = (<HTMLInputElement> e.target).files[0];
      document.querySelector("#css_dropbox").innerHTML ="<div><p>"+fileName+"<i class='bi bi-check' style='color: green;font-size: 18px'></i></p></div>";
    })
  }

  onClickfileHtml() {
    document.getElementById("htmlFileID").click();
  }
  onClickfileCss() {
    document.getElementById("cssFileId").click();
  }

  onSubmit() {
    let formData = new FormData();
    formData.set("html",this.htmlFile,this.htmlFile.name);
    formData.set("fileType",this.getElementValue("fileType"));
    formData.set("css",this.cssFile,this.cssFile.name);
    formData.set("templateName",this.getElementValue("templateName"));
    formData.set("startDate",this.getElementValue("startDate"));
    formData.set("endDate",this.getElementValue("endDate"));

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');

    this.http.post(environment.baseUrl+"upload",formData,{headers: headers,responseType: 'text'}).subscribe((res) => {
      this.messageBox.success(res.toString());
    },() => {
      this.messageBox.error("Bilgiler kayıt edilirken sorun oluştu");
    }, () => {
    });
  }

  getElementValue(element: string) {
    return (<HTMLInputElement>document.getElementById(element)).value;
  }

}
