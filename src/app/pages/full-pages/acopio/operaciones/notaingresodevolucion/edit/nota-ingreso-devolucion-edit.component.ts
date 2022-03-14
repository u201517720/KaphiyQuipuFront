import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { MaestroService } from '../../../../../../Services/maestro.service';
import { GuiaremisionplantaService } from '../../../../../../Services/guiaremisionplanta.service';
import { AlertUtil } from '../../../../../../Services/util/alert-util';
import { NotaingresoacopioService } from '../../../../../../Services/notaingresoacopio.service';
import { GuiaremisionService } from '../../../../../../Services/guiaremision.service';

@Component({
  selector: 'app-nota-ingreso-devolucion-edit',
  templateUrl: './nota-ingreso-devolucion-edit.component.html',
  styleUrls: ['./nota-ingreso-devolucion-edit.component.scss']
})
export class NotaIngresoDevolucionEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private maestroService: MaestroService,
    private guiaremisionplantaService: GuiaremisionplantaService,
    private alertUtil: AlertUtil,
    private spinner: NgxSpinnerService,
    private notaingresoacopioService: NotaingresoacopioService,
    private router: Router,
    private route: ActivatedRoute,
    private guiaremisionService: GuiaremisionService) { }

  frmNotaIngresoDevolucionDetalle: FormGroup;
  listaAlmacenes = [];
  selectedAlmacen: any;
  submitted = false;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comuníquese con el área de soporte de sistemas.';
  userSession: any;
  locId = 0;
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
    } else {
      this.GetAlmacenes();
    }
  }

  LoadForm() {
    this.frmNotaIngresoDevolucionDetalle = this.fb.group({
      guiaremisionplantaid: [],
      correlativo: [],
      fechaRegistro: [],
      producto: [],
      cantidad: [],
      almacen: [, Validators.required],
      observaciones: [],
      correlativoGRP: [, Validators.required],
      pesoNeto: [],
      totalPagar: [],
      tara: [],
      pesoTotal: [],
      pesoSaco: [],
      nroContrato: []
    });
  }

  get f() {
    return this.frmNotaIngresoDevolucionDetalle.controls;
  }

  async GetAlmacenes() {
    this.listaAlmacenes = [];
    const res = await this.maestroService.obtenerMaestros('Almacen').toPromise();
    if (res.Result.Success) {
      this.listaAlmacenes = res.Result.Data;
    }
  }

  ConsultarCorrelativo(e) {
    if (e && e.keyCode === 13) {
      this.BuscarCorrelativo();
    }
  }

  BuscarCorrelativo() {
    this.spinner.show();
    const request = {
      Correlativo: this.frmNotaIngresoDevolucionDetalle.value.correlativoGRP
    }
    this.guiaremisionplantaService.ConsultarCorrelativo(request)
      .subscribe((res) => {
        if (res.Result.Success) {
          this.CompletarForm(res.Result.Data);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });

  }

  async CompletarForm(data) {
    if (data) {
      if (data.EstadoId) {
        this.locEstado = parseInt(data.EstadoId);
      }
      if (data.CorrelativoNID) {
        this.frmNotaIngresoDevolucionDetalle.controls.correlativo.setValue(data.CorrelativoNID);
      }
      this.frmNotaIngresoDevolucionDetalle.controls.fechaRegistro.setValue(data.FechaRegistro);
      this.frmNotaIngresoDevolucionDetalle.controls.guiaremisionplantaid.setValue(data.GuiaRemisionPlantaId);
      this.frmNotaIngresoDevolucionDetalle.controls.correlativoGRP.setValue(data.CorrelativoGRP);
      this.frmNotaIngresoDevolucionDetalle.controls.producto.setValue(data.Producto);
      if (data.TotalSacos) {
        this.frmNotaIngresoDevolucionDetalle.controls.cantidad.setValue(data.TotalSacos);
        this.frmNotaIngresoDevolucionDetalle.controls.tara.setValue(data.TotalSacos * 0.3);
      }
      if (data.Observaciones) {
        this.frmNotaIngresoDevolucionDetalle.controls.observaciones.setValue(data.Observaciones);
      }
      if (data.AlmacenId) {
        await this.GetAlmacenes();
        this.frmNotaIngresoDevolucionDetalle.controls.almacen.setValue(data.AlmacenId);
      }
      if (data.FechaRegistro) {
        this.frmNotaIngresoDevolucionDetalle.controls.fechaRegistro.setValue(data.FechaRegistro);
      }
      if (data.PesoSaco) {
        this.frmNotaIngresoDevolucionDetalle.controls.pesoSaco.setValue(data.PesoSaco);
      }
      if (data.CorrelativoContrato) {
        this.frmNotaIngresoDevolucionDetalle.controls.nroContrato.setValue(data.CorrelativoContrato);
      }
      this.frmNotaIngresoDevolucionDetalle.controls.pesoNeto.setValue(parseFloat((data.TotalSacos * data.PesoSaco).toFixed(2)));
      this.frmNotaIngresoDevolucionDetalle.controls.pesoTotal.setValue(parseFloat(((data.TotalSacos * data.PesoSaco) + (data.TotalSacos * 0.3)).toFixed(2)));
      this.frmNotaIngresoDevolucionDetalle.controls.totalPagar.setValue(parseFloat(((data.TotalSacos * data.PesoSaco) * 5.4).toFixed(2)));
    }
    this.spinner.hide();
  }

  Guardar() {
    if (!this.frmNotaIngresoDevolucionDetalle.invalid) {
      if (this.frmNotaIngresoDevolucionDetalle.value.guiaremisionplantaid > 0) {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de ubicar la materia transformada en el almacén seleccionado?',
          () => {
            this.spinner.show();
            const request = {
              GuiaRemisionPlantaId: this.frmNotaIngresoDevolucionDetalle.value.guiaremisionplantaid,
              AlmacenId: this.frmNotaIngresoDevolucionDetalle.value.almacen,
              Observaciones: this.frmNotaIngresoDevolucionDetalle.value.observaciones,
              UsuarioRegistro: this.userSession.NombreUsuario,
              Contrato: this.frmNotaIngresoDevolucionDetalle.value.nroContrato
            }
            this.notaingresoacopioService.RegistrarDevolucion(request)
              .subscribe((res) => {
                this.spinner.hide();
                if (res.Result.Success) {
                  this.alertUtil.alertOkCallback('Confirmación',
                    `Se ha generado la nota de ingreso ${res.Result.Data}.`,
                    () => {
                      this.Cancelar();
                    });
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

  ConsultarPorId() {
    this.spinner.show();
    this.notaingresoacopioService.ConsultarDevolucionPorId({ Id: this.locId })
      .subscribe((res) => {
        if (res.Result.Success) {
          this.CompletarForm(res.Result.Data);
        }
      }, (err) => {
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      });
  }

  Cancelar() {
    this.router.navigate(['/acopio/operaciones/notaingresodevolucion/list']);
  }

  ConfirmarAtencionCompleta() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de confirmar la atención completa?',
      () => {
        this.spinner.show();
        const request = {
          Id: this.locId,
          Usuario: this.userSession.NombreUsuario
        }
        this.notaingresoacopioService.ConfirmarAtencionCompleta(request)
          .subscribe((res) => {
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha confirmado la atención completa del contrato.',
                () => {
                  this.ConsultarPorId();
                });
            }
          }, (err) => {
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', this.mensajeGenerico);
          });
      });
  }

  GenerarGuiaRemision() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de generar la guía de remisión?',
      () => {
        this.spinner.show();
        const request = {
          NotaIngresoDevolucionId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario,
          Contrato: this.frmNotaIngresoDevolucionDetalle.value.nroContrato
        }
        this.guiaremisionService.RegistrarDevolucion(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado la guía de remisión ${res.Result.Data}.`,
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
  }

  ConfirmarAtencionCompleta2() {
    
  }
}
