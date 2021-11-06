import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from '../../../../../services/util/date-util';
import { ContratoService } from '../../../../../services/contrato.service';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContratoComponent implements OnInit {

  frmContratoCompraVenta: FormGroup;
  errorGeneral = { isError: false, msgError: '' };
  limitRef = 10;
  rows = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  tempData = [];
  userSession: any;

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private contratoService: ContratoService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    this.LoadForm();
  }

  LoadForm() {
    this.frmContratoCompraVenta = this.fb.group({
      fechaInicial: [],
      fechaFinal: []
    });
    this.frmContratoCompraVenta.controls.fechaInicial.setValue(this.dateUtil.currentMonthAgo());
    this.frmContratoCompraVenta.controls.fechaFinal.setValue(this.dateUtil.currentDate());
  }

  get f() {
    return this.frmContratoCompraVenta.controls;
  }

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  filterUpdate(e) {
    const val = e.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.Numero.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  RequestBuscar() {
    const request = {
      FechaInicio: this.frmContratoCompraVenta.value.fechaInicial,
      FechaFin: this.frmContratoCompraVenta.value.fechaFinal,
      RolId: this.userSession.RolId,
      CodigoDistribuidor: this.userSession.CodigoCliente
    };
    return request;
  }

  Buscar() {
    if (!this.frmContratoCompraVenta.invalid) {
      this.spinner.show();
      this.rows = [];
      this.tempData = [];
      const request = this.RequestBuscar();
      this.contratoService.Search(request)
        .subscribe((res) => {
          this.spinner.hide();
          if (res.Result.Success) {
            this.rows = res.Result.Data;
            this.tempData = res.Result.Data;
          } else {

          }
        }, (err) => {
          this.spinner.hide();
          console.log(err);
        });
    }
  }

}
