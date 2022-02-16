import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ArchwizardModule } from 'angular-archwizard';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QrCodeModule } from 'ng-qrcode';
import { NgxPrinterModule } from 'ngx-printer';

import { GeneralRoutingModule } from './general-routing.module';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { ModalModule } from '../modals/modal.module';
import { MatchHeightModule } from '../../../shared/directives/match-height.directive';
import { NgbDateCustomParserFormatter } from '../../../shared/util/NgbDateCustomParserFormatter';
import { DocumentoPagoComponent } from './operaciones/documentopago/documento-pago.component';
import { DocumentopagoEditComponent } from './operaciones/documentopago/edit/documentopago-edit.component';
import { DocumentoPagoPlantaComponent } from './operaciones/documentopagoplanta/documento-pago-planta.component';
import { DocumentopagoplantaEditComponent } from './operaciones/documentopagoplanta/edit/documentopagoplanta-edit.component';
import { PagoContratoComponent } from './operaciones/pagocontrato/pago-contrato.component';
import { PagoContratoEditComponent } from './operaciones/pagocontrato/edit/pago-contrato-edit.component';

@NgModule({
  imports: [
    CommonModule,
    GeneralRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartistModule,
    AgmCoreModule,
    NgSelectModule,
    NgbModule,
    SwiperModule,
    PipeModule,
    QrCodeModule,
    NgxPrinterModule.forRoot({ printOpenWindow: true }),
    NgxDatatableModule,
    CustomFormsModule,
    ArchwizardModule,
    UiSwitchModule,
    TagInputModule,
    QuillModule,
    MatchHeightModule,
    NgxSpinnerModule,
    ModalModule
  ],
  declarations: [
    DocumentoPagoComponent,
    DocumentopagoEditComponent,
    DocumentoPagoPlantaComponent,
    DocumentopagoplantaEditComponent,
    PagoContratoComponent,
    PagoContratoEditComponent
  ],
  exports: [],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class GeneralModule { }
