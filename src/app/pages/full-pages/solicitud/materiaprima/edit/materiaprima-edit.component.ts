import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { AgricultorService } from '../../../../../services/agricultor.service';
import { AlertUtil } from '../../../../../services/util/alert-util';

@Component({
  selector: 'app-materiaprima-edit',
  templateUrl: './materiaprima-edit.component.html',
  styleUrls: ['./materiaprima-edit.component.scss']
})
export class MateriaprimaEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private agricultorService: AgricultorService,
    private router: Router,
    private alertUtil: AlertUtil) {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    this.IniciarForm();
    if (this.locId > 0) {
      this.ObtenerSolicitudPorId();
    }
  }

  frmDetalleMateriaPrimaSolicitada: FormGroup;
  userSession: any;
  locId = 0;
  locEstadoMateriaPrima = '';

  ngOnInit(): void {
  }

  IniciarForm() {
    this.frmDetalleMateriaPrimaSolicitada = this.fb.group({
      descSolicitante: [],
      correlativoContrato: [],
      descEstado: [],
      descTipoDocumento: [],
      numeroDocumento: [],
      descProducto: [],
      cantidadSacos: [],
      descSubProducto: [],
      kiloPorSaco: [],
      descUnidadMedida: [],
      codEstadoSolicitud: []
    });
  }

  get f() {
    return this.frmDetalleMateriaPrimaSolicitada.controls;
  }

  ObtenerSolicitudPorId() {
    this.spinner.show();
    this.agricultorService.ConsultarDetalleMateriaPrimaSolicitada({ ContratoSocioFincaId: this.locId })
      .subscribe((res) => {
        if (res.Result.Success) {
          this.LoadForm(res.Result.Data);
        } else {

        }
      }, (err) => {
        console.log(err);
      });
  }

  LoadForm(data) {
    if (data) {
      this.locEstadoMateriaPrima = data.EstadoId;
      if (data.RazonSocial) {
        this.frmDetalleMateriaPrimaSolicitada.controls.descSolicitante.setValue(data.RazonSocial);
      }
      if (data.CorrelativoContrato) {
        this.frmDetalleMateriaPrimaSolicitada.controls.correlativoContrato.setValue(data.CorrelativoContrato);
      }
      if (data.TipoDocumento) {
        this.frmDetalleMateriaPrimaSolicitada.controls.descTipoDocumento.setValue(data.TipoDocumento);
      }
      if (data.Ruc) {
        this.frmDetalleMateriaPrimaSolicitada.controls.numeroDocumento.setValue(data.Ruc);
      }
      if (data.Producto) {
        this.frmDetalleMateriaPrimaSolicitada.controls.descProducto.setValue(data.Producto);
      }
      if (data.SubProducto) {
        this.frmDetalleMateriaPrimaSolicitada.controls.descSubProducto.setValue(data.SubProducto);
      }
      if (data.CantidadSolicitada) {
        this.frmDetalleMateriaPrimaSolicitada.controls.cantidadSacos.setValue(data.CantidadSolicitada);
      }
      if (data.PesoSaco) {
        this.frmDetalleMateriaPrimaSolicitada.controls.kiloPorSaco.setValue(data.PesoSaco);
      }
      if (data.UnidadMedida) {
        this.frmDetalleMateriaPrimaSolicitada.controls.descUnidadMedida.setValue(data.UnidadMedida);
      }
      if (data.Estado) {
        this.frmDetalleMateriaPrimaSolicitada.controls.descEstado.setValue(data.Estado);
      }
    }
    this.spinner.hide();
  }

  ConfirmarEnvio() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de confirmar envío de materia prima solicitada al acopiador?',
      () => {
        this.spinner.show();
        const request = {
          ContratoSocioFincaId: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.agricultorService.ConfirmarEnvio(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha confirmado envío de materia prima solicitada al acopiador.',
                () => {
                  this.ObtenerSolicitudPorId();
                });
            }
          }, (err) => {
            console.log(err);
            this.spinner.hide();
          })
      })
  }

  ConfirmarCantidad() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de confirmar disponibilidad de cantidad de materia prima solicitada?',
      () => {
        this.spinner.show();
        const request = {
          ContratoSocioFincaId: this.locId,
          Usuario: this.userSession.NombreUsuario
        };
        this.agricultorService.ConfirmarDisponibilidad(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha confirmado disponibilidad de cantidad de materia prima solicitada.',
                () => {
                  this.ObtenerSolicitudPorId();
                });
            }
          }, (err) => {
            console.log(err);
            this.spinner.hide();
          })
      })
  }

  Cancelar() {
    this.router.navigate(['/solicitudes/materiaprima/list']);
  }
}
