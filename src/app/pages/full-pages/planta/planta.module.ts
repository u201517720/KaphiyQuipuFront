import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PlantaRoutingModule } from "./planta-routing.module";
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

import { NotaIngresoPlantaComponent } from './operaciones/notaingresoplanta/nota-ingreso-planta.component';
import { NotaIngresoPlantaEditComponent } from './operaciones/notaingresoplanta/edit/nota-ingreso-planta-edit.component';
import { NotaSalidaPlantaComponent } from './operaciones/notasalidaplanta/nota-salida-planta.component';
import { GuiaRemisionPlantaComponent } from './operaciones/guiaremisionplanta/guia-remision-planta.component';
import { NotaSalidaPlantaEditComponent } from './operaciones/notasalidaplanta/edit/nota-salida-planta-edit.component';
import { GuiaRemisionPlantaEditComponent } from './operaciones/guiaremisionplanta/edit/guia-remision-planta-edit.component';

@NgModule({
  imports: [
    CommonModule,
    PlantaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartistModule,
    AgmCoreModule,
    NgSelectModule,
    NgbModule,
    SwiperModule,
    PipeModule,
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
    NotaIngresoPlantaComponent,
    NotaIngresoPlantaEditComponent,
    NotaSalidaPlantaComponent,
    GuiaRemisionPlantaComponent,
    NotaSalidaPlantaEditComponent,
    GuiaRemisionPlantaEditComponent
  ],
  exports: [],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class PlantaModule { }
