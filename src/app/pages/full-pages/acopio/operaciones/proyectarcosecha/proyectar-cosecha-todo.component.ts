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
  submitted = false;

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
    this.maestroUtil.obtenerMaestros('NumerosCosechas', (res) => {
      this.listPeriodos = res.Result.Data.map(x => ({ Codigo: parseInt(x.Codigo), Label: x.Label })).sort((a, b) => a.Codigo - b.Codigo);
    })
  }

  Proyectar() {
    if (!this.frmProyeccionCosechasAcopio.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.columnas = [];
      this.valores = [];
      const request = {
        NroMeses: parseInt(this.frmProyeccionCosechasAcopio.value.periodo),
      };
      this.generalService.ProyectarCosechaAcopio(request)
        .subscribe((res) => {
          this.spinner.hide();
          let tmpValores = [];
          this.columnas = res.Columnas;
          res.Valores.forEach((x, y) => {
            tmpValores = [];
            x.forEach((a, b) => {
              if (b > 0) {
                tmpValores.push(`${parseFloat(a).toLocaleString('es-PE')} Kg.`);
              } else {
                tmpValores.push(a);
              }
            });
            this.valores.push(tmpValores);
          })
        }, (err) => {
          console.log(err);
        })
    } else {
      this.submitted = true;
    }
  }

}
