import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from '../../../../../Services/util/date-util';
import { AlertUtil } from '../../../../../Services/util/alert-util';
import { GuiaremisionplantaService } from '../../../../../Services/guiaremisionplanta.service';

@Component({
  selector: 'app-guia-remision-planta',
  templateUrl: './guia-remision-planta.component.html',
  styleUrls: ['./guia-remision-planta.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuiaRemisionPlantaComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private guiaremisionplantaService: GuiaremisionplantaService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil) { }

  @ViewChild(DatatableComponent) table: DatatableComponent;
  frmGuiaRemisionPlanta: FormGroup;
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  limitRef = 10;
  rows: any[] = [];

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmGuiaRemisionPlanta = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });

    this.frmGuiaRemisionPlanta.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmGuiaRemisionPlanta.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmGuiaRemisionPlanta.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmGuiaRemisionPlanta.controls;
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
    let vBeginDate = new Date(this.frmGuiaRemisionPlanta.value.fechaInicio);
    let vEndDate = new Date(this.frmGuiaRemisionPlanta.value.fechaFin);

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
    if (!this.frmGuiaRemisionPlanta.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmGuiaRemisionPlanta.value.fechaInicio,
        FechaFin: this.frmGuiaRemisionPlanta.value.fechaFin
      };
      this.guiaremisionplantaService.Consultar(request)
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
