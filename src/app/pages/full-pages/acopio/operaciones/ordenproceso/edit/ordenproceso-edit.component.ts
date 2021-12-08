import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

import { OrdenprocesoacopioService } from '../../../../../../services/ordenprocesoacopio.service';
import { MaestroService } from '../../../../../../services/maestro.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { GuiaremisionService } from '../../../../../../services/guiaremision.service';
import { NotaingresoplantaService } from '../../../../../../services/notaingresoplanta.service';

@Component({
  selector: 'app-ordenproceso-edit',
  templateUrl: './ordenproceso-edit.component.html',
  styleUrls: ['./ordenproceso-edit.component.scss']
})
export class OrdenprocesoEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private ordenprocesoacopioService: OrdenprocesoacopioService,
    private maestroService: MaestroService,
    private alertUtil: AlertUtil,
    private guiaremisionService: GuiaremisionService,
    private notaingresoplantaService: NotaingresoplantaService) { }

  frmOrdenProcesoAcopioDetalle: FormGroup;
  locId = 0;
  userSession: any;
  listTipoProcesos = [];
  selectedTipoProceso = [];
  submitted = false;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comuníquese con el área de soporte de sistemas.';
  locEstado = 0;

  ngOnInit(): void {
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
    this.frmOrdenProcesoAcopioDetalle = this.fb.group({
      cooperativa: [],
      direccion: [],
      ruc: [],
      correlativo: [],
      fechaRegistro: [],
      tipoProceso: [, Validators.required],
      tipoProduccion: [],
      certificacion: [],
      producto: [],
      subProducto: [],
      calidad: [],
      empaque: [],
      tipoEmpaque: [],
      grado: [],
      cantidad: [],
      pesoSaco: [],
      kilosBrutos: [],
      inicioProceso: [],
      finProceso: [],
      responsable: [],
      correlativoNI: [],
      codigoNotaIngreso: [],
      correlativoOP: [],
      correlativoCon: [],
      fechaEntrega: []
    });
    this.ObtenerTiposProcesos();
  }

  get f() {
    return this.frmOrdenProcesoAcopioDetalle.controls;
  }

  async ObtenerTiposProcesos() {
    this.listTipoProcesos = [];
    const res = await this.maestroService.obtenerMaestros('TipoProceso').toPromise();
    if (res.Result.Success) {
      this.listTipoProcesos = res.Result.Data;
    }
  }

  ConsultarPorId() {
    this.spinner.show();
    this.ordenprocesoacopioService.ConsultarPorId({ OrdenProcesoId: this.locId })
      .subscribe((res) => {
        if (res.Result.Success) {
          this.CompletarFormulario(res.Result.Data);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });
  }

  async CompletarFormulario(data) {
    if (data) {
      this.locEstado = data.EstadoId ? parseInt(data.EstadoId) : 0;
      this.frmOrdenProcesoAcopioDetalle.controls.codigoNotaIngreso.setValue(data.NotaIngresoAcopioId);
      this.frmOrdenProcesoAcopioDetalle.controls.cooperativa.setValue(data.Empresa);
      this.frmOrdenProcesoAcopioDetalle.controls.direccion.setValue(data.Direccion);
      this.frmOrdenProcesoAcopioDetalle.controls.ruc.setValue(data.Ruc);
      this.frmOrdenProcesoAcopioDetalle.controls.correlativo.setValue(data.CorrelativoOP);
      this.frmOrdenProcesoAcopioDetalle.controls.correlativoNI.setValue(data.CorrelativoNI);
      this.frmOrdenProcesoAcopioDetalle.controls.fechaRegistro.setValue(data.FechaRegistro);
      if (data.TipoProcesoId) {
        await this.ObtenerTiposProcesos();
        this.frmOrdenProcesoAcopioDetalle.controls.tipoProceso.setValue(data.TipoProcesoId);
      }
      this.frmOrdenProcesoAcopioDetalle.controls.tipoProduccion.setValue(data.TipoProduccion);
      this.frmOrdenProcesoAcopioDetalle.controls.certificacion.setValue(data.Certificacion);
      this.frmOrdenProcesoAcopioDetalle.controls.producto.setValue(data.Producto);
      this.frmOrdenProcesoAcopioDetalle.controls.subProducto.setValue(data.SubProducto);
      this.frmOrdenProcesoAcopioDetalle.controls.calidad.setValue(data.Calidad);
      this.frmOrdenProcesoAcopioDetalle.controls.empaque.setValue(data.Empaque);
      this.frmOrdenProcesoAcopioDetalle.controls.tipoEmpaque.setValue(data.TipoEmpaque);
      this.frmOrdenProcesoAcopioDetalle.controls.grado.setValue(data.Grado);
      this.frmOrdenProcesoAcopioDetalle.controls.cantidad.setValue(data.TotalSacos);
      this.frmOrdenProcesoAcopioDetalle.controls.pesoSaco.setValue(data.PesoSaco);
      this.frmOrdenProcesoAcopioDetalle.controls.kilosBrutos.setValue(data.PesoKilos);
      this.frmOrdenProcesoAcopioDetalle.controls.inicioProceso.setValue(data.FechaInicioProceso);
      this.frmOrdenProcesoAcopioDetalle.controls.finProceso.setValue(data.FechaFinProceso);
      this.frmOrdenProcesoAcopioDetalle.controls.responsable.setValue(data.Responsable);

      if (data.CorrelativoContrato) {
        this.frmOrdenProcesoAcopioDetalle.controls.correlativoCon.setValue(data.CorrelativoContrato);
      }
      if (data.FechaEntrega)
        this.frmOrdenProcesoAcopioDetalle.controls.fechaEntrega.setValue(data.FechaEntrega);
    }
    this.spinner.hide();
  }

  Guardar() {
    if (!this.frmOrdenProcesoAcopioDetalle.invalid) {
      this.alertUtil.alertSiNoCallback('Pregunta',
        '¿Está seguro de guardar el tipo de proceso seleccionado?',
        () => {
          this.spinner.show();
          const request = {
            OrdenProcesoId: this.locId,
            TipoProceso: this.frmOrdenProcesoAcopioDetalle.value.tipoProceso,
            Usuario: this.userSession.NombreUsuario
          }
          this.ordenprocesoacopioService.ActualizarTipoProceso(request)
            .subscribe((res) => {
              if (res.Result.Success) {
                this.alertUtil.alertOkCallback('Confirmación',
                  'Se ha guardado el tipo de proceso seleccionado.',
                  () => {
                    this.ConsultarPorId();
                  })
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

  Cancelar() {
    this.router.navigate(['/acopio/operaciones/ordenproceso/list']);
  }

  GenerarGuiaRemision() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de generar la guía de remisión?',
      () => {
        this.spinner.show();
        const request = {
          OrdenProcesoId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario
        };
        this.guiaremisionService.Registrar(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado la guía de remisión ${res.Result.Data}.`,
                () => {
                  this.router.navigate(['/home']);
                });
            }
          }, (err) => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

  IniciarTransformacion() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de confirmar el inicio de la transformación?',
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.ordenprocesoacopioService.IniciarTransformacion(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha confirmado el inicio de la transformación.`,
                () => {
                  this.router.navigate(['/planta/operaciones/notaingreso/list']);
                });
            }
          }, (err) => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

}
