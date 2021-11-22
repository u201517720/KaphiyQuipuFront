import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { GuiaremisionService } from '../../../../../../services/guiaremision.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { NotaingresoplantaService } from '../../../../../../services/notaingresoplanta.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nota-ingreso-planta-edit',
  templateUrl: './nota-ingreso-planta-edit.component.html',
  styleUrls: ['./nota-ingreso-planta-edit.component.scss']
})
export class NotaIngresoPlantaEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private guiaremisionService: GuiaremisionService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private notaingresoplantaService: NotaingresoplantaService,
    private route: ActivatedRoute) { }

  frmNotaIngresoPlantaDetalle: FormGroup;
  submitted = false;
  locId = 0;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';

  ngOnInit(): void {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    this.LoadForm()
    if (this.locId > 0) {
      this.ConsultarPorId();
    } else {

    }
  }

  LoadForm() {
    this.frmNotaIngresoPlantaDetalle = this.fb.group({
      correlativo: [],
      FechaRegistro: [],
      nroGuiaRemision: [, Validators.required],
      cliente: [],
      direccion: [],
      certificacion: [],
      transportista: [],
      vehiculo: [],
      producto: [],
      numeroSacos: [],
      kilosBrutos: [],
      tara: [],
      kilosNetos: [],
      observaciones: [],
      codGuiaRemision: []
    });
  }

  get f() {
    return this.frmNotaIngresoPlantaDetalle.controls;
  }

  BuscarGuiaRemision(e) {
    if (e && e.keyCode === 13) {
      this.ConsultarGuiaRemision();
    }
  }

  ConsultarGuiaRemision() {
    if (!this.frmNotaIngresoPlantaDetalle.invalid) {
      this.spinner.show();
      this.guiaremisionService.ConsultarPorCorrelativo({ Correlativo: this.frmNotaIngresoPlantaDetalle.value.nroGuiaRemision })
        .subscribe((res) => {
          this.spinner.hide();
          if (res.Result.Success) {
            this.CompletarForm(res.Result.Data);
          }
        }, (err) => {
          this.spinner.hide();
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        })
    } else {
      this.submitted = true;
    }
  }

  CompletarForm(data) {
    if (data) {
      if (data.Correlativo) {
        this.frmNotaIngresoPlantaDetalle.controls.nroGuiaRemision.setValue(data.Correlativo);
      }
      if (data.CorrelativoGRA) {
        this.frmNotaIngresoPlantaDetalle.controls.nroGuiaRemision.setValue(data.CorrelativoGRA);
      }
      this.frmNotaIngresoPlantaDetalle.controls.codGuiaRemision.setValue(data.GuiaRemisionId);
      this.frmNotaIngresoPlantaDetalle.controls.cliente.setValue(data.Empresa);
      this.frmNotaIngresoPlantaDetalle.controls.direccion.setValue(data.EmpresaDireccion);
      this.frmNotaIngresoPlantaDetalle.controls.certificacion.setValue(data.Certificacion);
      this.frmNotaIngresoPlantaDetalle.controls.transportista.setValue(data.Conductor);
      this.frmNotaIngresoPlantaDetalle.controls.vehiculo.setValue(data.PlacaTractor);
      this.frmNotaIngresoPlantaDetalle.controls.producto.setValue(data.Producto);
      this.frmNotaIngresoPlantaDetalle.controls.numeroSacos.setValue(data.TotalSacos);
      this.frmNotaIngresoPlantaDetalle.controls.kilosBrutos.setValue(data.KilosBrutosPC);
      this.frmNotaIngresoPlantaDetalle.controls.tara.setValue(data.TaraSacoPC);
      this.frmNotaIngresoPlantaDetalle.controls.kilosNetos.setValue(data.KilosNetos);
      if (data.Observaciones) {
        this.frmNotaIngresoPlantaDetalle.controls.observaciones.setValue(data.Observaciones);
      }
      if (data.FechaRegistro) {
        this.frmNotaIngresoPlantaDetalle.controls.FechaRegistro.setValue(data.FechaRegistro);
      }
    }
    this.spinner.hide();
  }

  Guardar() {
    if (!this.frmNotaIngresoPlantaDetalle.invalid) {
      this.alertUtil.alertSiNoCallback('Pregunta',
        '¿Está seguro de generar la nota de ingreso?',
        () => {
          this.spinner.show();
          const request = {
            GuiaRemisionAcopioId: this.frmNotaIngresoPlantaDetalle.value.codGuiaRemision,
            Observaciones: this.frmNotaIngresoPlantaDetalle.value.observaciones,
            UsuarioRegistro: this.userSession.NombreUsuario
          };
          this.notaingresoplantaService.Registrar(request)
            .subscribe((res) => {
              this.spinner.hide();
              if (res.Result.Success) {
                this.alertUtil.alertOk('Confirmación', `Se ha generado la nota de ingreso ${res.Result.Data}.`);
              } else {
                this.alertUtil.alertError('ERROR', res.Result.Message);
              }
            }, (err) => {
              this.spinner.hide();
              this.alertUtil.alertError('ERROR', this.mensajeGenerico);
            });
        });
    } else {
      this.submitted = true;
    }
  }

  ConsultarPorId() {
    this.spinner.show();
    this.notaingresoplantaService.ConsultarPorId({ Id: this.locId })
      .subscribe((res) => {
        this.spinner.hide();
        if (res.Result.Success) {
          this.CompletarForm(res.Result.Data);
        } else {
          this.alertUtil.alertError('ERROR', res.Result.Message);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      })
  }

  Cancelar() {

  }
}
