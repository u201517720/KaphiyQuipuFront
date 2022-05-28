import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertUtil } from '../../../../../Services/util/alert-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
  selector: 'app-pago-contrato',
  templateUrl: './pago-contrato.component.html',
  styleUrls: ['/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagoContratoComponent implements OnInit {

  frmListaPagoContratoAcopio: FormGroup;
  errorGeneral = { isError: false, msgError: '' };
  limitRef = 10;
  rows = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';

  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil) { }

  ngOnInit(): void {
    this.errorGeneral = { isError: false, msgError: '' };
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    this.LoadForm();
  }

  LoadForm() {
    this.frmListaPagoContratoAcopio = this.fb.group({
      nroDocPago: []
    });
  }

  get f() {
    return this.frmListaPagoContratoAcopio.controls;
  }

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  Buscar() {
    if (!this.frmListaPagoContratoAcopio.invalid) {
      this.errorGeneral = { isError: false, msgError: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        Documento: this.frmListaPagoContratoAcopio.value.nroDocPago,
      };
      this.generalService.ConsultarPagoContrato(request)
        .subscribe((res) => {
          this.spinner.hide();
          if (res) {
            if (res.Result.Success) {
              if (!res.Result.Message) {
                res.Result.Data.forEach(x => {
                  x.MontoPagoMoneda = `${x.Moneda} ${x.MontoPago.toLocaleString('es-PE')}`
                });
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
          console.log(err);
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    }
  }

  getCellClass({ row, column, value }): any {
    return {
      'd-flex': column.prop === 'MontoPagoMoneda',
      'justify-content-end': column.prop === 'MontoPagoMoneda'
    };
  }

}
