import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from "ngx-spinner";

import { OrdenprocesoacopioService } from '../../../../../services/ordenprocesoacopio.service';
import { DateUtil } from '../../../../../services/util/date-util';
import { AlertUtil } from '../../../../../services/util/alert-util';

@Component({
  selector: 'app-ordenproceso',
  templateUrl: './ordenproceso.component.html',
  styleUrls: ['./ordenproceso.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrdenprocesoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private ordenprocesoacopioService: OrdenprocesoacopioService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil) { }

  @ViewChild(DatatableComponent) table: DatatableComponent;
  frmOrdenProcesoAcopio: FormGroup;
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  limitRef = 10;
  rows: any[] = [];

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmOrdenProcesoAcopio = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });

    this.frmOrdenProcesoAcopio.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmOrdenProcesoAcopio.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmOrdenProcesoAcopio.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmOrdenProcesoAcopio.controls;
  }

  public comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const fechaInicio = group.controls['fechaInicio'];
      const fechaFin = group.controls['fechaFin'];
      if (!fechaInicio.value || !fechaFin.value) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar ambas fechas.' };
      } else {
        this.errorGeneral = { isError: false, errorMessage: '' };
      }
      return;
    };
  }

  compareTwoDates(): void {
    let vBeginDate = new Date(this.frmOrdenProcesoAcopio.value.fechaInicio);
    let vEndDate = new Date(this.frmOrdenProcesoAcopio.value.fechaFin);

    var anioFechaInicio = vBeginDate.getFullYear()
    var anioFechaFin = vEndDate.getFullYear()

    if (vEndDate < vBeginDate) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio.' };
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 2) {
      this.errorGeneral = { isError: true, errorMessage: 'Por favor el Rango de fechas no puede ser mayor a 2 años.' };
    } else {
      this.errorGeneral = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e: any) {
    this.limitRef = e.target.value;
  }

  Buscar() {
    if (!this.frmOrdenProcesoAcopio.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmOrdenProcesoAcopio.value.fechaInicio,
        FechaFin: this.frmOrdenProcesoAcopio.value.fechaFin
      };
      this.ordenprocesoacopioService.Consultar(request)
        .subscribe((res) => {
          this.spinner.hide();
          if (res) {
            if (res.Result.Success) {
              if (!res.Result.Message) {
                this.rows = res.Result.Data;
              } else {
                this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
              }
            } else {
              this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
            }
          } else {
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          }
        }, (err) => {
          this.spinner.hide();
          console.log(err);
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    }
  }

}
