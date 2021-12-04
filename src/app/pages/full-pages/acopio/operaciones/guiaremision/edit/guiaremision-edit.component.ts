import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertUtil } from '../../../../../../services/util/alert-util';
import { GuiaremisionService } from '../../../../../../services/guiaremision.service';

@Component({
  selector: 'app-guiaremision-edit',
  templateUrl: './guiaremision-edit.component.html',
  styleUrls: ['./guiaremision-edit.component.scss']
})
export class GuiaremisionEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private guiaremisionService: GuiaremisionService,
    private router: Router) { }

  frmGuiaRemisionAcopioDetalle: FormGroup;
  locId = 0;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comuníquese con el área de soporte de sistemas.';

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
    this.frmGuiaRemisionAcopioDetalle = this.fb.group({
      correlativo: [],
      razonSocial: [],
      rucAcopio: [],
      direccionAcopio: [],
      razonSocialDestino: [],
      rucDestino: [],
      fechaTraslado: [],
      puntoPartida: [],
      fechaEmision: [],
      puntoLlegada: [],
      motivoTraslado: [],
      correlativoContrato: [],
      descripcion: [],
      unidadMedida: [],
      cantidad: [],
      pesoKGs: [],
      transportista: [],
      rucTransportista: [],
      placa: [],
      numeroLicencia: [],
      marca: [],
      constanciaMTC: []
    });
  }

  get f() {
    return this.frmGuiaRemisionAcopioDetalle.controls;
  }

  ConsultarPorId() {
    this.spinner.show();
    this.guiaremisionService.ConsultarPorId({ Id: this.locId })
      .subscribe((res) => {
        if (res.Result.Success) {
          this.CompletarFormulario(res.Result.Data);
        } else {
          this.alertUtil.alertError('ERROR', res.Result.Message);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });
  }

  CompletarFormulario(data) {
    if (data) {
      this.frmGuiaRemisionAcopioDetalle.controls.correlativo.setValue(data.CorrelativoGRA);
      this.frmGuiaRemisionAcopioDetalle.controls.razonSocial.setValue(data.EmpresaAcopio);
      this.frmGuiaRemisionAcopioDetalle.controls.rucAcopio.setValue(data.RucAcopio);
      this.frmGuiaRemisionAcopioDetalle.controls.direccionAcopio.setValue(data.DireccionAcopio);
      this.frmGuiaRemisionAcopioDetalle.controls.razonSocialDestino.setValue(data.EmpresaTransformadora);
      this.frmGuiaRemisionAcopioDetalle.controls.rucDestino.setValue(data.RucTransformadora);
      this.frmGuiaRemisionAcopioDetalle.controls.fechaTraslado.setValue(data.FechaTraslado);
      this.frmGuiaRemisionAcopioDetalle.controls.puntoPartida.setValue(data.DireccionAcopio);
      this.frmGuiaRemisionAcopioDetalle.controls.fechaEmision.setValue(data.FechaEmision);
      this.frmGuiaRemisionAcopioDetalle.controls.puntoLlegada.setValue(data.DireccionTransformadora);
      this.frmGuiaRemisionAcopioDetalle.controls.motivoTraslado.setValue(data.MotivoSalida);
      this.frmGuiaRemisionAcopioDetalle.controls.correlativoContrato.setValue(data.CorrelativoContrato);
      this.frmGuiaRemisionAcopioDetalle.controls.descripcion.setValue(`${data.Producto} - ${data.TipoProduccion}`);
      this.frmGuiaRemisionAcopioDetalle.controls.unidadMedida.setValue(data.UnidadMedida);
      this.frmGuiaRemisionAcopioDetalle.controls.cantidad.setValue(data.TotalSacos);
      this.frmGuiaRemisionAcopioDetalle.controls.pesoKGs.setValue(data.PesoKilos);
      this.frmGuiaRemisionAcopioDetalle.controls.transportista.setValue(data.Conductor);
      this.frmGuiaRemisionAcopioDetalle.controls.rucTransportista.setValue(data.RucTransporte);
      this.frmGuiaRemisionAcopioDetalle.controls.placa.setValue(data.PlacaTractor);
      this.frmGuiaRemisionAcopioDetalle.controls.numeroLicencia.setValue(data.Licencia);
      this.frmGuiaRemisionAcopioDetalle.controls.marca.setValue(data.MarcaVehiculo);
      this.frmGuiaRemisionAcopioDetalle.controls.constanciaMTC.setValue(data.NumeroConstanciaMTC);
    }
    this.spinner.hide();
  }

  Cancelar() {
    this.router.navigate(['/acopio/operaciones/guiaremision/list']);
  }

}
