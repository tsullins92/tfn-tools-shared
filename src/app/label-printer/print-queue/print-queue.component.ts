import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-print-queue',
  templateUrl: './print-queue.component.html',
  styleUrls: ['./print-queue.component.scss']
})
export class PrintQueueComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	this.close();
  }

  @Input() templates: string[];
  @Input() printQueue: any[];
  @Output() finalPrintQueue = new EventEmitter<any[]>();
  selectedTemplate: string;
  templateLineCount: number = 0;
  templateLineTexts: string[] = [];

  changeTemplate(){
    this.templateLineTexts=[];
  	if(this.selectedTemplate == "TFN RFID"){
      this.templateLineCount=6;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
    }
  	else if(this.selectedTemplate == "Media Prep Barcode"){
      this.templateLineCount=6;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
    }
  	else if(this.selectedTemplate == "Regulated Material"){
      this.templateLineCount=6;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
    }
    else if(this.selectedTemplate == "Potatoes"){
      this.templateLineCount=7;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
      this.templateLineTexts[4]="Construct:";
      this.templateLineTexts[5]="Experiment #:";
      this.templateLineTexts[6]="User:";
      this.templateLineTexts[7]="Experiment Date:";
    }
  	else if(this.selectedTemplate == "Light Cart - 1 Experiment"){
      this.templateLineCount=1;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
    }	
  	else if(this.selectedTemplate == "Light Cart - 2 Experiments"){
      this.templateLineCount=2;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
    }
  	else if(this.selectedTemplate == "Light Cart - 3 Experiments"){
      this.templateLineCount=3;
      for(var i=0;i<this.templateLineCount;++i){this.templateLineTexts.push('');}
    }
  	
  }

	addTemplate(){
		console.log(this.templateLineTexts,[...this.templateLineTexts]);
		this.printQueue.push(
			{
				template: this.selectedTemplate,
				lines: [...this.templateLineTexts]
			}
		)
	}

	printQueueSize(){
		if(this.printQueue.length){
			return this.printQueue.length;
		}
		else return 0
	}

	save(){
		this.finalPrintQueue.emit(this.printQueue);
		document.getElementById('printQueue').style.display='none';
	}

	close(){
		document.getElementById('printQueue').style.display='none';
	}

	trackByFn(index, item) {
  	return index;
  }

}
