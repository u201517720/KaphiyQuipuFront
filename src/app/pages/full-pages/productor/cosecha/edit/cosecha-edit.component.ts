import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { DateUtil } from '../../../../../Services/util/date-util';
import { AgricultorService } from '../../../../../Services/agricultor.service';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { AlertUtil } from '../../../../../Services/util/alert-util';

@Component({
    selector: 'app-cosecha-edit',
    templateUrl: './cosecha-edit.component.html',
    styleUrls: ['./cosecha-edit.component.scss']
})
export class CosechaEditComponent implements OnInit {

    frmDetalleCosecha: FormGroup;
    listFincas: any[];
    listUnidadMedida: any[];
    selectedFinca: any;
    selectedUnidMedida: any;
    errorGeneral = { isError: false, errorMessage: '' };
    userSession;
    submitted = false;

    constructor(private fb: FormBuilder,
        private dateUtil: DateUtil,
        private spinner: NgxSpinnerService,
        private router: Router,
        private agricultorService: AgricultorService,
        private maestroUtil: MaestroUtil,
        private alertUtil: AlertUtil) {
        this.userSession = JSON.parse(sessionStorage.getItem('user'));
        if (this.userSession) {
            this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
        }
    }

    ngOnInit(): void {
        this.LoadForm();
    }

    LoadForm() {
        this.frmDetalleCosecha = this.fb.group({
            finca: [, Validators.required],
            fechaCosecha: [, Validators.required],
            pesoNeto: [, Validators.required],
            unidadMedida: [, Validators.required]
        });
        this.frmDetalleCosecha.controls.fechaCosecha.setValue(this.dateUtil.currentDate());
        this.ListarFincas();
        this.LoadUnidadMedida();
    }

    get f() {
        return this.frmDetalleCosecha.controls;
    }

    ListarFincas() {
        this.listFincas = [];
        this.agricultorService.ListarFincasPorAgricultor({ CodigoUsuario: this.userSession.IdUsuario })
            .subscribe((res) => {
                if (res.Result.Success) {
                    this.listFincas = res.Result.Data;
                }
            });
    }

    LoadUnidadMedida() {
        this.listUnidadMedida = [];
        this.maestroUtil.obtenerMaestros('UnidadMedicion', (res) => {
            this.listUnidadMedida = res.Result.Data;
        });
    }

    Guardar() {
        this.submitted = false;
        if (!this.frmDetalleCosecha.invalid) {
            this.alertUtil.alertSiNoCallback('Pregunta',
                '¿Está seguro de registrar?',
                () => {
                    const request = {
                        CodigoSocioFinca: this.frmDetalleCosecha.value.finca,
                        PesoNeto: this.frmDetalleCosecha.value.pesoNeto,
                        FechaCosecha: this.frmDetalleCosecha.value.fechaCosecha,
                        UnidadMedida: this.frmDetalleCosecha.value.unidadMedida,
                        Usuario: this.userSession.NombreUsuario
                    }

                    this.agricultorService.RegistrarCosechaPorFinca(request)
                        .subscribe((res) => {
                            if (res.Result.Success) {
                                this.alertUtil.alertOkCallback('Confirmación',
                                    'La cosecha se guardo correctamente.',
                                    () => {
                                        this.Cancelar();
                                    });
                            }
                        });
                });
        } else {
            this.submitted = true;
        }
    }

    Cancelar() {
        this.router.navigate(['/productor/cosecha/list']);
    }

}
