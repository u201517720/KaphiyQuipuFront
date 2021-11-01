import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from '../../../../services/util/date-util';
import { AgricultorService } from '../../../../services/agricultor.service';

@Component({
  selector: 'app-materiaprima',
  templateUrl: './materiaprima.component.html',
  styleUrls: ['./materiaprima.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MateriaprimaComponent implements OnInit {

  frmSolicitudesMateriaPrima: FormGroup;
  errorGeneral = { isError: false, errorMessage: '' };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  limitRef = 10;
  rows = [];
  selected = [];
  tempData = [];
  userSession;

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private agricultorService: AgricultorService) {
    this.userSession = JSON.parse(localStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmSolicitudesMateriaPrima = this.fb.group({
      fechaInicio: [],
      fechaFin: []
    });

    this.frmSolicitudesMateriaPrima.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmSolicitudesMateriaPrima.controls.fechaFin.setValue(this.dateUtil.currentDate());
  }

  get f() {
    return this.frmSolicitudesMateriaPrima.controls;
  }

  compararFechas() {
    var anioFechaInicio = new Date(this.frmSolicitudesMateriaPrima.value.fechaInicio).getFullYear()
    var anioFechaFin = new Date(this.frmSolicitudesMateriaPrima.value.fechaFin).getFullYear()

    if (anioFechaFin < anioFechaInicio) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio' };
      this.frmSolicitudesMateriaPrima.controls.fechaFin.setErrors({ isError: true })
    } else {
      this.errorGeneral = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  RequestBuscar() {
    const request = {
      FechaInicio: this.frmSolicitudesMateriaPrima.value.fechaInicio,
      FechaFin: this.frmSolicitudesMateriaPrima.value.fechaFin,
      UserId: this.userSession.IdUsuario
    };

    return request;
  }

  Buscar() {
    if (this.userSession.RolId === 3) {
      if (!this.frmSolicitudesMateriaPrima.invalid) {
        this.spinner.show();
        this.rows = [];
        this.tempData = [];
        const request = this.RequestBuscar();
        this.agricultorService.ConsultarMateriaPrimaSolicitada(request)
          .subscribe((res) => {
            if (res && res.Result.Success) {
              this.rows = res.Result.Data;
              this.tempData = res.Result.Data;
            }
          }, (err) => {

          });
        this.spinner.hide();
      }
    }
  }

}
