import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AcopioRoutingModule } from "./acopio-routing.module";
import { ChartistModule } from "ng-chartist";
import { AgmCoreModule } from "@agm/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { SwiperModule } from "ngx-swiper-wrapper";
import { PipeModule } from "../../../shared/pipes/pipe.module";
import { CustomFormsModule } from 'ngx-custom-validators';
import { ArchwizardModule } from 'angular-archwizard';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill'
import { MatchHeightModule } from "../../../shared/directives/match-height.directive";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbDateCustomParserFormatter } from "../../../shared/util/NgbDateCustomParserFormatter";
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QrCodeModule } from 'ng-qrcode';

import { IngresoAlmacenComponent } from './operaciones/ingresoalmacen/ingreso-almacen.component';
import { IngresoAlmacenEditComponent } from './operaciones/ingresoalmacen/edit/ingresoalmacen-edit.component';
import { GuiaRecepcionComponent } from './operaciones/guiarecepcion/guia-recepcion.component';
import { GuiaRecepcionEditComponent } from './operaciones/guiarecepcion/edit/guia-recepcion-edit.component';
import { ContratoComponent } from './operaciones/contrato/contrato.component';
import { ContratoEditComponent } from './operaciones/contrato/edit/contrato-edit.component';
import { OrdenprocesoComponent } from './operaciones/ordenproceso/ordenproceso.component';
import { MarcadosacosComponent } from './operaciones/marcadosacos/marcadosacos.component';
import { GuiaremisionComponent } from './operaciones/guiaremision/guiaremision.component';
import { GuiaremisionEditComponent } from './operaciones/guiaremision/edit/guiaremision-edit.component';
import { MarcadosacosEditComponent } from './operaciones/marcadosacos/edit/marcadosacos-edit.component';
import { OrdenprocesoEditComponent } from './operaciones/ordenproceso/edit/ordenproceso-edit.component';
import { NotaIngresoDevolucionComponent } from './operaciones/notaingresodevolucion/nota-ingreso-devolucion.component';
import { NotaIngresoDevolucionEditComponent } from './operaciones/notaingresodevolucion/edit/nota-ingreso-devolucion-edit.component';
import { GuiaRemisionDevolucionComponent } from './operaciones/guiaremisiondevolucion/guia-remision-devolucion.component';
import { GuiaRemisionDevolucionEditComponent } from './operaciones/guiaremisiondevolucion/edit/guia-remision-devolucion-edit.component';

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
    NgxDatatableModule,
    CustomFormsModule,
    ArchwizardModule,
    UiSwitchModule,
    TagInputModule,
    QuillModule,
    MatchHeightModule,
    NgxSpinnerModule
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
    GuiaRemisionDevolucionEditComponent
  ],
  exports: [],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class AcopioModule { }
