import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";

import { DateUtil } from '../../../../../services/util/date-util';
import { AlertUtil } from '../../../../../services/util/alert-util';
import { NotaingresoplantaService } from '../../../../../services/notaingresoplanta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nota-ingreso-planta',
  templateUrl: './nota-ingreso-planta.component.html',
  styleUrls: ['./nota-ingreso-planta.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotaIngresoPlantaComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private alertUtil: AlertUtil,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private notaingresoplantaService: NotaingresoplantaService,
    private router: Router) { }

  frmNotaIngresoPlanta: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  limitRef = 10;
  rows: any[] = [];
  submitted: boolean = false;
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmNotaIngresoPlanta = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });
    this.frmNotaIngresoPlanta.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmNotaIngresoPlanta.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmNotaIngresoPlanta.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmNotaIngresoPlanta.controls;
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
    let vBeginDate = new Date(this.frmNotaIngresoPlanta.value.fechaInicio);
    let vEndDate = new Date(this.frmNotaIngresoPlanta.value.fechaFin);

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

  Buscar() {
    if (!this.frmNotaIngresoPlanta.invalid) {
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmNotaIngresoPlanta.value.fechaInicio,
        FechaFin: this.frmNotaIngresoPlanta.value.fechaFin
      }
      this.notaingresoplantaService.Consultar(request)
        .subscribe((res) => {
          this.spinner.hide();
          if (res.Result.Success) {
            this.rows = res.Result.Data;
          }
        }, (err) => {
          this.spinner.hide();
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    } else {
      this.submitted = true;
    }
  }

  Nuevo() {
    this.router.navigate(['/planta/operaciones/notaingreso/create']);
  }
}
