import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from 'ngx-spinner';

import { SolicitudcompraService } from '../../../../services/solicitudcompra.service';
import { DateUtil } from '../../../../services/util/date-util';
import { MaestroUtil } from '../../../../services/util/maestro-util';

@Component({
  selector: 'app-solicitudcompra',
  templateUrl: './solicitudcompra.component.html',
  styleUrls: ['./solicitudcompra.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SolicitudcompraComponent implements OnInit {

  frmListaSolicitudeCompra: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  errorGeneral = { msgError: '', isError: false };
  limitRef: 10;
  rows = [];
  tempData = [];
  selected = [];
  userSession: any;

  constructor(private fb: FormBuilder,
    private solicitudcompraService: SolicitudcompraService,
    private spinner: NgxSpinnerService,
    private dateUtil: DateUtil,
    private maestroUtil: MaestroUtil) {
    this.userSession = JSON.parse(localStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmListaSolicitudeCompra = this.fb.group({
      fechaInicial: [],
      fechaFinal: []
    });
    this.frmListaSolicitudeCompra.controls.fechaInicial.setValue(this.dateUtil.currentMonthAgo());
    this.frmListaSolicitudeCompra.controls.fechaFinal.setValue(this.dateUtil.currentDate());
  }

  get f() {
    return this.frmListaSolicitudeCompra.controls;
  }

  updateLimit(e: any) {
    this.limitRef = e.target.value;
  }

  filterUpdate(e: any) {
    const val = e.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.Numero.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  GetRequestSearch() {
    const form = this.frmListaSolicitudeCompra.value;
    const request = {
      fechaInicio: form.fechaInicial ? form.fechaInicial : null,
      fechaFin: form.fechaFinal ? form.fechaFinal : null,
      RolId: this.userSession.RolId,
      CodigoCliente: this.userSession.CodigoCliente
    };
    return request;
  }

  Buscar() {
    this.spinner.show();
    this.rows = [];
    this.tempData = [];
    const request = this.GetRequestSearch();
    this.solicitudcompraService.Consultar(request).subscribe((res) => {
      this.spinner.hide();
      if (res) {
        this.rows = res.Result.Data;
        this.tempData = this.rows;
      }
    }, (err) => {
      this.spinner.hide();
    })
  }
}
