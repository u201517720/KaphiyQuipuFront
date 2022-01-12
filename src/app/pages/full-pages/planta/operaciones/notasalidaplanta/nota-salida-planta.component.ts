import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from '../../../../../Services/util/date-util';
import { AlertUtil } from '../../../../../Services/util/alert-util';
import { NotasalidaplantaService } from '../../../../../Services/notasalidaplanta.service';

@Component({
  selector: 'app-nota-salida-planta',
  templateUrl: './nota-salida-planta.component.html',
  styleUrls: ['./nota-salida-planta.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotaSalidaPlantaComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private notasalidaplantaService: NotasalidaplantaService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil) { }

  @ViewChild(DatatableComponent) table: DatatableComponent;
  frmNotaSalidaPlanta: FormGroup;
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  limitRef = 10;
  rows: any[] = [];

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmNotaSalidaPlanta = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });

    this.frmNotaSalidaPlanta.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmNotaSalidaPlanta.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmNotaSalidaPlanta.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmNotaSalidaPlanta.controls;
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
    let vBeginDate = new Date(this.frmNotaSalidaPlanta.value.fechaInicio);
    let vEndDate = new Date(this.frmNotaSalidaPlanta.value.fechaFin);

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
    if (!this.frmNotaSalidaPlanta.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmNotaSalidaPlanta.value.fechaInicio,
        FechaFin: this.frmNotaSalidaPlanta.value.fechaFin
      };
      this.notasalidaplantaService.Consultar(request)
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
