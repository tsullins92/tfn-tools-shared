import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-barcode-checker',
  templateUrl: './barcode-checker.component.html',
  styleUrls: ['./barcode-checker.component.scss']
})
export class BarcodeCheckerComponent implements OnInit {

	scansMatchColor: string = "none";
	barcode: string = "";
	barcodes: any[] = [];
	statusString: string = "Nothing Entered";

  constructor() { }

  ngOnInit() {
  }

  enterBarcode(){
/*  	if(this.barcodes.length<1){
  		this.barcodes.push({value: this.barcode.toString(), repeat: false});
  		this.statusString = "Only one entry";
  	}else{
  		if(this.barcodes.findIndex((tempBarcode)=>{return tempBarcode.value == this.barcode.toString()})>-1){
  			this.barcodes.push({value: this.barcode.toString(), repeat: false});
  			this.statusString = "Entries Match";
  		}else{
  			this.barcodes.push({value: this.barcode.toString(), repeat: true});
  			this.statusString = "Non-matching entry detected!";
  		}
  	}*/
  	this.barcodes.push({value:this.barcode.toString(),repeat:true});
  	this.barcodes.forEach((tempBarcode)=>{if(tempBarcode.value!=this.barcodes[0].value.toString()){tempBarcode.repeat=false;}return;});
		if(this.barcodes.length==1){this.statusString = "Only one entry"}
		else if((this.barcodes.findIndex((tempBarcode)=>{return tempBarcode.repeat==false})>-1)){this.statusString = "Non-matching entry detected!"}
		else{this.statusString = "Entries Match";}
    this.barcode = "";
  }

  clearEntries(){
		this.scansMatchColor = "none";
		this.barcode = "";
		this.barcodes = [];
		this.statusString = "Nothing Entered";
		return;
  }
  	

}
