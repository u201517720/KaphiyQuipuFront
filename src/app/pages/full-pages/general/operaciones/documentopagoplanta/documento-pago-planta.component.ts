import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertUtil } from '../../../../../Services/util/alert-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
  selector: 'app-documento-pago-planta',
  templateUrl: './documento-pago-planta.component.html',
  styleUrls: ['/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentoPagoPlantaComponent implements OnInit {

  frmListaPagosPlanta: FormGroup;
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
    this.frmListaPagosPlanta = this.fb.group({
      nroDocPago: []
    });
  }

  get f() {
    return this.frmListaPagosPlanta.controls;
  }

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  Buscar() {
    if (!this.frmListaPagosPlanta.invalid) {
      this.errorGeneral = { isError: false, msgError: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        Documento: this.frmListaPagosPlanta.value.nroDocPago,
      };
      this.generalService.ConsultarDocumentoPagoPlanta(request)
        .subscribe((res) => {
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
          console.log(err);
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    }
  }

}
