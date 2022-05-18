import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { DateUtil } from '../../../../../Services/util/date-util';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
    selector: 'app-valoracion-productor',
    templateUrl: './valoracion.component.html'
})
export class ValoracionComponent implements OnInit {

    frmValoracionesPorAgricultor: FormGroup;
    errorGeneral = { isError: false, errorMessage: '' };
    @ViewChild(DatatableComponent) table: DatatableComponent;
    userSession;
    listActores: [];
    selectedActor: [];
    comentarios: [] = [];

    constructor(private fb: FormBuilder,
        private dateUtil: DateUtil,
        private spinner: NgxSpinnerService,
        private router: Router,
        private generalService: GeneralService,
        private maestroUtil: MaestroUtil) {
        this.userSession = JSON.parse(sessionStorage.getItem('user'));
        if (this.userSession) {
            this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
        }
    }

    ngOnInit(): void {
        this.LoadForm();
    }

    LoadForm() {
        this.frmValoracionesPorAgricultor = this.fb.group({
            actor: [Validators.required],
            fechaInicial: [Validators.required],
            fechaFinal: [Validators.required],
        });
        this.frmValoracionesPorAgricultor.controls.fechaInicial.setValue(this.dateUtil.currentMonthAgo());
        this.frmValoracionesPorAgricultor.controls.fechaFinal.setValue(this.dateUtil.currentDate());
        this.GetActores();
    }

    get f() {
        return this.frmValoracionesPorAgricultor.controls;
    }

    GetActores() {
        this.maestroUtil.obtenerMaestros('ActoresValoracionAgricultor', (res) => {
            this.listActores = res.Result.Data;
        })
    }

    Visualizar() {
        if (!this.frmValoracionesPorAgricultor.invalid) {
            const request = {
                FechaInicio: this.frmValoracionesPorAgricultor.value.fechaInicial,
                FechaFin: this.frmValoracionesPorAgricultor.value.fechaFinal,
                Usuario: this.userSession.IdUsuario,
                Tipo: parseInt(this.frmValoracionesPorAgricultor.value.actor)
            };
            this.generalService.ValoracionesPorAgricultor(request)
                .subscribe((res) => {
                    this.comentarios = res.Result.Data;
                })
        }
    }
}
