import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.scss']
})
export class MultiStepComponent implements OnInit {



  constructor() {
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
}
