import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { MaestroService } from '../../../../../../services/maestro.service';
import { GuiaremisionplantaService } from '../../../../../../services/guiaremisionplanta.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { NotaingresoacopioService } from '../../../../../../services/notaingresoacopio.service';
import { GuiaremisionService } from '../../../../../../services/guiaremision.service';

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
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';
  userSession: any;
  locId = 0;
  locEstado = 0;

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
    this.frmNotaIngresoDevolucionDetalle = this.fb.group({
      guiaremisionplantaid: [],
      correlativo: [],
      fechaRegistro: [],
      producto: [],
      cantidad: [],
      almacen: [, Validators.required],
      observaciones: [],
      correlativoGRP: [, Validators.required]
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
      this.frmNotaIngresoDevolucionDetalle.controls.guiaremisionplantaid.setValue(data.GuiaRemisionPlantaId);
      this.frmNotaIngresoDevolucionDetalle.controls.correlativoGRP.setValue(data.CorrelativoGRP);
      this.frmNotaIngresoDevolucionDetalle.controls.producto.setValue(data.Producto);
      this.frmNotaIngresoDevolucionDetalle.controls.cantidad.setValue(data.TotalSacos);
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
    }
    this.spinner.hide();
  }

  Guardar() {
    if (!this.frmNotaIngresoDevolucionDetalle.invalid) {
      if (this.frmNotaIngresoDevolucionDetalle.value.guiaremisionplantaid > 0) {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de ubicar la materia transformada en el almacén seleccionado?',
          () => {
            const request = {
              GuiaRemisionPlantaId: this.frmNotaIngresoDevolucionDetalle.value.guiaremisionplantaid,
              AlmacenId: this.frmNotaIngresoDevolucionDetalle.value.almacen,
              Observaciones: this.frmNotaIngresoDevolucionDetalle.value.observaciones,
              UsuarioRegistro: this.userSession.NombreUsuario
            }
            this.notaingresoacopioService.RegistrarDevolucion(request)
              .subscribe((res) => {
                if (res.Result.Success) {
                  this.alertUtil.alertOkCallback('Confirmación',
                    `Se ha generado la nota de ingreso ${res.Result.Data}`,
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
          UsuarioRegistro: this.userSession.NombreUsuario
        }
        this.guiaremisionService.RegistrarDevolucion(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `La ha generado la guía de remisión ${res.Result.Data}.`,
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
}
