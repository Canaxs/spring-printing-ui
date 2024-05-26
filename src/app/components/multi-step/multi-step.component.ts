import {Component, NgModule, OnInit} from '@angular/core';
import $ from 'jquery';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ImageResponse} from "../../models/ImageResponse";
import {Observable} from "rxjs";
import {MessageBoxService} from "../../service/message-box.service";
import {environment} from "../../../environments/environment";
import {ReceiptRequest} from "../../models/ReceiptRequest";
import {NgModel} from "@angular/forms";
import printingFormData from "../../data/printingFormData";
import {Products} from "../../models/Products";

@Component({
  selector: 'app-multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.scss']
})
export class MultiStepComponent implements OnInit {

  printType: string = "receipt";
  printModel: boolean = false;
  templateName: string = null;
  productNumber: any[] = [];
  productsInterface: Products[] = [];
  completed: number = 0;

  imageResponses: ImageResponse[];
  printFeature: string = "";
  printFANum: number = 0;

  readonly printingFormData = printingFormData;


  constructor(private http: HttpClient,private messageBox:  MessageBoxService) {
  }

  ngOnInit(): void {
  }

  onNext(index: number) {
    console.log("İndex: "+index+" "+this.templateName);
    if(index === 1 && this.templateName === null) {
        this.messageBox.error("Please select an edition model");
    }
    else {
      $(document).ready(function () {
        let index2 = index + 1;
        $("fieldset:eq(" + index + ")").hide(0);
        $("fieldset:eq(" + index2 + ")").show(500);
        let element3: Element = document.getElementById("progressbar").getElementsByTagName("li").item(index + 1);
        element3.classList.add("active");
      });

      if (index === 2) {
        for (let i = 0; i < printingFormData.length; i++) {
          if (printingFormData[i].title === this.printFeature) {
            this.printFANum = i;
          }
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

  onSubmit() {
    let receiptRequest, invoiceRequest;
    this.completed = 1;
    if(this.printType === 'invoice') {
      this.onSelectAddProducts();
      invoiceRequest = {
        templateName: this.templateName,
        dealerAddressCity: this.getElementValue("dealerAddressCity"),
        dealerAddressCounty: this.getElementValue("dealerAddressCounty"),
        dealerAddress: this.getElementValue("dealerAddress"),
        dealerPhoneNumber: this.getElementValue("dealerPhoneNumber"),
        dealerMailAddress: this.getElementValue("dealerMailAddress"),
        dealerVKN: this.getElementValue("dealerVKN"),
        dealerTradeNumber: this.getElementValue("dealerTradeNumber"),
        customerName: this.getElementValue("customerName"),
        customerSurname: this.getElementValue("customerSurname"),
        customerAddressCity: this.getElementValue("customerAddressCity"),
        customerAddressCounty: this.getElementValue("customerAddressCounty"),
        customerAddress: this.getElementValue("customerAddress"),
        customerPhoneNumber: this.getElementValue("customerPhoneNumber"),
        customerMailAddress: this.getElementValue("customerMailAddress"),
        customerTCKN: this.getElementValue("customerTCKN"),
        products: this.productsInterface,
      }
      console.log(invoiceRequest);
    }
    else {
      let fixArea = printingFormData[this.printFANum];
      receiptRequest = {
        title: fixArea.title,
        name: this.getElementValue("name"),
        surname: this.getElementValue("surname"),
        addressCity: this.getElementValue("addressCity"),
        addressCounty: this.getElementValue("addressCounty"),
        addressStreet: this.getElementValue("addressStreet"),
        address: this.getElementValue("address"),
        ibanNumber: parseFloat(this.getElementValueNumber("ibanNumber")),
        branchName: this.getElementValue("branchName"),
        accountNumber: parseFloat(this.getElementValueNumber("accountNumber")),
        paymentTotal: parseFloat(this.getElementValueNumber("paymentTotal")),
        templateName: this.templateName,
        writingAreaTitle: this.getElementValue("writingAreaTitle"),
        writingArea1: fixArea.writingArea1+""+this.getElementValue("writingArea1"),
        writingArea2: fixArea.writingArea2+""+this.getElementValue("writingArea2"),
        writingArea3: fixArea.writingArea3+""+this.getElementValue("writingArea3"),
        writingArea4: fixArea.writingArea4+""+this.getElementValue("writingArea4"),
        writingArea5: fixArea.writingArea5+""+this.getElementValue("writingArea5"),
        writingArea6: fixArea.writingArea6+""+this.getElementValue("writingArea6"),
        writingArea7: fixArea.writingArea7+""+this.getElementValue("writingArea7"),
        writingArea8: fixArea.writingArea8+""+this.getElementValue("writingArea8"),
        writingArea9: fixArea.writingArea9+""+this.getElementValue("writingArea9"),
      }
    }

    let body = this.printType === 'receipt' ? receiptRequest : invoiceRequest;

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    headers = headers.set('Authorization','Basic cHJpbnQ6cHJpbnQ=');
    let urlPrint = this.printType === 'receipt' ? 'print/getGuestReceiptPdf' : 'print/getGuestInvoicePdf';
    this.http.post(environment.baseUrl + urlPrint,body,
      {headers: headers,responseType: 'blob'}).subscribe((blob: Blob) => {
      this.completed = 2;
      const file = new Blob([blob], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank', 'width=1000, height=1000');
    },
      error => {
        this.completed = 3;
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
      this.messageBox.success("Basım Modeli: "+templateName+" Başarıyla Seçildi");
    }
    else {
      this.messageBox.error("Basım Modeli Seçilirken Hata Oluştu. Tekrar Deneyiniz");
    }
  }

  getElementValue(element: string) {
    return (<HTMLInputElement>document.getElementById(element)).value;
  }
  getElementValueNumber(element: string) {
    return (<HTMLInputElement> document.getElementById(element)).value != "" ? (<HTMLInputElement> document.getElementById(element)).value : "0";
  }

  onChangeSelect(event) {
    this.productNumber = Array(parseInt(event.target.value)).fill(0);
  }
  onSelectAddProducts() {
    console.log("productlength: "+this.productNumber.length);
    for(let i = 0;i<this.productNumber.length;i++) {
      let productRequest: Products = {
        name: this.getElementValue("productTableName"+i),
        unitPrice: parseFloat(this.getElementValue("productTablePrice"+i)),
        amount: parseInt(this.getElementValue("productTableAmount"+i))
      };
      console.log("productsInterface: "+this.productsInterface);
      this.productsInterface.push(productRequest);
    }
  }

}
