import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from 'ngx-spinner';

import { SolicitudcompraService } from '../../../../Services/solicitudcompra.service';
import { DateUtil } from '../../../../Services/util/date-util';
import { MaestroUtil } from '../../../../Services/util/maestro-util';

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
  limitRef = 10;
  rows = [];
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';
  submitted = false;

  constructor(private fb: FormBuilder,
    private solicitudcompraService: SolicitudcompraService,
    private spinner: NgxSpinnerService,
    private dateUtil: DateUtil,
    private maestroUtil: MaestroUtil) {
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  ngOnInit(): void {
    this.errorGeneral = { msgError: '', isError: false };
    this.submitted = false;
    this.LoadForm();
  }

  LoadForm() {
    this.frmListaSolicitudeCompra = this.fb.group({
      fechaInicial: [, Validators.required],
      fechaFinal: [, Validators.required]
    });
    this.frmListaSolicitudeCompra.controls.fechaInicial.setValue(this.dateUtil.currentMonthAgo());
    this.frmListaSolicitudeCompra.controls.fechaFinal.setValue(this.dateUtil.currentDate());
    this.frmListaSolicitudeCompra.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmListaSolicitudeCompra.controls;
  }

  public comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (!group.value.fechaInicial || !group.value.fechaFinal) {
        this.errorGeneral = { isError: true, msgError: 'La fechas inicio y fin son obligatorias. Por favor, ingresarlas.' };
      } else {
        this.errorGeneral = { isError: false, msgError: '' };
      }
      return;
    };
  }

  updateLimit(e: any) {
    this.limitRef = e.target.value;
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
    this.errorGeneral = { msgError: '', isError: false };
    this.submitted = false;
    if (!this.frmListaSolicitudeCompra.invalid) {
      this.spinner.show();
      this.rows = [];
      const request = this.GetRequestSearch();
      this.solicitudcompraService.Consultar(request).subscribe((res) => {
        this.spinner.hide();
        if (res) {
          if (res.Result.Success) {
            if (!res.Result.Message) {
              this.rows = res.Result.Data;
            } else {
              this.errorGeneral = { isError: true, msgError: res.Result.Message };
            }
          } else {
            this.errorGeneral = { isError: true, msgError: res.Result.Message };
          }
        } else {
          this.errorGeneral = { isError: true, msgError: this.mensajeGenerico };
        }
      }, (err) => {
        this.spinner.hide();
      })
    }
  }
}
