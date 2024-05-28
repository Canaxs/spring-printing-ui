import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MessageBoxService} from "../../service/message-box.service";
import {ReceiptRequest} from "../../models/ReceiptRequest";
import {TemplateInfo} from "../../models/templateInfo";
import {TemplateTable} from "../../models/TemplateTable";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss']
})
export class UploadPanelComponent implements OnInit {
  htmlFile: any;
  cssFile: any;
  complete: boolean = true;
  templateInfo: TemplateInfo;
  templateTable: any[] = [];
  updateTemplate = {
    id: "",
    isActive: "",
    templateName: "",
    effectiveStartDate: "",
    effectiveEndDate: ""
  };

  constructor(private http: HttpClient,private messageBox:  MessageBoxService) {
  }

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
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');
    this.http.get<TemplateInfo>(environment.baseUrl+"template", {headers: headers}).subscribe( (res) => {
      this.templateInfo = res;
    })
    this.getTemplateAll();
  }

  onClickfileHtml() {
    document.getElementById("htmlFileID").click();
  }
  onClickfileCss() {
    document.getElementById("cssFileId").click();
  }

  onSubmit() {
    this.complete = false;
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
      this.complete = true;
    },() => {
      this.messageBox.error("Bilgiler kayıt edilirken sorun oluştu");
      this.complete = true;
      setTimeout(() => {
        location.reload();
      },500)
    }, () => {
      setTimeout(() => {
        location.reload();
      },500)
    });
  }

  getElementValue(element: string) {
    return (<HTMLInputElement>document.getElementById(element)).value;
  }

  templateAllRate(element: number) {
    return Math.trunc((element/this.templateInfo.allTemplateNumber) * 100);
  }

  async getTemplateAll() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');
    this.http.get<TemplateTable>(environment.baseUrl+"template/all",{headers:headers}).subscribe((res) => {
      this.templateTable.push(res)
    },() => {

    },() => {
      console.log(this.templateTable);
    });
  }
  onDelete() {
    let deleteId = (<HTMLInputElement> document.getElementById("templateId")).value;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');
    this.http.delete(environment.baseUrl+"template/"+deleteId,{headers:headers,responseType: 'text'}).subscribe((res) => {
      this.messageBox.success("Silinmiştir: "+res);
    },() => {
      this.messageBox.error("Template silinirken hata ile karşılaşıldı.Tekrar deneyiniz");
    },() => {
      setTimeout(() => {
        location.reload();
      },500)
    })
  }

  onUpdateInput(template) {
    this.updateTemplate = {
      id: template.id,
      isActive: template.isActive,
      templateName: template.templateName,
      effectiveStartDate: template.effectiveStartDate,
      effectiveEndDate: template.effectiveEndDate
    }
    console.log(this.updateTemplate);
  }
  onUpdateSubmit() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');
    this.http.post(environment.baseUrl+"template/update",this.updateTemplate,{headers: headers,responseType: "json"})
      .subscribe((res) => {
      },() => {
        this.messageBox.success("Şablon güncellenirken hata oluştu");
      }, () => {
        this.messageBox.success("Başarıyla Güncellendi");
      })
  }
}
