import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

import { GuiaremisionService } from '../../../../../../services/guiaremision.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { NotaingresoplantaService } from '../../../../../../services/notaingresoplanta.service';
import { MaestroService } from '../../../../../../services/maestro.service';

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
    private route: ActivatedRoute,
    private maestroService: MaestroService) {
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

  frmNotaIngresoPlantaDetalle: FormGroup;
  submitted = false;
  locId = 0;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  listOlores: any[];
  listColores: any[];
  locEstado = 0;
  oloresSels = [];
  coloresSels = [];

  ngOnInit(): void {

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
      codGuiaRemision: [],
      cafeExportacionGramos: [, Validators.required],
      cafeExportacionPorc: [, Validators.required],
      descarteGramos: [, Validators.required],
      descartePorcentaje: [, Validators.required],
      cascaraGramos: [, Validators.required],
      cascaraPorcentaje: [, Validators.required],
      totalGramos: [, Validators.required],
      totalPorcentaje: [, Validators.required],
      humedadProcenPC: [, Validators.required],
      responsable: [],
      listaOlores: [],
      listaColores: []
    });
    this.GetOlores();
    this.GetColores();
  }

  get f() {
    return this.frmNotaIngresoPlantaDetalle.controls;
  }

  async GetOlores() {
    this.listOlores = [];
    const res = await this.maestroService.obtenerMaestros('Olor').toPromise();
    if (res.Result.Success) {
      this.listOlores = res.Result.Data;
    }
  }

  async GetColores() {
    this.listColores = [];
    const res = await this.maestroService.obtenerMaestros('Color').toPromise();
    if (res.Result.Success) {
      this.listColores = res.Result.Data;
    }
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
      this.locEstado = parseInt(data.EstadoId);
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
      if (data.Responsable) {
        this.frmNotaIngresoPlantaDetalle.controls.responsable.setValue(data.Responsable);
      }
      if (data.Olores) {
        this.frmNotaIngresoPlantaDetalle.controls.listaOlores.setValue(data.Olores);
      }
      if (data.Colores) {
        this.frmNotaIngresoPlantaDetalle.controls.listaColores.setValue(data.Colores);
      }
      if (data.ExportableGramos) {
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionGramos.setValue(data.ExportableGramos);
      }
      if (data.ExportablePorcentaje) {
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionPorc.setValue(data.ExportablePorcentaje);
      }
      if (data.DescarteGramos) {
        this.frmNotaIngresoPlantaDetalle.controls.descarteGramos.setValue(data.DescarteGramos);
      }
      if (data.DescartePorcentaje) {
        this.frmNotaIngresoPlantaDetalle.controls.descartePorcentaje.setValue(data.DescartePorcentaje);
      }
      if (data.CascarillaGramos) {
        this.frmNotaIngresoPlantaDetalle.controls.cascaraGramos.setValue(data.CascarillaGramos);
      }
      if (data.CascarillaPorcentaje) {
        this.frmNotaIngresoPlantaDetalle.controls.cascaraPorcentaje.setValue(data.CascarillaPorcentaje);
      }
      if (data.TotalGramos) {
        this.frmNotaIngresoPlantaDetalle.controls.totalGramos.setValue(data.TotalGramos);
      }
      if (data.TotalPorcentaje) {
        this.frmNotaIngresoPlantaDetalle.controls.totalPorcentaje.setValue(data.TotalPorcentaje);
      }
      if (data.HumedadPorcentaje) {
        this.frmNotaIngresoPlantaDetalle.controls.humedadProcenPC.setValue(data.HumedadPorcentaje);
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

  changeOlores(e) {
    if (e.currentTarget.checked) {
      this.oloresSels.push(e.currentTarget.value);
    } else {
      this.oloresSels.splice(this.oloresSels.indexOf(e.currentTarget.value), 1);
    }

    this.frmNotaIngresoPlantaDetalle.controls.listaOlores.setValue(this.oloresSels.join(','));
  }

  changeColores(e) {
    if (e.currentTarget.checked) {
      this.coloresSels.push(e.currentTarget.value);
    } else {
      this.coloresSels.splice(this.coloresSels.indexOf(e.currentTarget.value), 1);
    }
    this.frmNotaIngresoPlantaDetalle.controls.listaColores.setValue(this.coloresSels.join(','));
  }
}
