import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoDocumentoValidator } from '../../../shared/validations/tipoDocumento.validator';
import { GeneralService } from '../../../Services/general.service';
import { MaestroService } from '../../../Services/maestro.service';
import { AlertUtil } from '../../../Services/util/alert-util';

@Component({
  selector: 'app-valoracion-agricultor',
  templateUrl: './valoracion-agricultor.component.html',
  styleUrls: ['./valoracion-agricultor.component.scss'],
})
export class ValoracionAgricultorComponent implements OnInit {

  frmValoracion: FormGroup;
  frmTitle = 'VALORACIÓN DEL CAFÉ';
  listaTipoDocumento: any[] = [];
  selectedDocumento = null;
  currentRate = 0;
  submitted = false;
  hash = '';
  isReadonly = false

  constructor(private fb: FormBuilder,
              private alertUtil: AlertUtil,
              private spinner: NgxSpinnerService,
              private maestroService: MaestroService,
              private generalService: GeneralService,
              private route: ActivatedRoute,
              private router: Router) {
    this.LoadForm();
    this.hash = this.route.snapshot.queryParams['q'];

    if (!this.hash || this.hash.length === 0) {
      this.router.navigate(['/pages/login']);
    }
  }

  ngOnInit(): void {
    this.maestroService.obtenerMaestros('TipoDocumento').subscribe((res: any) => {
      this.listaTipoDocumento = res.Result.Data;
    });
    this.submitted = false;
  }

  LoadForm() {
    this.frmValoracion = this.fb.group({
      tipoDocumento: [, Validators.required],
      nroDocumento: [, Validators.required],
      nombreApellido: [, Validators.required],
      comentario: [, Validators.required]
    }, {
      validator: TipoDocumentoValidator('tipoDocumento', 'nroDocumento')
    });
  }

  get f() {
    return this.frmValoracion.controls;
  }

  onChangeTipoDocumento(e) {

  }

  confirmarEnvioValoracion() {
    this.submitted = false;
    if (!this.frmValoracion.invalid) {
      this.alertUtil.alertRegistro('Pregunta',
        '¿Está seguro de enviar la valoración del café?', () => {
          this.enviarValoracion();
        });
    } else {
      this.submitted = true;
    }
  }

  enviarValoracion() {
    this.spinner.show();
    const request = this.RequestEnviarValoracion();
    this.generalService.GuardarValoracionClienteExterno(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res) {
          if (res.Result.Success && res.Result.Message === '') {
            this.isReadonly = true;
            this.alertUtil.alertOkCallback('Confirmación',
              `Se envió correctamente su valoración`,
              () => {
                
              });
          } else {
            this.alertUtil.alertError('ERROR', res.Result.Message);
          }
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
      });
  }

  RequestEnviarValoracion() {
    const frm = this.frmValoracion.value;
    const request = {
      Hash: this.hash,
      NroContrato: '',
      NroDocumento: frm.nroDocumento ? frm.nroDocumento : '',
      NombreCliente: frm.nombreApellido ? frm.nombreApellido : '',
      Puntaje: this.currentRate,
      Comentario: frm.comentario,
      TipoDocumento: frm.tipoDocumento
    }
    return request;
  }

}
