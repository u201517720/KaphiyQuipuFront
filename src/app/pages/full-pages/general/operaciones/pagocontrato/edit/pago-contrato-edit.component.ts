import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertUtil } from '../../../../../../Services/util/alert-util';
import { GeneralService } from '../../../../../../Services/general.service';
import { host } from '../../../../../../shared/hosts/main.host';

@Component({
  selector: 'app-pago-contrato-edit',
  templateUrl: './pago-contrato-edit.component.html'
})
export class PagoContratoEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private alertUtil: AlertUtil) { }

  frmPagoContratoEdit: FormGroup;
  errorGeneral = { isError: false, msgError: '' };
  limitRef = 10;
  rows = [];
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';
  locId = 0;
  locEstado = 0;

  ngOnInit(): void {
    this.errorGeneral = { isError: false, msgError: '' };
    this.locId = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : 0;
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    this.LoadForm();
    if (this.locId > 0) {
      this.ConsultarPorId();
    }
  }

  LoadForm() {
    this.frmPagoContratoEdit = this.fb.group({
      correlativo: [],
      nroContrato: [],
      rucEmpresa: [],
      fechaRegistro: [],
      remitente: [],
      motivo: [],
      remitenteRUC: [],
      rzDestinatario: [],
      estado: [],
      totalPagar: [],
      file: [],
      fileName: [],
      rucDestinatario: [],
      moneda: []
    });
  }

  get f() {
    return this.frmPagoContratoEdit.controls;
  }

  ConsultarPorId() {
    this.spinner.show();
    const request = { Id: this.locId }
    this.generalService.ConsultarPagoContratoId(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res.Result.Success) {
          this.locEstado = res.Result.Data.EstadoId;
          this.frmPagoContratoEdit.controls.correlativo.setValue(res.Result.Data.CorrelativoPC);
          this.frmPagoContratoEdit.controls.nroContrato.setValue(res.Result.Data.CorrelativoCC);
          this.frmPagoContratoEdit.controls.rucEmpresa.setValue(res.Result.Data.Ruc);
          this.frmPagoContratoEdit.controls.fechaRegistro.setValue(res.Result.Data.FecReg);
          this.frmPagoContratoEdit.controls.remitente.setValue(res.Result.Data.Remitente);
          this.frmPagoContratoEdit.controls.motivo.setValue(res.Result.Data.Motivo);
          this.frmPagoContratoEdit.controls.remitenteRUC.setValue(res.Result.Data.RemitenteRUC);
          this.frmPagoContratoEdit.controls.rzDestinatario.setValue(res.Result.Data.Cliente);
          this.frmPagoContratoEdit.controls.rucDestinatario.setValue(res.Result.Data.ClienteRUC);
          this.frmPagoContratoEdit.controls.estado.setValue(res.Result.Data.Estado);
          this.frmPagoContratoEdit.controls.totalPagar.setValue(res.Result.Data.MontoPago);
          this.frmPagoContratoEdit.controls.moneda.setValue(res.Result.Data.Moneda);
          if (res.Result.Data.NombreArchivo)
            this.frmPagoContratoEdit.controls.fileName.setValue(res.Result.Data.NombreArchivo);
        } else {
          this.alertUtil.alertError('ERROR', res.Result.Message);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });
  }

  fileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.frmPagoContratoEdit.patchValue({
        file: event.target.files[0]
      });
      this.frmPagoContratoEdit.get('file').updateValueAndValidity()
    }
  }

  Guardar() {
    if (this.locEstado === 1) {
      if (this.frmPagoContratoEdit.value.file) {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de guardar el comprobante de pago?',
          () => {
            this.spinner.show();
            const request = {
              Id: this.locId,
              Usuario: this.userSession.NombreUsuario
            };
            const formData = new FormData();
            formData.append('file', this.frmPagoContratoEdit.get('file').value);
            formData.append('request', JSON.stringify(request));
            const headers = new HttpHeaders();
            headers.append('enctype', 'multipart/form-data');
            this.httpClient
              .post(`${host}General/SaveVoucherContractPurchase`, formData, { headers })
              .subscribe((res: any) => {
                if (res.Result.Success) {
                  this.alertUtil.alertOkCallback('Confirmación',
                    'Se ha guardado el comprobante de pago correctamente.',
                    () => {
                      this.ConsultarPorId();
                    })
                } else {
                  this.alertUtil.alertError("ERROR!", res.Result.Message);
                }
              }, (err: any) => {
                console.log(err);
                this.spinner.hide();
                this.alertUtil.alertError("ERROR!", this.mensajeGenerico);
              });
          });
      } else {
        this.alertUtil.alertWarning('Validación', 'Por favor adjuntar un voucher de pago.');
      }
    }
  }

  Cancelar() {
    this.router.navigate(['/general/operaciones/documentopago/list']);
  }

  ConfirmarDeposito() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de confirmar la liquidación del documento de pago?',
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.generalService.ConfirmarVoucherPagoContratoCompra(request)
          .subscribe((res) => {
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha confirmado la liquidación del documento de pago correctamente.',
                () => {
                  this.ConsultarPorId();
                })
            } else {
              this.alertUtil.alertError("ERROR!", res.Result.Message);
            }
          }, (err) => {
            console.log(err);
            this.spinner.hide();
            this.alertUtil.alertError("ERROR!", this.mensajeGenerico);
          })
      });
  }
}
