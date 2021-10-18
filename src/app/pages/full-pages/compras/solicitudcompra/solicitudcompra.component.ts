import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

import { SolicitudcompraService } from '../../../../services/solicitudcompra.service';

@Component({
  selector: 'app-solicitudcompra',
  templateUrl: './solicitudcompra.component.html',
  styleUrls: ['./solicitudcompra.component.scss']
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
  listEstados: any[];
  selectedEstado: any;

  constructor(private fb: FormBuilder,
    private solicitudcompraService: SolicitudcompraService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmListaSolicitudeCompra = this.fb.group({
      descCliente: [],
      fechaInicial: [],
      fechaFinal: [],
      estado: []
    });
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

  onSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  GetRequestSearch() {
    const request = {};
    return request;
  }

  Buscar() {
    this.spinner.show();
    const request = this.GetRequestSearch();
    this.solicitudcompraService.Consultar(request).subscribe((res) => {
      this.spinner.hide();
      if (res) {

      }
    }, (err) => {
      this.spinner.hide();
    })
  }
}
