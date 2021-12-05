import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router"

import { MaestroService } from '../../../../../../services/maestro.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { MaestroUtil } from '../../../../../../services/util/maestro-util';
import { NotaingresoacopioService } from '../../../../../../services/notaingresoacopio.service';
import { OrdenprocesoacopioService } from '../../../../../../services/ordenprocesoacopio.service';
import { host } from '../../../../../../shared/hosts/main.host';

@Component({
  selector: 'app-ingresoalmacen-edit',
  templateUrl: './ingresoalmacen-edit.component.html',
  styleUrls: ['./ingresoalmacen-edit.component.scss', "/assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None
})

export class IngresoAlmacenEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertUtil: AlertUtil,
    private spinner: NgxSpinnerService,
    private maestroService: MaestroService,
    private notaingresoacopioService: NotaingresoacopioService,
    private maestroUtil: MaestroUtil,
    private ordenprocesoacopioService: OrdenprocesoacopioService) {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    this.LoadForm();
    if (this.locId > 0) {
      this.ConsultarPorId();
    } else {
      this.Cancelar();
    }
  }

  frmNotaIngresoAcopioDetalle: FormGroup;
  locId = 0;
  userSession: any;
  rows = [];
  limitRef = 10000;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comuníquese con el área de soporte de sistemas.';
  listOlores = [];
  listColores = [];
  detalleControlesCalidad;
  locEstado = 0;
  listaAlmacenes = [];
  selectedAlmacen: any;
  submitted = false;
  tabActive = 1;
  flagShowBtnFinalizarEtiquetado = false;

  ngOnInit(): void {
    this.GetAlmacenes();
  }

  LoadForm() {
    this.frmNotaIngresoAcopioDetalle = this.fb.group({
      correlativo: [],
      FechaRegistro: [],
      RazonSocial: [],
      EstadoGuiaRecepcion: [],
      Pais: [],
      Departamento: [],
      Moneda: [],
      UnidadMedida: [],
      TipoProduccion: [],
      Empaque: [],
      TipoEmpaque: [],
      Producto: [],
      SubProducto: [],
      Grado: [],
      Calidad: [],
      TipoCertificacion: [],
      TotalSacos: [],
      PesoSaco: [],
      PesoKilos: [],
      responsable: [],
      sacosPC: [],
      kilosBrutosPC: [],
      taraSacoPC: [],
      kilosNetosPC: [],
      qq55KgPC: [],
      cafeExportacionGramos: [],
      cafeExportacionPorc: [],
      descarteGramos: [],
      descartePorcentaje: [],
      cascaraGramos: [],
      cascaraPorcentaje: [],
      totalGramos: [],
      totalPorcentaje: [],
      humedadProcenPC: [],
      observacionesPC: [],
      ObservacionesSolicitudCompra: [],
      referencia: [],
      AlmacenId: [, Validators.required],
      CostoUnitario: [],
      costoTotal: [],
      tara: [],
      kgsNetos: []
    });
  }

  get f() {
    return this.frmNotaIngresoAcopioDetalle.controls;
  }

  ConsultarPorId() {
    this.spinner.show();
    this.notaingresoacopioService.SearchById({ NotaIngresoAcopioId: this.locId })
      .subscribe((res) => {
        if (res) {
          if (res.Result.Success) {
            this.CompletarForm(res.Result.Data);
          } else {
            this.alertUtil.alertWarningCallback('ERROR', res.Result.Message,
              () => {
                this.Cancelar();
              });
          }
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', err.Result.Message);
      })
  }

  async CompletarForm(data) {
    if (data) {
      this.locEstado = parseInt(data.EstadoId);
      await this.GetOlores();
      await this.GetColores();
      await this.GetAlmacenes();
      this.rows = data.agricultores;
      this.detalleControlesCalidad = data.controlesCalidad;
      this.frmNotaIngresoAcopioDetalle.controls.referencia.setValue(data.CorrelativoGuiaRecepcion);
      this.frmNotaIngresoAcopioDetalle.controls.correlativo.setValue(data.Correlativo);
      this.frmNotaIngresoAcopioDetalle.controls.FechaRegistro.setValue(data.FechaRegistro);
      this.frmNotaIngresoAcopioDetalle.controls.RazonSocial.setValue(data.RazonSocial);
      this.frmNotaIngresoAcopioDetalle.controls.EstadoGuiaRecepcion.setValue(data.EstadoNotaIngreso);
      this.frmNotaIngresoAcopioDetalle.controls.Pais.setValue(data.Pais);
      this.frmNotaIngresoAcopioDetalle.controls.Departamento.setValue(data.Departamento);
      this.frmNotaIngresoAcopioDetalle.controls.Moneda.setValue(data.Moneda);
      this.frmNotaIngresoAcopioDetalle.controls.UnidadMedida.setValue(data.UnidadMedida);
      this.frmNotaIngresoAcopioDetalle.controls.TipoProduccion.setValue(data.TipoProduccion);
      this.frmNotaIngresoAcopioDetalle.controls.Empaque.setValue(data.Empaque);
      this.frmNotaIngresoAcopioDetalle.controls.TipoEmpaque.setValue(data.TipoEmpaque);
      this.frmNotaIngresoAcopioDetalle.controls.Producto.setValue(data.Producto);
      this.frmNotaIngresoAcopioDetalle.controls.SubProducto.setValue(data.SubProducto);
      this.frmNotaIngresoAcopioDetalle.controls.Grado.setValue(data.Grado);
      this.frmNotaIngresoAcopioDetalle.controls.Calidad.setValue(data.Calidad);
      this.frmNotaIngresoAcopioDetalle.controls.TipoCertificacion.setValue(data.TipoCertificacion);
      this.frmNotaIngresoAcopioDetalle.controls.TotalSacos.setValue(data.TotalSacos);
      this.frmNotaIngresoAcopioDetalle.controls.PesoSaco.setValue(data.PesoSaco);
      this.frmNotaIngresoAcopioDetalle.controls.PesoKilos.setValue(data.PesoKilos);
      this.frmNotaIngresoAcopioDetalle.controls.ObservacionesSolicitudCompra.setValue(data.ObservacionesSolicitudCompra);
      this.frmNotaIngresoAcopioDetalle.controls.responsable.setValue(data.Responsable);
      this.frmNotaIngresoAcopioDetalle.controls.sacosPC.setValue(data.SacosPC);
      this.frmNotaIngresoAcopioDetalle.controls.kilosBrutosPC.setValue(data.KilosBrutosPC);
      this.frmNotaIngresoAcopioDetalle.controls.taraSacoPC.setValue(data.TaraSacoPC);
      this.frmNotaIngresoAcopioDetalle.controls.kilosNetosPC.setValue(data.KilosNetos);
      this.frmNotaIngresoAcopioDetalle.controls.qq55KgPC.setValue(data.QQ55KG);
      this.frmNotaIngresoAcopioDetalle.controls.cafeExportacionGramos.setValue(data.CafeExportacionGramosAFC);
      this.frmNotaIngresoAcopioDetalle.controls.cafeExportacionPorc.setValue(data.CafeExportacionPorcAFC);
      this.frmNotaIngresoAcopioDetalle.controls.descarteGramos.setValue(data.DescarteGramosAFC);
      this.frmNotaIngresoAcopioDetalle.controls.descartePorcentaje.setValue(data.DescartePorcAFC);
      this.frmNotaIngresoAcopioDetalle.controls.cascaraGramos.setValue(data.CascaraGramosAFC);
      this.frmNotaIngresoAcopioDetalle.controls.cascaraPorcentaje.setValue(data.CascaraPorcAFC);
      this.frmNotaIngresoAcopioDetalle.controls.totalGramos.setValue(data.TotalGramosAFC);
      this.frmNotaIngresoAcopioDetalle.controls.totalPorcentaje.setValue(data.TotalPorcAFC);
      this.frmNotaIngresoAcopioDetalle.controls.humedadProcenPC.setValue(data.Humedad);
      this.frmNotaIngresoAcopioDetalle.controls.observacionesPC.setValue(data.Observaciones);
      this.frmNotaIngresoAcopioDetalle.controls.AlmacenId.setValue(data.AlmacenId);
      this.frmNotaIngresoAcopioDetalle.controls.CostoUnitario.setValue(data.PrecioUnitario);
      this.frmNotaIngresoAcopioDetalle.controls.costoTotal.setValue(data.CostoTotal);
      this.frmNotaIngresoAcopioDetalle.controls.tara.setValue(data.Tara);
      this.frmNotaIngresoAcopioDetalle.controls.kgsNetos.setValue(data.KilosNetosContrato);
    }
    this.spinner.hide();
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

  async GetAlmacenes() {
    this.listaAlmacenes = [];
    const res = await this.maestroService.obtenerMaestros('Almacen').toPromise();
    if (res.Result.Success) {
      this.listaAlmacenes = res.Result.Data;
    }
  }

  Guardar() {
    if (this.locEstado === 1) {
      this.submitted = false;
      if (!this.frmNotaIngresoAcopioDetalle.invalid) {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de ubicar la materia prima en el almacén seleccionado?',
          () => {
            this.spinner.show();
            const request = {
              NotaIngresoAcopioId: this.locId,
              AlmacenId: this.frmNotaIngresoAcopioDetalle.value.AlmacenId,
              Usuario: this.userSession.NombreUsuario,
              Correlativo: this.frmNotaIngresoAcopioDetalle.value.correlativo,
              Almacen: this.listaAlmacenes.find(x => x.Codigo === this.selectedAlmacen).Label
            };
            this.notaingresoacopioService.UbicarAlmacen(request)
              .subscribe((res) => {
                this.spinner.hide();
                if (res) {
                  if (res.Result.Success) {
                    this.alertUtil.alertOkCallback('Confirmación',
                      'Se ha ubicado la materia prima correctamente.',
                      () => {
                        this.ConsultarPorId();
                      });
                  } else {
                    this.alertUtil.alertError('ERROR', res.Result.Message);
                  }
                } else {
                  this.alertUtil.alertError('ERROR', res.Result.Message);
                }
              }, (err) => {
                this.spinner.hide();
                console.log(err);
                this.alertUtil.alertError('ERROR', this.mensajeGenerico);
              });
          });
      } else {
        this.submitted = true;
      }
    }
  }

  Cancelar() {
    this.router.navigate(['/acopio/operaciones/notaingresoalmacen/list']);
  }

  GenerarEtiquetas() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      `¿Está seguro de generar las etiquetas de la nota de ingreso ${this.frmNotaIngresoAcopioDetalle.value.correlativo}?`,
      () => {

        let link = document.createElement('a');
        document.body.appendChild(link);
        link.href = `${host}NotaIngresoAcopio/Etiquetas?id=${this.locId}`;
        link.download = "NotaCompra.pdf"
        link.target = "_blank";
        link.click();
        link.remove();

        this.flagShowBtnFinalizarEtiquetado = true;
      });
  }

  ConfirmarTerminoEtiquetado() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      `¿Está seguro de confirmar la finalización del etiquetado de los sacos?`,
      () => {
        this.spinner.show();
        const request = {
          NotaIngresoId: this.locId,
          Usuario: this.userSession.NombreUsuario,
          Correlativo: this.frmNotaIngresoAcopioDetalle.value.correlativo
        };
        this.notaingresoacopioService.ConfirmarEtiquetado(request)
          .subscribe((res) => {
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha confirmado la finalización del etiquetado de los sacos.',
                () => {
                  this.ConsultarPorId();
                });
            }
          }, (err) => {
            this.alertUtil.alertError('ERROR', this.mensajeGenerico)
          });
      });
  }

  GenerarOrdenProceso() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      `¿Está seguro de generar la orden de proceso?`,
      () => {
        this.spinner.show();
        const request = {
          NotaIngresoAcopioId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario
        }
        this.ordenprocesoacopioService.Registrar(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado la orden de proceso ${res.Result.Data}.`,
                () => {
                  this.router.navigate(['/acopio/operaciones/ordenproceso/list']);
                });
            } else {
              this.alertUtil.alertError('ERROR', res.Result.Message);
            }
          }, (err) => {
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
            this.spinner.hide();
          });
      });
  }
}