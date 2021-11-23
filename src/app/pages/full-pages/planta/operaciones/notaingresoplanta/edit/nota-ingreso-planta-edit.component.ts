import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

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
  oloresSeleccionados = '';
  coloresSeleccionados = '';

  constructor(private fb: FormBuilder,
    private guiaremisionService: GuiaremisionService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private notaingresoplantaService: NotaingresoplantaService,
    private route: ActivatedRoute,
    private maestroService: MaestroService,
    private router: Router) {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    this.LoadForm();
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    if (this.locId > 0) {
      this.ConsultarPorId();
    } else {

    }
  }

  ngOnInit(): void {
    // if (!this.locId) {
    //   this.GetOlores();
    //   this.GetColores();
    // }
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

  ConsultarPorId() {
    this.spinner.show();
    this.notaingresoplantaService.ConsultarPorId({ Id: this.locId })
      .subscribe((res) => {
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

  async CompletarForm(data) {
    if (data) {
      this.locEstado = parseInt(data.EstadoId);
      await this.GetOlores();
      await this.GetColores();
      if (data.Olores) {
        this.oloresSeleccionados = data.Olores;
      }
      if (data.Colores) {
        this.coloresSeleccionados = data.Colores;
      }
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
      if (this.userSession.RolId == 11) {
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
      } else if (this.userSession.RolId == 12) {
        if (this.frmNotaIngresoPlantaDetalle.value.listaOlores) {
          if (this.frmNotaIngresoPlantaDetalle.value.listaColores) {
            this.alertUtil.alertSiNoCallback('Pregunta',
              '¿Está seguro de guardar los resultados ingresados?',
              () => {
                this.spinner.show();
                const request = {
                  Id: this.locId,
                  Olores: this.frmNotaIngresoPlantaDetalle.value.listaOlores,
                  Colores: this.frmNotaIngresoPlantaDetalle.value.listaColores,
                  ExportableGramos: this.frmNotaIngresoPlantaDetalle.value.cafeExportacionGramos,
                  ExportablePorcentaje: this.frmNotaIngresoPlantaDetalle.value.cafeExportacionPorc,
                  DescarteGramos: this.frmNotaIngresoPlantaDetalle.value.descarteGramos,
                  DescartePorcentaje: this.frmNotaIngresoPlantaDetalle.value.descartePorcentaje,
                  CascarillaGramos: this.frmNotaIngresoPlantaDetalle.value.cascaraGramos,
                  CascarillaPorcentaje: this.frmNotaIngresoPlantaDetalle.value.cascaraPorcentaje,
                  TotalGramos: this.frmNotaIngresoPlantaDetalle.value.totalGramos,
                  TotalPorcentaje: this.frmNotaIngresoPlantaDetalle.value.totalPorcentaje,
                  HumedadPorcentaje: this.frmNotaIngresoPlantaDetalle.value.humedadProcenPC,
                  UsuarioActualizacion: this.userSession.NombreUsuario
                }

                this.notaingresoplantaService.RegistrarControlCalidad(request)
                  .subscribe((res) => {
                    this.spinner.hide();
                    if (res.Result.Success) {
                      this.alertUtil.alertOk('Confirmación', 'Se ha guardado los resultados de calidad correctamente.');
                    } else {
                      this.alertUtil.alertError('ERROR', res.Result.Message);
                    }
                  }, (err) => {
                    this.spinner.hide();
                    this.alertUtil.alertError('ERROR', this.mensajeGenerico);
                  });
              });
          } else {
            this.alertUtil.alertWarning('Validación', 'Seleccionar como minimo un color del análisis fisico.');
          }
        } else {
          this.alertUtil.alertWarning('Validación', 'Seleccionar como minimo un olor del análisis fisico.');
        }
      }
    } else {
      this.submitted = true;
    }
  }

  Cancelar() {
    this.router.navigate(['/planta/operaciones/notaingreso/list']);
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

  CalcularAnalisisFisico() {
    const locCafeExport = this.frmNotaIngresoPlantaDetalle.value.cafeExportacionGramos ? this.frmNotaIngresoPlantaDetalle.value.cafeExportacionGramos : 0;
    const locDescarte = this.frmNotaIngresoPlantaDetalle.value.descarteGramos ? this.frmNotaIngresoPlantaDetalle.value.descarteGramos : 0;
    const locCascara = this.frmNotaIngresoPlantaDetalle.value.cascaraGramos ? this.frmNotaIngresoPlantaDetalle.value.cascaraGramos : 0;
    const suma = locCafeExport + locDescarte + locCascara;
    if (suma) {
      this.frmNotaIngresoPlantaDetalle.controls.totalGramos.setValue(suma);
    }

    let loccafeExportacionPorc = 0, locdescartePorcentaje = 0, loccascaraPorcentaje = 0;

    if (locCafeExport && suma) {
      loccafeExportacionPorc = ((locCafeExport * 100) / suma);
    }

    if (locDescarte && suma) {
      locdescartePorcentaje = ((locDescarte * 100) / suma);
    }

    if (locCascara && suma) {
      loccascaraPorcentaje = ((locCascara * 100) / suma);
    }

    if (loccafeExportacionPorc) {
      this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionPorc.setValue(loccafeExportacionPorc);
    } else {
      this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionPorc.reset();
    }
    if (locdescartePorcentaje) {
      this.frmNotaIngresoPlantaDetalle.controls.descartePorcentaje.setValue(locdescartePorcentaje);
    } else {
      this.frmNotaIngresoPlantaDetalle.controls.descartePorcentaje.reset();
    }
    if (loccascaraPorcentaje) {
      this.frmNotaIngresoPlantaDetalle.controls.cascaraPorcentaje.setValue(loccascaraPorcentaje);
    } else {
      this.frmNotaIngresoPlantaDetalle.controls.cascaraPorcentaje.reset();
    }

    const locCafeExpoPorc = this.frmNotaIngresoPlantaDetalle.value.cafeExportacionPorc ?? 0;
    const locDescPorcen = this.frmNotaIngresoPlantaDetalle.value.descartePorcentaje ?? 0;
    const locCascaraPorc = this.frmNotaIngresoPlantaDetalle.value.cascaraPorcentaje ?? 0;

    const suma2 = locCafeExpoPorc + locDescPorcen + locCascaraPorc;
    if (suma2) {
      this.frmNotaIngresoPlantaDetalle.controls.totalPorcentaje.setValue(suma2);
    }
  }

  ConfirmarRecepcion() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      `¿Está seguro de confirmar la recepción de ${this.frmNotaIngresoPlantaDetalle.value.numeroSacos} sacos de materia prima?`,
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.notaingresoplantaService.ConfirmarRecepcionMateriaPrima(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha confirmado la recepción de los ${this.frmNotaIngresoPlantaDetalle.value.numeroSacos} sacos de materia prima.`,
                () => {
                  this.ConsultarPorId();
                });
            } else {
              this.alertUtil.alertError('ERROR', res.Result.Message);
            }
          }, () => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

  ImprimirEtiquetas() {

  }

  FinalizarEtiquetado() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      `¿Está seguro de finalizar el etiquetado?`,
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.notaingresoplantaService.FinalizarEtiquetado(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha confirmado la finalización del etiquetado manual.`,
                () => {
                  this.ConsultarPorId();
                });
            } else {
              this.alertUtil.alertError('ERROR', res.Result.Message);
            }
          }, () => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

  AutorizarTransformacion() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      `¿Está seguro de iniciar el procesamiento de la materia prima?`,
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.notaingresoplantaService.AutorizarTransformacion(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha confirmado el inicio del procesamiento de la materia prima.`,
                () => {
                  this.ConsultarPorId();
                });
            } else {
              this.alertUtil.alertError('ERROR', res.Result.Message);
            }
          }, () => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }
}
