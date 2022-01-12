import { Component, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { DatatableComponent } from "@swimlane/ngx-datatable";

import { DateUtil } from '../../../../../services/util/date-util';
import { AlertUtil } from '../../../../../services/util/alert-util';
import { NotaingresoacopioService } from '../../../../../services/notaingresoacopio.service';

@Component({
  selector: 'app-ingreso-almacen',
  templateUrl: './ingreso-almacen.component.html',
  styleUrls: ['./ingreso-almacen.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IngresoAlmacenComponent implements OnInit {

  frmNotaIngresoAlmacen: FormGroup;
  selectedTypeDocument: any;
  error: any = { isError: false, errorMessage: '' };
  errorGeneral: any = { isError: false, errorMessage: '' };
  errorFecha: any = { isError: false, errorMessage: '' };
  rows: any[] = [];
  tempData = [];
  submitted: boolean = false;
  limitRef = 10;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  selected = [];
  @Output() agregarEvent = new EventEmitter<any>();
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private notaingresoacopioService: NotaingresoacopioService) { }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmNotaIngresoAlmacen = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });
    this.frmNotaIngresoAlmacen.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmNotaIngresoAlmacen.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmNotaIngresoAlmacen.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmNotaIngresoAlmacen.controls;
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
    let vBeginDate = new Date(this.frmNotaIngresoAlmacen.value.fechaInicio);
    let vEndDate = new Date(this.frmNotaIngresoAlmacen.value.fechaFin);

    var anioFechaInicio = vBeginDate.getFullYear()
    var anioFechaFin = vEndDate.getFullYear()

    if (vEndDate < vBeginDate) {
      this.error = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio.' };
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 1) {
      this.error = { isError: true, errorMessage: 'El rango de fechas no puede ser mayor a 1 años. Por favor, corregir.' };
    } else {
      this.error = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e: any) {
    this.limitRef = e.target.value;
  }

  onSelect(event: any): void {
    this.selected = event.selected;
  }


  Buscar() {
    if (!this.frmNotaIngresoAlmacen.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmNotaIngresoAlmacen.value.fechaInicio,
        FechaFin: this.frmNotaIngresoAlmacen.value.fechaFin
      };
      this.notaingresoacopioService.Search(request)
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
            this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
          }
        }, (err) => {
          this.spinner.hide();
          console.log(err);
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    }
  }
}
