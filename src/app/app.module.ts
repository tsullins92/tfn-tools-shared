import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms'; // <-- NgModule lives here
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BarcodeCheckerComponent } from './barcode-checker/barcode-checker.component';
import { LabelPrinterComponent, AddPrinterDialog } from './label-printer/label-printer.component';
import { PrintQueueComponent } from './label-printer/print-queue/print-queue.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryTableComponent } from './inventory/inventory-table/inventory-table.component';
import { InventoryButtonsComponent } from './inventory/inventory-buttons/inventory-buttons.component';
import { PrintButtonsComponent } from './inventory/print-buttons/print-buttons.component';
import { ScannerButtonsComponent } from './inventory/scanner-buttons/scanner-buttons.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/barcodeChecker',
    pathMatch: 'full'
  },
  { path: 'barcodeChecker', component: BarcodeCheckerComponent },
  { path: 'labelPrinter',      component: LabelPrinterComponent },
  { path: 'inventory',      component: InventoryComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BarcodeCheckerComponent,
    LabelPrinterComponent,
    AddPrinterDialog,
    PrintQueueComponent,
    PageNotFoundComponent,
    InventoryComponent,
    InventoryTableComponent,
    InventoryButtonsComponent,
    PrintButtonsComponent,
    ScannerButtonsComponent,
  ],
  entryComponents: [
    AddPrinterDialog
  ],
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: false } // <-- debugging purposes only
    ),  
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
