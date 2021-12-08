import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FullPagesRoutingModule } from "./full-pages-routing.module";
import { ChartistModule } from "ng-chartist";
import { AgmCoreModule } from "@agm/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { SwiperModule } from "ngx-swiper-wrapper";
import { HomeComponent } from "./home/home.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AcopioModule } from "./acopio/acopio.module";
import { QrCodeModule } from 'ng-qrcode';
import { ListFilterPipe } from '../../shared/pipes/listFilter.pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { ComprasModule } from './compras/compras.module';
import { SolicitudesModule } from './solicitud/solicitudes.module';
import { PlantaModule } from './planta/planta.module';

@NgModule({
  imports: [
    CommonModule,
    FullPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartistModule,
    AgmCoreModule,
    NgSelectModule,
    NgbModule,
    SwiperModule,
    NgxDatatableModule,
    QrCodeModule,
    AcopioModule,
    FileUploadModule,
    ComprasModule,
    SolicitudesModule,
    PlantaModule
  ],
  declarations: [
    HomeComponent,
    ListFilterPipe
  ]
})
export class FullPagesModule { }
