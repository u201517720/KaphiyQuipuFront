import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertUtil } from '../../../../../services/util/alert-util';
import { DateUtil } from '../../../../../services/util/date-util';
import { GuiaremisionService } from '../../../../../services/guiaremision.service';

@Component({
  selector: 'app-guiaremision',
  templateUrl: './guiaremision.component.html',
  styleUrls: ['./guiaremision.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuiaremisionComponent implements OnInit {

  frmListaGuiaRemision: FormGroup;
  errorGeneral: any = { isError: false, errorMessage: '' };
  rows: any[] = [];
  limitRef = 10;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private guiaremisionService: GuiaremisionService) { }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmListaGuiaRemision = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });
    this.frmListaGuiaRemision.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmListaGuiaRemision.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmListaGuiaRemision.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmListaGuiaRemision.controls;
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
    let vBeginDate = new Date(this.frmListaGuiaRemision.value.fechaInicio);
    let vEndDate = new Date(this.frmListaGuiaRemision.value.fechaFin);

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
    if (!this.frmListaGuiaRemision.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmListaGuiaRemision.value.fechaInicio,
        FechaFin: this.frmListaGuiaRemision.value.fechaFin
      };
      this.guiaremisionService.Consultar(request)
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
