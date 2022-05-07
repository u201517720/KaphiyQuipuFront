import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { DateUtil } from '../../../../../Services/util/date-util';
import { AgricultorService } from '../../../../../Services/agricultor.service';

@Component({
    selector: 'app-valoracion-productor',
    templateUrl: './valoracion.component.html'
})
export class ValoracionComponent implements OnInit {

    frmListaCosecha: FormGroup;
    errorGeneral = { isError: false, errorMessage: '' };
    @ViewChild(DatatableComponent) table: DatatableComponent;
    limitRef = 10;
    rows = [];
    userSession;

    constructor(private fb: FormBuilder,
        private dateUtil: DateUtil,
        private spinner: NgxSpinnerService,
        private router: Router,
        private agricultorService: AgricultorService) {
        this.userSession = JSON.parse(sessionStorage.getItem('user'));
        if (this.userSession) {
            this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
        }
    }

    ngOnInit(): void {
        
    }

}
