import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { GuiarecepcionacopioService } from '../../../../../../services/guiarecepcionacopio.service';
import { NotaingresoacopioService } from '../../../../../../services/notaingresoacopio.service';
import { MaestroService } from '../../../../../../services/maestro.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';

@Component({
  selector: 'app-guia-recepcion-edit',
  templateUrl: './guia-recepcion-edit.component.html',
  styleUrls: ['./guia-recepcion-edit.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuiaRecepcionEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private guiarecepcionacopioService: GuiarecepcionacopioService,
    private route: ActivatedRoute,
    private router: Router,
    private alertUtil: AlertUtil,
    private spinner: NgxSpinnerService,
    private maestroService: MaestroService,
    private notaingresoacopioService: NotaingresoacopioService) {
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

  frmGuiaRecepcionDetalle: FormGroup;
  locId = 0;
  userSession: any;
  rows = [];
  limitRef = 10000;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comuníquese con el área de soporte de sistemas.';
  listOlores = [];
  listColores = [];
  detalleControlesCalidad;
  locEstado = 0;

  ngOnInit(): void {
  }

  LoadForm() {
    this.frmGuiaRecepcionDetalle = this.fb.group({
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
      CostoUnitario: [],
      costoTotal: [],
      tara: [],
      kgsNetos: []
    });
  }

  ConsultarPorId() {
    this.spinner.show();
    this.guiarecepcionacopioService.SearchById({ GuiaRecepcionId: this.locId })
      .subscribe((res) => {
        if (res) {
          if (res.Result.Success) {
            this.CompletarForm(res.Result.Data);
          } else {

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
      this.rows = data.agricultores;
      this.detalleControlesCalidad = data.controlesCalidad;
      this.frmGuiaRecepcionDetalle.controls.correlativo.setValue(data.Correlativo);
      this.frmGuiaRecepcionDetalle.controls.FechaRegistro.setValue(data.FechaRegistro);
      this.frmGuiaRecepcionDetalle.controls.RazonSocial.setValue(data.RazonSocial);
      this.frmGuiaRecepcionDetalle.controls.EstadoGuiaRecepcion.setValue(data.EstadoGuiaRecepcion);
      this.frmGuiaRecepcionDetalle.controls.Pais.setValue(data.Pais);
      this.frmGuiaRecepcionDetalle.controls.Departamento.setValue(data.Departamento);
      this.frmGuiaRecepcionDetalle.controls.Moneda.setValue(data.Moneda);
      this.frmGuiaRecepcionDetalle.controls.UnidadMedida.setValue(data.UnidadMedida);
      this.frmGuiaRecepcionDetalle.controls.TipoProduccion.setValue(data.TipoProduccion);
      this.frmGuiaRecepcionDetalle.controls.Empaque.setValue(data.Empaque);
      this.frmGuiaRecepcionDetalle.controls.TipoEmpaque.setValue(data.TipoEmpaque);
      this.frmGuiaRecepcionDetalle.controls.Producto.setValue(data.Producto);
      this.frmGuiaRecepcionDetalle.controls.SubProducto.setValue(data.SubProducto);
      this.frmGuiaRecepcionDetalle.controls.Grado.setValue(data.Grado);
      this.frmGuiaRecepcionDetalle.controls.Calidad.setValue(data.Calidad);
      this.frmGuiaRecepcionDetalle.controls.TipoCertificacion.setValue(data.TipoCertificacion);
      this.frmGuiaRecepcionDetalle.controls.TotalSacos.setValue(data.TotalSacos);
      this.frmGuiaRecepcionDetalle.controls.PesoSaco.setValue(data.PesoSaco);
      this.frmGuiaRecepcionDetalle.controls.PesoKilos.setValue(data.PesoKilos);
      this.frmGuiaRecepcionDetalle.controls.ObservacionesSolicitudCompra.setValue(data.ObservacionesSolicitudCompra);
      this.frmGuiaRecepcionDetalle.controls.responsable.setValue(data.Responsable);
      this.frmGuiaRecepcionDetalle.controls.sacosPC.setValue(data.SacosPC);
      this.frmGuiaRecepcionDetalle.controls.kilosBrutosPC.setValue(data.KilosBrutosPC);
      this.frmGuiaRecepcionDetalle.controls.taraSacoPC.setValue(data.TaraSacoPC);
      this.frmGuiaRecepcionDetalle.controls.kilosNetosPC.setValue(data.KilosNetos);
      this.frmGuiaRecepcionDetalle.controls.qq55KgPC.setValue(data.QQ55KG);
      this.frmGuiaRecepcionDetalle.controls.cafeExportacionGramos.setValue(data.CafeExportacionGramosAFC);
      this.frmGuiaRecepcionDetalle.controls.cafeExportacionPorc.setValue(data.CafeExportacionPorcAFC);
      this.frmGuiaRecepcionDetalle.controls.descarteGramos.setValue(data.DescarteGramosAFC);
      this.frmGuiaRecepcionDetalle.controls.descartePorcentaje.setValue(data.DescartePorcAFC);
      this.frmGuiaRecepcionDetalle.controls.cascaraGramos.setValue(data.CascaraGramosAFC);
      this.frmGuiaRecepcionDetalle.controls.cascaraPorcentaje.setValue(data.CascaraPorcAFC);
      this.frmGuiaRecepcionDetalle.controls.totalGramos.setValue(data.TotalGramosAFC);
      this.frmGuiaRecepcionDetalle.controls.totalPorcentaje.setValue(data.TotalPorcAFC);
      this.frmGuiaRecepcionDetalle.controls.humedadProcenPC.setValue(data.Humedad);
      this.frmGuiaRecepcionDetalle.controls.observacionesPC.setValue(data.Observaciones);
      this.frmGuiaRecepcionDetalle.controls.CostoUnitario.setValue(data.PrecioUnitario);
      this.frmGuiaRecepcionDetalle.controls.costoTotal.setValue(data.CostoTotal);
      if (data.Tara)
        this.frmGuiaRecepcionDetalle.controls.tara.setValue(data.Tara);
      if (data.KilosNetosContrato)
        this.frmGuiaRecepcionDetalle.controls.kgsNetos.setValue(data.KilosNetosContrato);
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

  GenerarNotaIngreso() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de generar nota de ingreso a almacén?',
      () => {
        this.spinner.show();
        const request = {
          GuiaRecepcionId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario
        }
        this.notaingresoacopioService.Save(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res) {
              if (res.Result.Success) {
                if (!res.Result.Message) {
                  this.alertUtil.alertOkCallback('Confirmación',
                    `Se ha generado nota de ingreso ${res.Result.Data}`,
                    () => {
                      this.router.navigate(['/acopio/operaciones/notaingresoalmacen/list']);
                    });
                } else {
                  this.alertUtil.alertError('ERROR', res.Result.Message);
                }
              } else {
                this.alertUtil.alertError('ERROR', res.Result.Message);
              }
            } else {
              this.alertUtil.alertError('ERROR', this.mensajeGenerico);
            }
          }, (err) => {
            this.spinner.hide();
            console.log(err);
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

  Cancelar() {
    this.router.navigate(['/acopio/operaciones/guiarecepcion/list']);
  }

}
