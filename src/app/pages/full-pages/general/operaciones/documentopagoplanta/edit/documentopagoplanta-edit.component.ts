import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertUtil } from '../../../../../../Services/util/alert-util';
import { GeneralService } from '../../../../../../Services/general.service';
import { host } from '../../../../../../shared/hosts/main.host';

@Component({
  selector: 'app-documentopagoplanta-edit',
  templateUrl: './documentopagoplanta-edit.component.html'
})
export class DocumentopagoplantaEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private alertUtil: AlertUtil) { }

  frmDocumentoPagoPlantaEdit: FormGroup;
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
    this.frmDocumentoPagoPlantaEdit = this.fb.group({
      correlativo: [],
      nroContrato: [],
      rucEmpresa: [],
      fechaRegistro: [],
      agricultor: [],
      motivo: [],
      tipoDocumento: [],
      nroDocumento: [],
      estado: [],
      totalPagar: [],
      file: [],
      fileName: []
    });
  }

  get f() {
    return this.frmDocumentoPagoPlantaEdit.controls;
  }

  ConsultarPorId() {
    this.spinner.show();
    const request = { Id: this.locId }
    this.generalService.ConsultarDocumentoPagoPorId(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res.Result.Success) {
          this.locEstado = parseInt(res.Result.Data.EstadoId);
          this.frmDocumentoPagoPlantaEdit.controls.correlativo.setValue(res.Result.Data.CorrelativoDPA);
          this.frmDocumentoPagoPlantaEdit.controls.nroContrato.setValue(res.Result.Data.CorrelativoCC);
          this.frmDocumentoPagoPlantaEdit.controls.rucEmpresa.setValue(res.Result.Data.Ruc);
          this.frmDocumentoPagoPlantaEdit.controls.fechaRegistro.setValue(res.Result.Data.Fecha);
          this.frmDocumentoPagoPlantaEdit.controls.agricultor.setValue(res.Result.Data.Agricultor);
          this.frmDocumentoPagoPlantaEdit.controls.motivo.setValue(res.Result.Data.Motivo);
          this.frmDocumentoPagoPlantaEdit.controls.tipoDocumento.setValue(res.Result.Data.TipoDocumento);
          this.frmDocumentoPagoPlantaEdit.controls.nroDocumento.setValue(res.Result.Data.NumeroDocumento);
          this.frmDocumentoPagoPlantaEdit.controls.estado.setValue(res.Result.Data.Estado);
          this.frmDocumentoPagoPlantaEdit.controls.totalPagar.setValue(res.Result.Data.MontoPago);
          if (res.Result.Data.NombreArchivo)
            this.frmDocumentoPagoPlantaEdit.controls.fileName.setValue(res.Result.Data.NombreArchivo);
        } else {

        }
      }, (err) => {
        this.spinner.hide();
      });
  }

  fileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.frmDocumentoPagoPlantaEdit.patchValue({
        file: event.target.files[0]
      });
      this.frmDocumentoPagoPlantaEdit.get('file').updateValueAndValidity()
    }
  }

  Guardar() {
    if (this.locEstado === 1) {
      if (this.frmDocumentoPagoPlantaEdit.value.file) {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de guardar el archivo seleccionado como Voucher de Pago?',
          () => {
            this.spinner.show();
            const request = {
              Id: this.locId,
              Usuario: this.userSession.NombreUsuario
            };
            const formData = new FormData();
            formData.append('file', this.frmDocumentoPagoPlantaEdit.get('file').value);
            formData.append('request', JSON.stringify(request));
            const headers = new HttpHeaders();
            headers.append('enctype', 'multipart/form-data');
            this.httpClient
              .post(`${host}General/SaveVoucher`, formData, { headers })
              .subscribe((res: any) => {
                if (res.Result.Success) {
                  this.alertUtil.alertOkCallback('Confirmación',
                    'Se ha guardado el voucher de pago correctamente.',
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
      '¿Está seguro de confirmar el pago?',
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.generalService.ConfirmarVoucherPago(request)
          .subscribe((res) => {
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha confirmado el pago correctamente.',
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
