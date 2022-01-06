import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateUtil } from 'src/app/services/util/date-util';
import { AlertUtil } from '../../../../../services/util/alert-util';
import { GuiarecepcionacopioService } from '../../../../../services/guiarecepcionacopio.service';
import { NotaingresoacopioService } from '../../../../../services/notaingresoacopio.service';

@Component({
  selector: 'app-guia-recepcion',
  templateUrl: './guia-recepcion.component.html',
  styleUrls: ['./guia-recepcion.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GuiaRecepcionComponent implements OnInit {

  frmListGuiaRecepcion: FormGroup;
  errorGeneral = { isError: false, errorMessage: '' };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  limitRef = 10;
  selected = [];
  rows = [];
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistemas.';
  userSession: any;

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private alertUtil: AlertUtil,
    private guiarecepcionacopioService: GuiarecepcionacopioService,
    private notaingresoacopioService: NotaingresoacopioService) {
    this.errorGeneral = { isError: false, errorMessage: '' };
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmListGuiaRecepcion = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });

    this.frmListGuiaRecepcion.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.frmListGuiaRecepcion.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.frmListGuiaRecepcion.setValidators(this.comparisonValidator());
  }

  get f() {
    return this.frmListGuiaRecepcion.controls;
  }

  public comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (!group.value.fechaInicio || !group.value.fechaFin) {
        this.errorGeneral = { isError: true, errorMessage: 'La fechas inicio y fin son obligatorias. Por favor, ingresarlas.' };
      } else {
        this.errorGeneral = { isError: false, errorMessage: '' };
      }
      return;
    };
  }

  compareTwoDates() {
    const anioFechaInicio = new Date(this.frmListGuiaRecepcion.value.fechaInicio).getFullYear()
    const anioFechaFin = new Date(this.frmListGuiaRecepcion.value.fechaFin).getFullYear()

    if (!this.frmListGuiaRecepcion.value.fechaInicio || !this.frmListGuiaRecepcion.value.fechaFin) {
      this.errorGeneral = { isError: true, errorMessage: 'La fechas inicio y fin son obligatorias. Por favor, ingresarlas.' };
    }
    else if (anioFechaFin < anioFechaInicio) {
      this.errorGeneral = { isError: true, errorMessage: 'La fecha fin no puede ser menor a la fecha inicio.' };
    } else {
      this.errorGeneral = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(e) {
    this.limitRef = e.target.value;
  }

  onSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  Buscar() {
    if (!this.frmListGuiaRecepcion.invalid) {
      this.errorGeneral = { isError: false, errorMessage: '' };
      this.spinner.show();
      this.rows = [];
      const request = {
        FechaInicio: this.frmListGuiaRecepcion.value.fechaInicio,
        FechaFin: this.frmListGuiaRecepcion.value.fechaFin
      };
      this.guiarecepcionacopioService.Search(request)
        .subscribe((res) => {
          this.spinner.hide();
          if (res) {
            if (res.Result.Success) {
              if (!res.Result.Message) {
                this.rows = res.Result.Data;
              } else {
                this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
              }
            } else {
              this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
            }
          } else {
            this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
          }
        }, (err) => {
          this.spinner.hide();
          console.log(err);
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        });
    }
  }

  EnviarAlmacen() {
    if (this.selected.length > 0) {
      if (this.selected[0].EstadoId === '01') {
        this.alertUtil.alertSiNoCallback('Pregunta',
          '¿Está seguro de generar nota de ingreso a almacén?',
          () => {
            this.spinner.show();
            const request = {
              GuiaRecepcionId: this.selected[0].GuiaRecepcionId,
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
                          this.Buscar();
                        });
                    } else {
                      this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
                    }
                  } else {
                    this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
                  }
                } else {
                  this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
                }
              }, (err) => {
                this.spinner.hide();
                console.log(err);
                this.alertUtil.alertError('ERROR', this.mensajeGenerico);
              });
          });
      } else {
        this.alertUtil.alertWarning('Validación',
          `La guia ${this.selected[0].Correlativo} ya se ha enviado a almacén..`);
      }
    }
  }

}
