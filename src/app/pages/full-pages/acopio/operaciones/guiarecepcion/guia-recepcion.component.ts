import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from '../../../../../services/util/date-util';
import { AlertUtil } from '../../../../../services/util/alert-util';

@Component({
  selector: 'app-guia-recepcion',
  templateUrl: './guia-recepcion.component.html',
  styleUrls: ['./guia-recepcion.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuiaRecepcionComponent implements OnInit {

  frmListGuiaRecepcion: FormGroup;
  errorGeneral = { isError: false, errorMessage: '' };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  limitRef = 10;
  selected: [];
  rows: [];
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil) {
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmListGuiaRecepcion = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });

    this.frmListGuiaRecepcion.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmListGuiaRecepcion.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmListGuiaRecepcion.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmListGuiaRecepcion.controls;
  }

  public comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (!group.value.fechaInicio || !group.value.fechaFin) {
        this.errorGeneral = { isError: true, errorMessage: 'La fechas inicio y fin son obligatorias. Por favor, ingresarlas.' };
      } else {
        this.errorGeneral = { isError: false, errorMessage: '' };
      }
      return;
    };
  }

  compareTwoDates() {
    const anioFechaInicio = new Date(this.frmListGuiaRecepcion.value.fechaInicio).getFullYear()
    const anioFechaFin = new Date(this.frmListGuiaRecepcion.value.fechaFin).getFullYear()

    if (anioFechaFin < anioFechaInicio) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser menor a la fecha inicio' };
    } else {
      this.errorGeneral = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  Buscar() {
    if (!this.frmListGuiaRecepcion.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: '',
        FechaFin: ''
      };
      // this.contratoService.Search(request)
      //   .subscribe((res) => {
      //     this.spinner.hide();
      //     if (res) {
      //       if (res.Result.Success) {
      //         if (!res.Result.Message) {
      //           this.rows = res.Result.Data;
      //         } else {
      //           this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
      //         }
      //       } else {
      //         this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
      //       }
      //     } else {
      //       this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
      //     }
      //   }, (err) => {
      //     this.spinner.hide();
      //     console.log(err);
      //     this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      //   });
    }
  }
}
