import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertUtil } from '../../../../../Services/util/alert-util';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
  selector: 'app-proyeccion-cosecha',
  templateUrl: './proyectar-cosecha.component.html',
})
export class ProyectarCosechaComponent implements OnInit {

  frmProyectar: FormGroup;
  errorGeneral = { isError: false, msgError: '' };
  columnas: any[] = [];
  valores: any[] = [];
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';
  selectedPeriodo = [];
  listPeriodos = [];
  submitted = false;

  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private spinner: NgxSpinnerService,
    private maestroUtil: MaestroUtil,
    private alertUtil: AlertUtil) {
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    this.LoadForm();
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmProyectar = this.fb.group({
      periodo: [, Validators.required]
    });
    this.GetPeriodos();
  }

  get f() {
    return this.frmProyectar.controls;
  }

  GetPeriodos() {
    this.spinner.show();
    this.maestroUtil.obtenerMaestros('NumerosCosechas', (res) => {
      this.listPeriodos = res.Result.Data.map(x => ({ Codigo: parseInt(x.Codigo), Label: x.Label })).sort((a, b) => a.Codigo - b.Codigo);
      this.spinner.hide();
    })
  }

  Proyectar() {
    if (!this.frmProyectar.invalid) {
      this.spinner.show();
      this.columnas = [];
      this.valores = [];
      const request = {
        CantMeses: parseInt(this.frmProyectar.value.periodo),
        UserId: this.userSession.IdUsuario
      }
      this.generalService.ProyectarCosecha(request)
        .subscribe((res) => {
          this.spinner.hide();
          this.columnas = res.Columnas.reverse();
          this.valores = res.Valores.reverse();
        }, (err) => {
          this.spinner.hide();
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        })
    } else {
      this.submitted = true;
    }
  }
}
