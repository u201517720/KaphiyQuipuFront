import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { GuiaremisionplantaService } from '../../../../../../services/guiaremisionplanta.service';
import { AlertUtil } from '../../../../../../services/util/alert-util';

@Component({
  selector: 'app-nota-salida-planta-edit',
  templateUrl: './nota-salida-planta-edit.component.html',
  styleUrls: ['./nota-salida-planta-edit.component.scss']
})
export class NotaSalidaPlantaEditComponent implements OnInit {

  constructor(private guiaremisionplantaService: GuiaremisionplantaService,
    private alertUtil: AlertUtil,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  locId = 0;
  userSession: any;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con soporte de sistemas.';

  ngOnInit(): void {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  GenerarGuiaRemision() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '¿Está seguro de generar la guía de remisión?',
      () => {
        this.spinner.show();
        const request = {
          NotaSalidaPlantaId: this.locId,
          UsuarioRegistro: this.userSession.NombreUsuario
        }
        this.guiaremisionplantaService.Registrar(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado la guía de remisión ${res.Result.Data}.`,
                () => {
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

  Cancelar() {

  }
}
