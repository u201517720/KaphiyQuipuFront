import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Router } from '@angular/router';

import { AlertUtil } from '../../../../../Services/util/alert-util';
import { DateUtil } from '../../../../../Services/util/date-util';
import { NotaingresoacopioService } from '../../../../../Services/notaingresoacopio.service';

@Component({
  selector: 'app-nota-ingreso-devolucion',
  templateUrl: './nota-ingreso-devolucion.component.html',
  styleUrls: ['./nota-ingreso-devolucion.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotaIngresoDevolucionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private notaingresoacopioService: NotaingresoacopioService,
    private router: Router) { 
      this.userSession = JSON.parse(sessionStorage.getItem('user'));
      if (this.userSession) {
        this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
      }
    }

  frmNotaIngresoDevolucion: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  errorGeneral: any = { isError: false, errorMessage: '' };
  rows: any[] = [];
  limitRef = 10;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';
  userSession: any;

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmNotaIngresoDevolucion = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });
    this.frmNotaIngresoDevolucion.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmNotaIngresoDevolucion.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmNotaIngresoDevolucion.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmNotaIngresoDevolucion.controls;
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
    let vBeginDate = new Date(this.frmNotaIngresoDevolucion.value.fechaInicio);
    let vEndDate = new Date(this.frmNotaIngresoDevolucion.value.fechaFin);

    var anioFechaInicio = vBeginDate.getFullYear()
    var anioFechaFin = vEndDate.getFullYear()

    if (vEndDate < vBeginDate) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio.' };
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 1) {
      this.errorGeneral = { isError: true, errorMessage: 'El rango de fechas no puede ser mayor a 1 años. Por favor, corregir.' };
    } else {
      this.errorGeneral = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e: any) {
    this.limitRef = e.target.value;
  }

  Nuevo() {
    this.router.navigate(['/acopio/operaciones/notaingresodevolucion/create']);
  }

  Buscar() {
    if (!this.frmNotaIngresoDevolucion.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmNotaIngresoDevolucion.value.fechaInicio,
        FechaFin: this.frmNotaIngresoDevolucion.value.fechaFin
      };
      this.notaingresoacopioService.ConsultarDevolucion(request)
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
