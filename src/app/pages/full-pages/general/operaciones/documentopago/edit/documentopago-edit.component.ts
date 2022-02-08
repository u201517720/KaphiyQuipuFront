import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

import { AlertUtil } from '../../../../../../Services/util/alert-util';
import { GeneralService } from '../../../../../../Services/general.service';

@Component({
  selector: 'app-documentopago-edit',
  templateUrl: './documentopago-edit.component.html',
  styleUrls: ['./documentopago-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentopagoEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private alertUtil: AlertUtil) { }

  frmDocumentoPagoEdit: FormGroup;
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
    this.frmDocumentoPagoEdit = this.fb.group({
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
    return this.frmDocumentoPagoEdit.controls;
  }

  ConsultarPorId() {
    this.spinner.show();
    const request = { Id: this.locId }
    this.generalService.ConsultarDocumentoPagoPorId(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res.Result.Success) {
          this.locEstado = parseInt(res.Result.Data.EstadoId);
          this.frmDocumentoPagoEdit.controls.correlativo.setValue(res.Result.Data.CorrelativoDPA);
          this.frmDocumentoPagoEdit.controls.nroContrato.setValue(res.Result.Data.CorrelativoCC);
          this.frmDocumentoPagoEdit.controls.rucEmpresa.setValue(res.Result.Data.Ruc);
          this.frmDocumentoPagoEdit.controls.fechaRegistro.setValue(res.Result.Data.Fecha);
          this.frmDocumentoPagoEdit.controls.agricultor.setValue(res.Result.Data.Agricultor);
          this.frmDocumentoPagoEdit.controls.motivo.setValue(res.Result.Data.Motivo);
          this.frmDocumentoPagoEdit.controls.tipoDocumento.setValue(res.Result.Data.TipoDocumento);
          this.frmDocumentoPagoEdit.controls.nroDocumento.setValue(res.Result.Data.NumeroDocumento);
          this.frmDocumentoPagoEdit.controls.estado.setValue(res.Result.Data.CorrelativoDPA);
          this.frmDocumentoPagoEdit.controls.totalPagar.setValue(res.Result.Data.MontoPago);
          this.frmDocumentoPagoEdit.controls.fileName.setValue(res.Result.Data.NombreArchivo);
        } else {

        }
      }, (err) => {
        this.spinner.hide();
      });
  }

  fileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.frmDocumentoPagoEdit.patchValue({
        file: event.target.files[0]
      });
      this.frmDocumentoPagoEdit.get('file').updateValueAndValidity()
    }
  }

  Guardar() {

  }
  
  Cancelar() {

  }
}
