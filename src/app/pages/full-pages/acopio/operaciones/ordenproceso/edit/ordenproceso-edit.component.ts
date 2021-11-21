import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

import { OrdenprocesoacopioService } from '../../../../../../services/ordenprocesoacopio.service';
import { MaestroService } from '../../../../../../services/maestro.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';

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
    private alertUtil: AlertUtil) { }

  frmOrdenProcesoAcopioDetalle: FormGroup;
  locId = 0;
  userSession: any;
  listTipoProcesos = [];
  selectedTipoProceso = [];
  submitted = false;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';

  ngOnInit(): void {
    this.locId = parseInt(this.route.snapshot.params['id']);
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
      tipoProceso: [],
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
      correlativoNI: []
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
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });
  }

  async CompletarFormulario(data) {
    if (data) {
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
    }
    this.spinner.hide();
  }

  Guardar() {

  }
}
