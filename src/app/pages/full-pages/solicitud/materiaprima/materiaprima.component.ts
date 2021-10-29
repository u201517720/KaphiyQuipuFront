import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { DateUtil } from '../../../../services/util/date-util';

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

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil) { }

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

  }

  filterUpdate(e) {

  }

  Buscar() {

  }

}
