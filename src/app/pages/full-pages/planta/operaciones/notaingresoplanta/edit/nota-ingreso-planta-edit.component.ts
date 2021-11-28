import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { GuiaremisionService } from '../../../../../../services/guiaremision.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { NotaingresoplantaService } from '../../../../../../services/notaingresoplanta.service';
import { MaestroService } from '../../../../../../services/maestro.service';
import { NotasalidaplantaService } from '../../../../../../services/notasalidaplanta.service';

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
  activeTab = 1;

  constructor(private fb: FormBuilder,
    private guiaremisionService: GuiaremisionService,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private notaingresoplantaService: NotaingresoplantaService,
    private route: ActivatedRoute,
    private maestroService: MaestroService,
    private router: Router,
    private notasalidaplantaService: NotasalidaplantaService) {
    this.locId = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : 0;
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
      pesoPorSaco: [],

      cafeExportacionGramos: [],
      cafeExportacionPorc: [],
      descarteGramos: [],
      descartePorcentaje: [],
      cascaraGramos: [],
      cascaraPorcentaje: [],
      totalGramos: [],
      totalPorcentaje: [],
      humedadProcenPC: [],

      responsable: [],
      listaOlores: [],
      listaColores: [],

      cafeExportSacos: [],
      cafeExportKilos: [],
      cafeExportKgNetos: [],
      cafeExportQQS: [],
      cafeExportPorc: [],

      cafeExportMCSacos: [],
      cafeExportMCKilos: [],
      cafeExportMCKgNetos: [],
      cafeExportMCQQS: [],
      cafeExportMCPorc: [],

      cafeSegundaSacos: [],
      cafeSegundaKilos: [],
      cafeSegundaKgNetos: [],
      cafeSegundaQQS: [],
      cafeSegundaPorc: [],

      cafeDescarteMaquinaSacos: [],
      cafeDescarteMaquinaKilos: [],
      cafeDescarteMaquinaKgNetos: [],
      cafeDescarteMaquinaQQS: [],
      cafeDescarteMaquinaPorcen: [],

      cafeDescarteEscojoSacos: [],
      cafeDescarteEscojoKilos: [],
      cafeDescarteEscojoKgNetos: [],
      cafeDescarteEscojoQQS: [],
      cafeDescarteEscojoPorcen: [],

      cafeBolaSacos: [],
      cafeBolaKilos: [],
      cafeBolaKgNetos: [],
      cafeBolaQQS: [],
      cafeBolaPorcen: [],

      cafeCiscoSacos: [],
      cafeCiscoKilos: [],
      cafeCiscoKgNetos: [],
      cafeCiscoQQS: [],
      cafeCiscoPorcen: [],

      totalCafeSacos: [],
      totalCafeKilos: [],
      totalCafeKgNetos: [],
      totalCafeQQS: [],
      totalCafePorcen: [],

      piedrasOtrosSacos: [],
      piedrasOtrosKilos: [],
      piedrasOtrosKgNetos: [],
      piedrasOtrosQQS: [],
      piedrasOtrosPorcen: [],

      cascaraOtrosSacos: [],
      cascaraOtrosKilos: [],
      cascaraOtrosKgNetos: [],
      cascaraOtrosQQS: [],
      cascaraOtrosPorcen: [],

      totalesSacos: [],
      totalesKilos: [],
      totalesKgNetos: [],
      totalesQQS: [],
      totalesPorcen: []
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
            if (!res.Result.Data) {
              this.frmNotaIngresoPlantaDetalle.reset();
            }
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
      this.locEstado = data.EstadoId ? parseInt(data.EstadoId) : 0;
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
      if (data.PesoSaco) {
        this.frmNotaIngresoPlantaDetalle.controls.pesoPorSaco.setValue(data.PesoSaco);
      }
      if (data.CorrelativoGRA) {
        this.frmNotaIngresoPlantaDetalle.controls.nroGuiaRemision.setValue(data.CorrelativoGRA);
      }
      if (this.locEstado >= 6) {
        this.activeTab = 2;
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

      if (this.locEstado >= 7) {
        if (data.CafeExportacionSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeExportSacos.setValue(data.CafeExportacionSacos);
        if (data.CafeExportacionKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeExportKilos.setValue(data.CafeExportacionKilos);
        if (data.CafeExportacionMCSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCSacos.setValue(data.CafeExportacionMCSacos);
        if (data.CafeExportacionMCKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCKilos.setValue(data.CafeExportacionMCKilos);
        if (data.CafeSegundaSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaSacos.setValue(data.CafeSegundaSacos);
        if (data.CafeSegundaKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaKilos.setValue(data.CafeSegundaKilos);
        if (data.CafeDescarteMaquinaSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaSacos.setValue(data.CafeDescarteMaquinaSacos);
        if (data.CafeDescarteMaquinaKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaKilos.setValue(data.CafeDescarteMaquinaKilos);
        if (data.CafeDescarteEscojoSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoSacos.setValue(data.CafeDescarteEscojoSacos);
        if (data.CafeDescarteEscojoKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoKilos.setValue(data.CafeDescarteEscojoKilos);
        if (data.CafeBolaSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeBolaSacos.setValue(data.CafeBolaSacos);
        if (data.CafeBolaKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeBolaKilos.setValue(data.CafeBolaKilos);
        if (data.CafeCiscoSacos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoSacos.setValue(data.CafeCiscoSacos);
        if (data.CafeCiscoKilos)
          this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoKilos.setValue(data.CafeCiscoKilos);
        if (data.TotalCafeSacos)
          this.frmNotaIngresoPlantaDetalle.controls.totalCafeSacos.setValue(data.TotalCafeSacos);
        if (data.TotalCafeKgNetos)
          this.frmNotaIngresoPlantaDetalle.controls.totalCafeKgNetos.setValue(data.TotalCafeKgNetos);
        if (data.PiedraOtrosKgNetos)
          this.frmNotaIngresoPlantaDetalle.controls.piedrasOtrosKgNetos.setValue(data.PiedraOtrosKgNetos);
        if (data.CascaraOtrosKgNetos)
          this.frmNotaIngresoPlantaDetalle.controls.cascaraOtrosKgNetos.setValue(data.CascaraOtrosKgNetos);
        this.CalcularResultadosProcesos();
      }

      if (this.locEstado === 1) {
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionGramos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionPorc.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.descarteGramos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.descartePorcentaje.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cascaraGramos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cascaraPorcentaje.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.totalGramos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.totalPorcentaje.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.humedadProcenPC.setValidators(Validators.required);

        this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionGramos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportacionPorc.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.descarteGramos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.descartePorcentaje.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cascaraGramos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cascaraPorcentaje.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.totalGramos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.totalPorcentaje.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.humedadProcenPC.updateValueAndValidity();
      } else if (this.locEstado === 2) {
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoSacos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoKilos.setValidators(Validators.required);
        this.frmNotaIngresoPlantaDetalle.controls.piedrasOtrosKgNetos.setValidators(Validators.required);

        this.frmNotaIngresoPlantaDetalle.controls.cafeExportSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoSacos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoKilos.updateValueAndValidity();
        this.frmNotaIngresoPlantaDetalle.controls.piedrasOtrosKgNetos.updateValueAndValidity();
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
                  this.alertUtil.alertOkCallback('Confirmación',
                    `Se ha generado la nota de ingreso ${res.Result.Data}.`,
                    () => {
                      this.Cancelar();
                    });
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
                      this.alertUtil.alertOkCallback('Confirmación',
                        'Se ha guardado los resultados de calidad correctamente.',
                        () => {
                          this.ConsultarPorId();
                        });
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
      } else if (this.userSession.RolId == 14 && this.locEstado === 6) {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de guardar los resultados ingresados?',
          () => {
            this.spinner.show();
            const request = {
              NotaIngresoPlantaId: this.locId,
              CafeExportacionSacos: this.frmNotaIngresoPlantaDetalle.value.cafeExportSacos,
              CafeExportacionKilos: this.frmNotaIngresoPlantaDetalle.value.cafeExportKilos,
              CafeExportacionMCSacos: this.frmNotaIngresoPlantaDetalle.value.cafeExportMCSacos,
              CafeExportacionMCKilos: this.frmNotaIngresoPlantaDetalle.value.cafeExportMCKilos,
              CafeSegundaSacos: this.frmNotaIngresoPlantaDetalle.value.cafeSegundaSacos,
              CafeSegundaKilos: this.frmNotaIngresoPlantaDetalle.value.cafeSegundaKilos,
              CafeDescarteMaquinaSacos: this.frmNotaIngresoPlantaDetalle.value.cafeDescarteMaquinaSacos,
              CafeDescarteMaquinaKilos: this.frmNotaIngresoPlantaDetalle.value.cafeDescarteMaquinaKilos,
              CafeDescarteEscojoSacos: this.frmNotaIngresoPlantaDetalle.value.cafeDescarteEscojoSacos,
              CafeDescarteEscojoKilos: this.frmNotaIngresoPlantaDetalle.value.cafeDescarteEscojoKilos,
              CafeBolaSacos: this.frmNotaIngresoPlantaDetalle.value.cafeBolaSacos,
              CafeBolaKilos: this.frmNotaIngresoPlantaDetalle.value.cafeBolaKilos,
              CafeCiscoSacos: this.frmNotaIngresoPlantaDetalle.value.cafeCiscoSacos,
              CafeCiscoKilos: this.frmNotaIngresoPlantaDetalle.value.cafeCiscoKilos,
              TotalCafeSacos: this.frmNotaIngresoPlantaDetalle.value.totalCafeSacos,
              TotalCafeKgNetos: this.frmNotaIngresoPlantaDetalle.value.totalCafeKgNetos,
              PiedraOtrosKgNetos: this.frmNotaIngresoPlantaDetalle.value.piedrasOtrosKgNetos,
              CascaraOtrosKgNetos: this.frmNotaIngresoPlantaDetalle.value.cascaraOtrosKgNetos,
              UsuarioRegistro: this.userSession.NombreUsuario
            }
            this.notaingresoplantaService.RegistrarResultadosTransformacion(request)
              .subscribe((res) => {
                if (res.Result.Success) {
                  this.alertUtil.alertOkCallback('Confirmación',
                    'Se han guardado los resultados ingresados.',
                    () => {
                      this.ConsultarPorId();
                    });
                } else {
                  this.alertUtil.alertError('ERROR', res.Result.Message);
                }
              }, (err) => {
                this.spinner.hide();
                this.alertUtil.alertError('ERROR', this.mensajeGenerico);
              });
          });
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

  CalcularResultadosProcesos() {
    const kilosXSaco = this.frmNotaIngresoPlantaDetalle.value.numeroSacos;
    const totalKilos = this.frmNotaIngresoPlantaDetalle.value.kilosBrutos;
    const locPesoSaco = this.frmNotaIngresoPlantaDetalle.value.pesoPorSaco
    let locKilosnetos, locPorcentaje, locTotalSacos = 0, locTotalPorcentaje = 0, locTotalCafeKgnetos = 0, locTotalesPorcen = 0;

    let locCafeExporSacos = this.frmNotaIngresoPlantaDetalle.value.cafeExportSacos;
    const locCafeExporKilos = this.frmNotaIngresoPlantaDetalle.value.cafeExportKilos;

    //PRIMERA FILA
    if (locCafeExporSacos) {
      locCafeExporSacos = locCafeExporSacos * locPesoSaco;
      locTotalSacos = locTotalSacos + locCafeExporSacos;
      if (locCafeExporKilos) {
        locKilosnetos = locCafeExporSacos + locCafeExporKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportKgNetos.setValue(locKilosnetos);
      } else {
        locKilosnetos = locCafeExporSacos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportKgNetos.setValue(locKilosnetos);
      }
    } else {
      locKilosnetos = 0;
      this.frmNotaIngresoPlantaDetalle.controls.cafeExportKgNetos.reset();
    }

    locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

    if (locKilosnetos) {
      locPorcentaje = (locKilosnetos * 100) / totalKilos;
      this.frmNotaIngresoPlantaDetalle.controls.cafeExportPorc.setValue(parseFloat(locPorcentaje.toFixed(2)));
    } else {
      locPorcentaje = 0;
      this.frmNotaIngresoPlantaDetalle.controls.cafeExportPorc.reset();
    }

    locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

    if (locTotalCafeKgnetos < totalKilos) {
      //SEGUNDA FILA
      let locCafeExporMCSacos = this.frmNotaIngresoPlantaDetalle.value.cafeExportMCSacos;
      const locCafeExporMCKilos = this.frmNotaIngresoPlantaDetalle.value.cafeExportMCKilos;

      if (locCafeExporMCSacos) {
        locCafeExporMCSacos = locCafeExporMCSacos * locPesoSaco;
        locTotalSacos = locTotalSacos + locCafeExporMCSacos;
        if (locCafeExporMCKilos) {
          locKilosnetos = locCafeExporMCSacos + locCafeExporMCKilos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCKgNetos.setValue(locKilosnetos);
        } else {
          locKilosnetos = locCafeExporMCSacos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCKgNetos.setValue(locKilosnetos);
        }
      } else {
        locKilosnetos = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCKgNetos.reset();
      }

      locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

      if (locKilosnetos) {
        locPorcentaje = (locKilosnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCPorc.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeExportMCPorc.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      //TERCERA FILA
      let locCafeSegundaSacos = this.frmNotaIngresoPlantaDetalle.value.cafeSegundaSacos;
      const locCafeSegundaKilos = this.frmNotaIngresoPlantaDetalle.value.cafeSegundaKilos;

      if (locCafeSegundaSacos) {
        locCafeSegundaSacos = locCafeSegundaSacos * locPesoSaco;
        locTotalSacos = locTotalSacos + locCafeSegundaSacos;
        if (locCafeSegundaKilos) {
          locKilosnetos = locCafeSegundaSacos + locCafeSegundaKilos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaKgNetos.setValue(locKilosnetos);
        } else {
          locKilosnetos = locCafeSegundaSacos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaKgNetos.setValue(locKilosnetos);
        }
      } else {
        locKilosnetos = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaKgNetos.reset();
      }

      locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

      if (locKilosnetos) {
        locPorcentaje = (locKilosnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaPorc.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeSegundaPorc.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      //CUARTA FILA
      let locCafeDesMaquinaSacos = this.frmNotaIngresoPlantaDetalle.value.cafeDescarteMaquinaSacos;
      const locCafeDesMaquinaKilos = this.frmNotaIngresoPlantaDetalle.value.cafeDescarteMaquinaKilos;

      if (locCafeDesMaquinaSacos) {
        locCafeDesMaquinaSacos = locCafeDesMaquinaSacos * locPesoSaco;
        locTotalSacos = locTotalSacos + locCafeDesMaquinaSacos;
        if (locCafeDesMaquinaKilos) {
          locKilosnetos = locCafeDesMaquinaSacos + locCafeDesMaquinaKilos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaKgNetos.setValue(locKilosnetos);
        } else {
          locKilosnetos = locCafeDesMaquinaSacos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaKgNetos.setValue(locKilosnetos);
        }
      } else {
        locKilosnetos = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaKgNetos.reset();
      }

      locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

      if (locKilosnetos) {
        locPorcentaje = (locKilosnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaPorcen.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteMaquinaPorcen.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      //QUINTA FILA
      let locCafeDesEscojoSacos = this.frmNotaIngresoPlantaDetalle.value.cafeDescarteEscojoSacos;
      const locCafeDesEscojoKilos = this.frmNotaIngresoPlantaDetalle.value.cafeDescarteEscojoKilos;

      if (locCafeDesEscojoSacos) {
        locCafeDesEscojoSacos = locCafeDesEscojoSacos * locPesoSaco;
        locTotalSacos = locTotalSacos + locCafeDesEscojoSacos;
        if (locCafeDesEscojoKilos) {
          locKilosnetos = locCafeDesEscojoSacos + locCafeDesEscojoKilos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoKgNetos.setValue(locKilosnetos);
        } else {
          locKilosnetos = locCafeDesEscojoSacos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoKgNetos.setValue(locKilosnetos);
        }
      } else {
        locKilosnetos = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoKgNetos.reset();
      }

      locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

      if (locKilosnetos) {
        locPorcentaje = (locKilosnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoPorcen.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeDescarteEscojoPorcen.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      //SEXTA FILA
      let locCafeBolaSacos = this.frmNotaIngresoPlantaDetalle.value.cafeBolaSacos;
      const locCafeBolaKilos = this.frmNotaIngresoPlantaDetalle.value.cafeBolaKilos;

      if (locCafeBolaSacos) {
        locCafeBolaSacos = locCafeBolaSacos * locPesoSaco;
        locTotalSacos = locTotalSacos + locCafeBolaSacos;
        if (locCafeBolaKilos) {
          locKilosnetos = locCafeBolaSacos + locCafeBolaKilos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeBolaKgNetos.setValue(locKilosnetos);
        } else {
          locKilosnetos = locCafeBolaSacos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeBolaKgNetos.setValue(locKilosnetos);
        }
      } else {
        locKilosnetos = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaKgNetos.reset();
      }

      locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

      if (locKilosnetos) {
        locPorcentaje = (locKilosnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaPorcen.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeBolaPorcen.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      //SEPTIMA FILA
      let locCafeCiscoSacos = this.frmNotaIngresoPlantaDetalle.value.cafeCiscoSacos;
      const locCafeCiscoKilos = this.frmNotaIngresoPlantaDetalle.value.cafeCiscoKilos;

      if (locCafeCiscoSacos) {
        locCafeCiscoSacos = locCafeCiscoSacos * locPesoSaco;
        locTotalSacos = locTotalSacos + locCafeCiscoSacos;
        if (locCafeCiscoKilos) {
          locKilosnetos = locCafeCiscoSacos + locCafeCiscoKilos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoKgNetos.setValue(locKilosnetos);
        } else {
          locKilosnetos = locCafeCiscoSacos;
          this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoKgNetos.setValue(locKilosnetos);
        }
      } else {
        locKilosnetos = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoKgNetos.reset();
      }

      locTotalCafeKgnetos = locTotalCafeKgnetos + locKilosnetos;

      if (locKilosnetos) {
        locPorcentaje = (locKilosnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoPorcen.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cafeCiscoPorcen.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      const locPiedrasOtrosKgNetos = this.frmNotaIngresoPlantaDetalle.value.piedrasOtrosKgNetos;
      if (locPiedrasOtrosKgNetos) {
        locPorcentaje = (locPiedrasOtrosKgNetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.piedrasOtrosPorcen.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.piedrasOtrosPorcen.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      //RESTO
      if (locTotalSacos) {
        this.frmNotaIngresoPlantaDetalle.controls.totalCafeSacos.setValue(locTotalSacos);
      } else {
        this.frmNotaIngresoPlantaDetalle.controls.totalCafeSacos.reset();
      }

      if (locTotalCafeKgnetos) {
        this.frmNotaIngresoPlantaDetalle.controls.totalCafeKgNetos.setValue(parseFloat(locTotalCafeKgnetos.toFixed(2)));
        this.frmNotaIngresoPlantaDetalle.controls.cascaraOtrosKgNetos.setValue(parseFloat((totalKilos - (locTotalCafeKgnetos + locPiedrasOtrosKgNetos)).toFixed(2)));
      } else {
        this.frmNotaIngresoPlantaDetalle.controls.cascaraOtrosKgNetos.setValue(parseFloat((totalKilos - locPiedrasOtrosKgNetos).toFixed(2)));
        this.frmNotaIngresoPlantaDetalle.controls.totalCafeKgNetos.reset();
      }

      const locCascaraOtrosKgnetos = this.frmNotaIngresoPlantaDetalle.value.cascaraOtrosKgNetos;

      if (locCascaraOtrosKgnetos) {
        locPorcentaje = (locCascaraOtrosKgnetos * 100) / totalKilos;
        this.frmNotaIngresoPlantaDetalle.controls.cascaraOtrosPorcen.setValue(parseFloat(locPorcentaje.toFixed(2)));
      } else {
        locPorcentaje = 0;
        this.frmNotaIngresoPlantaDetalle.controls.cascaraOtrosPorcen.reset();
      }

      locTotalPorcentaje = locTotalPorcentaje + locPorcentaje;

      if (locTotalPorcentaje) {
        this.frmNotaIngresoPlantaDetalle.controls.totalesPorcen.setValue(parseFloat(locTotalPorcentaje.toFixed(2)));
      } else {
        this.frmNotaIngresoPlantaDetalle.controls.totalesPorcen.reset();
      }

      if (locTotalCafeKgnetos) {
        if (locCascaraOtrosKgnetos) {
          if (locPiedrasOtrosKgNetos) {
            this.frmNotaIngresoPlantaDetalle.controls.totalesKgNetos.setValue((locTotalCafeKgnetos + locCascaraOtrosKgnetos + locPiedrasOtrosKgNetos).toFixed(2));
          } else {
            this.frmNotaIngresoPlantaDetalle.controls.totalesKgNetos.setValue((locTotalCafeKgnetos + locCascaraOtrosKgnetos).toFixed(2));
          }
        } else {
          this.frmNotaIngresoPlantaDetalle.controls.totalesKgNetos.setValue(locTotalCafeKgnetos.toFixed(2));
        }
      } else {
        this.frmNotaIngresoPlantaDetalle.controls.totalesKgNetos.reset();
      }
    }
  }

  FinalizarTransformacion() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de confirmar la finalización de la transformación?',
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        }
        this.notaingresoplantaService.FinalizarTransformacion(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha confirmado la ejecución de la transformación.`,
                () => {
                  this.ConsultarPorId();
                });
            } else {
              this.alertUtil.alertError('ERROR', res.Result.Message);
            }
          }, (err) => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

  GenerarGuiaSalida() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de generar la guía de salida?',
      () => {
        this.spinner.show();
        const request = {
          NotaIngresoPlantaId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario
        }
        this.notasalidaplantaService.Registrar(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado la nota de salida ${res.Result.Data}.`,
                () => {
                  this.ConsultarPorId();
                });
            } else {
              this.alertUtil.alertError('ERROR', res.Result.Message);
            }
          }, (err) => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

}
