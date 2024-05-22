import {Component, NgModule, OnInit} from '@angular/core';
import $ from 'jquery';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ImageResponse} from "../../models/ImageResponse";
import {Observable} from "rxjs";
import {MessageBoxService} from "../../service/message-box.service";
import {environment} from "../../../environments/environment";
import {ReceiptRequest} from "../../models/ReceiptRequest";
import {NgModel} from "@angular/forms";

@Component({
  selector: 'app-multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.scss']
})
export class MultiStepComponent implements OnInit {

  printType: string = "receipt";
  printModel: boolean = false;
  templateName: string;

  imageResponses: ImageResponse[];
  printFeature: string = "";
  printFANum: number = 0;

  printingFormArea = [
    {
      writingAreaTitle: "KURUM TAHSILATI",
      writingArea1: "Abone No: ",
      writingArea2: "Fatura No: ",
      writingArea3: "Son Ödeme Tarihi: ",
      writingArea4: "Ad Soyad: ",
      writingArea5: "Komisyon: ",
      writingArea6: "BSMV: ",
      writingArea7: "Toplam Tutar: ",
      writingArea8:"",
      writingArea9:""
    },
    {
      writingAreaTitle: "IBAN'A TRANSFER",
      writingArea1: "Abone No: ",
      writingArea2: "Fatura No: ",
      writingArea3: "Son Ödeme Tarihi: ",
      writingArea4: "Ad Soyad: ",
      writingArea5: "Komisyon: ",
      writingArea6: "BSMV: ",
      writingArea7: "Toplam Tutar: ",
      writingArea8:"",
      writingArea9:""
    },
    {
      writingAreaTitle: "HESAPTAN HESABA HAVALE",
      writingArea1: "Alacaklı Şube: ",
      writingArea2: "Alacaklı Hesap: ",
      writingArea3: "Alacaklı IBAN: ",
      writingArea4: "Alacaklı Adı Soyadı: ",
      writingArea5: "Alacaklı Vergi No: ",
      writingArea6: "Komisyon: ",
      writingArea7: "Havale Tutarı: ",
      writingArea8:"",
      writingArea9:""
    },
    {
      writingAreaTitle: "HESAPTAN FAST",
      writingArea1: "Gönderen: ",
      writingArea2: "Alan Banka: ",
      writingArea3: "Alıcı Hesap: ",
      writingArea4: "İşlem Tutarı: ",
      writingArea5: "Komisyon: ",
      writingArea6: "Toplam Masraf: ",
      writingArea7: "Toplam Tutar: ",
      writingArea8:"",
      writingArea9:""
    },

  ]


  constructor(private http: HttpClient,private messageBox:  MessageBoxService) {
  }

  ngOnInit(): void {
  }

  onNext(index: number) {
     $(document).ready(function() {
      let index2 = index + 1;
      $("fieldset:eq("+index+")").hide(0);
      $("fieldset:eq("+index2+")").show(500);


    let element3: Element = document.getElementById("progressbar").getElementsByTagName("li").item(index+1);
    element3.classList.add("active");
    });
    if(index === 2) {
      for(let i = 0;i<this.printingFormArea.length;i++) {
        if(this.printingFormArea[i].writingAreaTitle === this.printFeature) {
          this.printFANum = i;
        }
      }
    }


  }
  onPrevious(index: number) {
    $(document).ready(function() {
      let index2 = index -1;
      $("fieldset:eq("+index+")").hide(0);
      $("fieldset:eq("+index2+")").show(500);

      let element3: Element = document.getElementById("progressbar").getElementsByTagName("li").item(index);
      element3.classList.remove("active");
    });
  }

  onSubmit(index: number) {
    this.onNext(index);
    let fixArea = this.printingFormArea[this.printFANum];
    console.log((document.getElementById("name") as HTMLInputElement).value);
    let receiptRequest = {
      title: fixArea.writingAreaTitle,
      name: (<HTMLInputElement> document.getElementById("name")).value,
      surname: (<HTMLInputElement> document.getElementById("surname")).value,
      addressCity: (<HTMLInputElement> document.getElementById("addressCity")).value,
      addressCounty: (<HTMLInputElement> document.getElementById("addressCounty")).value,
      addressStreet: (<HTMLInputElement> document.getElementById("addressStreet")).value,
      address: (<HTMLInputElement> document.getElementById("address")).value,
      ibanNumber: (<HTMLInputElement> document.getElementById("ibanNumber")).value,
      branchName: (<HTMLInputElement> document.getElementById("branchName")).value,
      accountNumber: (<HTMLInputElement> document.getElementById("accountNumber")).value,
      paymentTotal: (<HTMLInputElement> document.getElementById("paymentTotal")).value,
      templateName: this.templateName,
      writingAreaTitle: fixArea.writingAreaTitle,
      writingArea1: fixArea.writingArea1+""+(<HTMLInputElement> document.getElementById("writingArea1")).value,
      writingArea2: fixArea.writingArea2+""+(<HTMLInputElement> document.getElementById("writingArea2")).value,
      writingArea3: fixArea.writingArea3+""+(<HTMLInputElement> document.getElementById("writingArea3")).value,
      writingArea4: fixArea.writingArea4+""+(<HTMLInputElement> document.getElementById("writingArea4")).value,
      writingArea5: fixArea.writingArea5+""+(<HTMLInputElement> document.getElementById("writingArea5")).value,
      writingArea6: fixArea.writingArea6+""+(<HTMLInputElement> document.getElementById("writingArea6")).value,
      writingArea7: fixArea.writingArea7+""+(<HTMLInputElement> document.getElementById("writingArea7")).value,
      writingArea8: fixArea.writingArea8+""+(<HTMLInputElement> document.getElementById("writingArea8")).value,
      writingArea9: fixArea.writingArea9+""+(<HTMLInputElement> document.getElementById("writingArea9")).value,
    }
    let invoiceRequest = {

    }
    console.log(receiptRequest);

    let body = this.printType === 'receipt' ? receiptRequest : invoiceRequest;

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');
    let urlPrint = this.printType === 'receipt' ? 'print/getGuestReceiptPdf' : 'print/getGuestInvoicePdf';
    this.http.post(environment.baseUrl + urlPrint,body,
      {headers: headers,responseType: 'blob'}).subscribe((blob: Blob) => {
      const file = new Blob([blob], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank', 'width=1000, height=1000');
    });

  }
  fillReceipt() {
  }

  async onNextType(index: number) {
    this.onNext(index);
    this.getImages().subscribe((res: ImageResponse[]) => {
      this.imageResponses = res;
    },
      error => {},
      () => {
        this.printModel = true;
      });
  }
  onChangeType(value) {
    this.printType = value.target.value;
  }
  onChangeFeature(value) {
    this.printFeature = value.target.value;
  }

  getImages() : Observable<ImageResponse[]> {
    let httpHeaders = {
      headers: new HttpHeaders().set('Authorization','Basic cHJpbnQ6cHJpbnQ=')
    }
    return this.http.get<any>(environment.baseUrl+"print/getImages/"+this.printType,httpHeaders);
  }

  onClickSlider(templateName: string) {
    this.templateName = templateName;
    if(this.templateName != null) {
      this.messageBox.success("Template name: "+templateName+" SUCCESSFULLY SELECTED");
    }
    else {
      this.messageBox.error("Error");
    }
  }
}
