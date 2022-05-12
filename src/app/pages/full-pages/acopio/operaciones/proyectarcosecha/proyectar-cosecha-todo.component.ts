import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

import { AlertUtil } from '../../../../../Services/util/alert-util';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
  selector: 'app-proyectar-cosecha-acopio',
  templateUrl: './proyectar-cosecha-todo.component.html'
})
export class ProyectarCosechaTodoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private maestroUtil: MaestroUtil,
    private generalService: GeneralService,
    private alertUtil: AlertUtil) { }

  frmProyeccionCosechasAcopio: FormGroup;
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  columnas: any[] = [];
  valores: any[] = [];
  selectedPeriodo = [];
  listPeriodos = [];

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmProyeccionCosechasAcopio = this.fb.group({
      periodo: [, Validators.required]
    });
    this.GetPeriodos();
  }

  get f() {
    return this.frmProyeccionCosechasAcopio.controls;
  }

  GetPeriodos() {
    this.maestroUtil.obtenerMaestros('PeriodosProyeccion', (res) => {
      this.listPeriodos = res.Result.Data.map(x => ({ Codigo: parseInt(x.Codigo), Label: x.Label })).sort((a, b) => a.Codigo - b.Codigo);
    })
  }

  Proyectar() {
    if (!this.frmProyeccionCosechasAcopio.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.columnas = [];
      const request = {
        NroMeses: parseInt(this.frmProyeccionCosechasAcopio.value.periodo),
      };
      this.generalService.ProyectarCosechaAcopio(request)
        .subscribe((res) => {
          this.spinner.hide();
          this.columnas = res.Columnas;
          this.valores = res.Valores;
        }, (err) => {
          console.log(err);
        })
    }
  }

}
