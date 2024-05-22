import {Component, NgModule, OnInit} from '@angular/core';
import $ from 'jquery';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ImageResponse} from "../../models/ImageResponse";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.scss']
})
export class MultiStepComponent implements OnInit {

  printType: string = "receipt";
  printModel: boolean = false;
  imageResponses: ImageResponse[];
  printFeature: string = "";
  printFormOne = {
    writingAreaTitle:"",
    writingArea1: "",
    writingArea2: "",
    writingArea3: "",
    writingArea4: "",
    writingArea5: "",
    writingArea6: "",
    writingArea7: "",
    writingArea8: "",
    writingArea9: ""
  };

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


  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {
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
        console.log("1");
        if(this.printingFormArea[i].writingAreaTitle === this.printFeature) {
          this.printFormOne = this.printingFormArea[i];
          console.log("2");
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
    return this.http.get<any>("http://localhost:8080/printing/print/getImages/"+this.printType,httpHeaders);
  }
}
