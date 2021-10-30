import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { FileUploadModule } from 'ng2-file-upload';

import { SharedModule } from '../../../shared/shared.module';
import { ModalModule } from '../modals/modal.module'
import { SolicitudRoutingModule } from './solicitudes-routing.module';
import { MateriaprimaComponent } from './materiaprima/materiaprima.component';

@NgModule({
    declarations: [MateriaprimaComponent],
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        NgxDatatableModule,
        ChartistModule,
        AgmCoreModule,
        NgSelectModule,
        NgbModule,
        SwiperModule,
        CustomFormsModule,
        ArchwizardModule,
        UiSwitchModule,
        TagInputModule,
        QuillModule,
        PipeModule,
        MatchHeightModule,
        ModalModule,
        FileUploadModule,
        SolicitudRoutingModule
    ],

    providers: [
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
    ]
})
export class SolicitudesModule { }