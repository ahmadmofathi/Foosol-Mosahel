import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isHeaderShow=false;
  isPrimaryClick=false;
  isPrepClick=false;
  isSecClick=false;

  isMaterailShow=false;
  isHeaderMAterialShow=false;

  // isSubscriptionShow = false;
  // isSubHeaderShow = false;
  // isSbubButtonShow = false
  


  togglePrimary(){
    
  this.isHeaderShow=true;
  this.isPrimaryClick=true;
  this.isPrepClick=false;
  this.isSecClick=false;

  }

  toggleprep(){
    this.isHeaderShow=true;
    this.isPrimaryClick=false;
    this.isPrepClick=true;
    this.isSecClick=false
  }


  toggleSec(){
    this.isHeaderShow=true;
    this.isPrimaryClick=false;
    this.isPrepClick=false;
    this.isSecClick=true
  }


  toggleMatrial(){
    this.isMaterailShow=true;
    this.isHeaderMAterialShow=true;
  }

  // toggleSub(){
  //   this.isSubscriptionShow = true;
  //   this.isSubHeaderShow = true;
  //   this.isSbubButtonShow = true;
  // }


  


}
