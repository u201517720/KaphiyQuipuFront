import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from "ngx-spinner";

import { AlertUtil } from '../../../../../Services/util/alert-util';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
  selector: 'app-proyectar-venta-acopio',
  templateUrl: './proyectar-venta.component.html'
})
export class ProyectarVentaComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private maestroUtil: MaestroUtil,
    private generalService: GeneralService,
    private alertUtil: AlertUtil) { }

  @ViewChild(DatatableComponent) table: DatatableComponent;
  frmProyeccionVentaAcopio: FormGroup;
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  columnas: any[] = [];
  valores: any[] = [];
  columnasCosecha: any[] = [];
  valoresCosecha: any[] = [];
  selectedPeriodo = [];
  listPeriodos = [];

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmProyeccionVentaAcopio = this.fb.group({
      periodo: [, Validators.required]
    });
    this.GetPeriodos();
  }

  get f() {
    return this.frmProyeccionVentaAcopio.controls;
  }

  GetPeriodos() {
    this.maestroUtil.obtenerMaestros('PeriodosProyeccion', (res) => {
      this.listPeriodos = res.Result.Data;
    })
  }

  Proyectar() {
    if (!this.frmProyeccionVentaAcopio.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.columnas = [];
      const request = {
        NroMeses: parseInt(this.frmProyeccionVentaAcopio.value.periodo),
      };
      this.generalService.ProyectarVenta(request)
        .subscribe((res) => {
          this.spinner.hide();
          this.columnas = res.Columnas.reverse();
          this.valores = res.Valores.reverse();
          this.columnasCosecha = res.ColumnasCosecha.reverse();
          this.valoresCosecha = res.ValoresCosecha.reverse();
        }, (err) => {
          console.log(err);
        })
    }
  }

}
