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

import { AcopioRoutingModule } from './acopio-routing.module';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { ModalModule } from '../modals/modal.module';
import { MatchHeightModule } from '../../../shared/directives/match-height.directive';
import { NgbDateCustomParserFormatter } from '../../../shared/util/NgbDateCustomParserFormatter';
import { IngresoAlmacenComponent } from '../acopio/operaciones/ingresoalmacen/ingreso-almacen.component';
import { IngresoAlmacenEditComponent } from '../acopio/operaciones/ingresoalmacen/edit/ingresoalmacen-edit.component';
import { GuiaRecepcionComponent } from '../acopio/operaciones/guiarecepcion/guia-recepcion.component';
import { GuiaRecepcionEditComponent } from '../acopio/operaciones/guiarecepcion/edit/guia-recepcion-edit.component';
import { ContratoComponent } from './operaciones/contrato/contrato.component';
import { ContratoEditComponent } from './operaciones/contrato/edit/contrato-edit.component';
import { OrdenprocesoComponent } from './operaciones/ordenproceso/ordenproceso.component';
import { MarcadosacosComponent } from './operaciones/marcadosacos/marcadosacos.component';
import { GuiaremisionComponent } from './operaciones/guiaremision/guiaremision.component';
import { GuiaremisionEditComponent } from '../acopio/operaciones/guiaremision/edit/guiaremision-edit.component';
import { MarcadosacosEditComponent } from '../acopio/operaciones/marcadosacos/edit/marcadosacos-edit.component';
import { OrdenprocesoEditComponent } from '../acopio/operaciones/ordenproceso/edit/ordenproceso-edit.component';
import { NotaIngresoDevolucionComponent } from '../acopio/operaciones/notaingresodevolucion/nota-ingreso-devolucion.component';
import { NotaIngresoDevolucionEditComponent } from '../acopio/operaciones/notaingresodevolucion/edit/nota-ingreso-devolucion-edit.component';
import { GuiaRemisionDevolucionComponent } from '../acopio/operaciones/guiaremisiondevolucion/guia-remision-devolucion.component';
import { GuiaRemisionDevolucionEditComponent } from '../acopio/operaciones/guiaremisiondevolucion/edit/guia-remision-devolucion-edit.component';
import { ProyectarVentaComponent } from '../acopio/operaciones/proyectarventa/proyectar-venta.component';

@NgModule({
  imports: [
    CommonModule,
    AcopioRoutingModule,
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
    IngresoAlmacenComponent,
    IngresoAlmacenEditComponent,
    IngresoAlmacenEditComponent,
    GuiaRecepcionComponent,
    GuiaRecepcionEditComponent,
    ContratoComponent,
    ContratoEditComponent,
    OrdenprocesoComponent,
    MarcadosacosComponent,
    GuiaremisionComponent,
    GuiaremisionEditComponent,
    MarcadosacosEditComponent,
    OrdenprocesoEditComponent,
    NotaIngresoDevolucionComponent,
    NotaIngresoDevolucionEditComponent,
    GuiaRemisionDevolucionComponent,
    GuiaRemisionDevolucionEditComponent,
    ProyectarVentaComponent
  ],
  exports: [],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class AcopioModule { }
