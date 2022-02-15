import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { GuiaremisionplantaService } from '../../../../../../Services/guiaremisionplanta.service';
import { AlertUtil } from '../../../../../../Services/util/alert-util';
import { NotasalidaplantaService } from '../../../../../../Services/notasalidaplanta.service';
import { MaestroService } from '../../../../../../Services/maestro.service';
import { ContratoService } from '../../../../../../Services/contrato.service';

@Component({
  selector: 'app-nota-salida-planta-edit',
  templateUrl: './nota-salida-planta-edit.component.html',
  styleUrls: ['./nota-salida-planta-edit.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotaSalidaPlantaEditComponent implements OnInit {

  constructor(private guiaremisionplantaService: GuiaremisionplantaService,
    private alertUtil: AlertUtil,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    private maestroService: MaestroService,
    private contratoService: ContratoService,
    private notasalidaplantaService: NotasalidaplantaService) { }

  locId = 0;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comuníquese con el área de soporte de sistemas.';
  frmNotaSalidaPlantaDetalle: FormGroup;
  locEstado = 0;
  limitTrans = 10;
  selectedTrans = [];
  rowsTrans = [];

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
    this.frmNotaSalidaPlantaDetalle = this.fb.group({
      correlativo: [],
      fechaRegistro: [],
      transformadora: [],
      direccionTransformadora: [],
      rucTransformador: [],
      destinatario: [],
      destino: [],
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
          Empresa: this.userSession.RazonSocialEmpresa,
          Contrato: this.frmNotaSalidaPlantaDetalle.value.nroContrato
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
      this.locEstado = data.EstadoId;
      this.frmNotaSalidaPlantaDetalle.controls.correlativo.setValue(data.CorrelativoNSP);
      this.frmNotaSalidaPlantaDetalle.controls.fechaRegistro.setValue(data.FechaRegistro);
      this.frmNotaSalidaPlantaDetalle.controls.transformadora.setValue(data.Transformadora);
      this.frmNotaSalidaPlantaDetalle.controls.direccionTransformadora.setValue(data.DireccionTransformadora);
      this.frmNotaSalidaPlantaDetalle.controls.rucTransformador.setValue(data.RucTransformadora);
      this.frmNotaSalidaPlantaDetalle.controls.destinatario.setValue(data.Acopiador);
      this.frmNotaSalidaPlantaDetalle.controls.destino.setValue(data.DireccionAcopiador);
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
      this.ActualizarListaTransportistas();
    }
    this.spinner.hide();
  }

  Cancelar() {
    this.router.navigate(['/planta/operaciones/notasalida/list']);
  }

  updateLimit(e) {
    this.limitTrans = e.target.value;
  }

  ActualizarListaTransportistas() {
    this.spinner.show();
    this.rowsTrans = [];
    if (this.locEstado === 1) {
      this.maestroService.ConsultarTransportista({ Codigo: 'TransporteContratoPlantaSalida' })
        .subscribe((res) => {
          this.spinner.hide();
          if (res.Result.Success) {
            this.rowsTrans = res.Result.Data;
          } else {
            this.alertUtil.alertError('ERROR', res.Result.Message);
          }
        }, (err) => {
          this.spinner.hide();
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    } else {
      this.maestroService.ConsultarTransportista({ Id: this.locId, Codigo: 'TransporteContratoPlantaSalida' })
        .subscribe((res) => {
          this.spinner.hide();
          if (res.Result.Success) {
            this.rowsTrans = res.Result.Data;
          } else {
            this.alertUtil.alertError('ERROR', res.Result.Message);
          }
        }, (err) => {
          this.spinner.hide();
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    }
  }

  AsignarTransportistas() {
    if (this.selectedTrans && this.selectedTrans.length > 0) {
      this.alertUtil.alertSiNoCallback('Pregunta',
        '¿Está seguro de asignar a los transportistas seleccionados para el envio del café?',
        () => {
          this.spinner.show();
          const request = {
            transportistas: [],
            Codigo: 'TransporteContratoPlantaSalida'
          };
          this.selectedTrans.forEach(x => {
            request.transportistas.push({
              IdProceso: this.locId,
              TransporteId: x.TransporteId,
              Usuario: this.userSession.NombreUsuario
            })
          });
          this.contratoService.AsignarTransportistas(request)
            .subscribe((res) => {
              this.spinner.hide();
              if (res.Result.Success) {
                this.alertUtil.alertOkCallback('Confirmación',
                  'Se ha asignado correctamente a los trasportistas seleccionados el traslado del café.',
                  () => {
                    this.ConsultarPorId();
                  });
              } else {
                this.alertUtil.alertError('ERROR', res.Result.Message);
              }
            }, (err) => {
              console.log(err);
              this.spinner.hide();
              this.alertUtil.alertError('ERROR', this.mensajeGenerico);
            });
        });
    } else {
      this.alertUtil.alertWarning('Validación', 'Seleccionar el/los transportista(s) que trasladarán el café.');
    }
  }
}
