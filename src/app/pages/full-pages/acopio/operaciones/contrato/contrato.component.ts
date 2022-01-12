import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from '../../../../../Services/util/date-util';
import { AlertUtil } from '../../../../../services/util/alert-util';
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
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private contratoService: ContratoService,
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
    this.frmContratoCompraVenta = this.fb.group({
      fechaInicial: [, Validators.required],
      fechaFinal: [, Validators.required]
    });
    this.frmContratoCompraVenta.controls.fechaInicial.setValue(this.dateUtil.currentMonthAgo());
    this.frmContratoCompraVenta.controls.fechaFinal.setValue(this.dateUtil.currentDate());
    this.frmContratoCompraVenta.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmContratoCompraVenta.controls;
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

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  RequestBuscar() {
    const request = {
      FechaInicio: this.frmContratoCompraVenta.value.fechaInicial,
      FechaFin: this.frmContratoCompraVenta.value.fechaFinal,
      RolId: this.userSession.RolId,
      CodigoDistribuidor: this.userSession.CodigoCliente,
      UserId: this.userSession.IdUsuario
    };
    return request;
  }

  Buscar() {
    if (!this.frmContratoCompraVenta.invalid) {
      this.errorGeneral = { isError: false, msgError: '' };
      this.spinner.show();
      this.rows = [];
      const request = this.RequestBuscar();
      this.contratoService.Search(request)
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
