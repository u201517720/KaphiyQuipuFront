import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { GuiaremisionplantaService } from '../../../../../../services/guiaremisionplanta.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { NotasalidaplantaService } from '../../../../../../services/notasalidaplanta.service';

@Component({
  selector: 'app-nota-salida-planta-edit',
  templateUrl: './nota-salida-planta-edit.component.html',
  styleUrls: ['./nota-salida-planta-edit.component.scss']
})
export class NotaSalidaPlantaEditComponent implements OnInit {

  constructor(private guiaremisionplantaService: GuiaremisionplantaService,
    private alertUtil: AlertUtil,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    private notasalidaplantaService: NotasalidaplantaService) { }

  locId = 0;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  frmNotaSalidaPlantaDetalle: FormGroup;

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
    this.frmNotaSalidaPlantaDetalle = this.fb.group({
      correlativo: [],
      fechaRegistro: [],
      transformadora: [],
      direccionTransformadora: [],
      rucTransformador: [],
      destinatario: [],
      destino: [],
      transportista: [],
      vehiculo: [],
      correlativoNIP: [],
      producto: [],
      nroContrato: [],
      produccion: [],
      empaque: [],
      tipoEmpaque: [],
      kgsPorSaco: [],
      nroSacos: [],
      kilosBrutos: [],
      tara: [],
      kilosNetos: [],
      certificacion: []
    });
  }

  get f() {
    return this.frmNotaSalidaPlantaDetalle.controls;
  }

  GenerarGuiaRemision() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de generar la guía de remisión?',
      () => {
        this.spinner.show();
        const request = {
          NotaSalidaPlantaId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario,
          Empresa: this.userSession.RazonSocialEmpresa
        }
        this.guiaremisionplantaService.Registrar(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado la guía de remisión ${res.Result.Data}.`,
                () => {
                  this.router.navigate(['/planta/operaciones/guiaremision/list']);
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

  ConsultarPorId() {
    this.spinner.show();
    this.notasalidaplantaService.ConsultarPorId({ Id: this.locId })
      .subscribe((res) => {
        if (res.Result.Success) {
          this.CompletarFormulario(res.Result.Data);
        } else {
          this.spinner.hide();
          this.alertUtil.alertError('ERROR', res.Result.Message);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });
  }

  async CompletarFormulario(data) {
    if (data) {
      this.frmNotaSalidaPlantaDetalle.controls.correlativo.setValue(data.CorrelativoNSP);
      this.frmNotaSalidaPlantaDetalle.controls.fechaRegistro.setValue(data.FechaRegistro);
      this.frmNotaSalidaPlantaDetalle.controls.transformadora.setValue(data.Transformadora);
      this.frmNotaSalidaPlantaDetalle.controls.direccionTransformadora.setValue(data.DireccionTransformadora);
      this.frmNotaSalidaPlantaDetalle.controls.rucTransformador.setValue(data.RucTransformadora);
      this.frmNotaSalidaPlantaDetalle.controls.destinatario.setValue(data.Acopiador);
      this.frmNotaSalidaPlantaDetalle.controls.destino.setValue(data.DireccionAcopiador);
      this.frmNotaSalidaPlantaDetalle.controls.transportista.setValue(data.Conductor);
      this.frmNotaSalidaPlantaDetalle.controls.vehiculo.setValue(data.PlacaTractor);
      this.frmNotaSalidaPlantaDetalle.controls.correlativoNIP.setValue(data.CorrelativoNIP);
      this.frmNotaSalidaPlantaDetalle.controls.producto.setValue(data.Producto);
      this.frmNotaSalidaPlantaDetalle.controls.nroContrato.setValue(data.CorrelativoContrato);
      this.frmNotaSalidaPlantaDetalle.controls.produccion.setValue(data.TipoProduccion);
      this.frmNotaSalidaPlantaDetalle.controls.empaque.setValue(data.Empaque);
      this.frmNotaSalidaPlantaDetalle.controls.tipoEmpaque.setValue(data.TipoEmpaque);
      this.frmNotaSalidaPlantaDetalle.controls.kgsPorSaco.setValue(data.PesoSaco);
      this.frmNotaSalidaPlantaDetalle.controls.nroSacos.setValue(data.CafeExportacionSacos);
      this.frmNotaSalidaPlantaDetalle.controls.kilosBrutos.setValue((data.CafeExportacionSacos * data.PesoSaco) + (data.CafeExportacionSacos * 0.3));
      this.frmNotaSalidaPlantaDetalle.controls.tara.setValue(data.CafeExportacionSacos * 0.3);
      this.frmNotaSalidaPlantaDetalle.controls.kilosNetos.setValue(data.CafeExportacionSacos * data.PesoSaco);
      this.frmNotaSalidaPlantaDetalle.controls.certificacion.setValue(`${data.SubProducto} - ${data.Certificacion}`);
    }
    this.spinner.hide();
  }

  Cancelar() {

  }
}
