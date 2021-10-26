import { Component, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import swal from 'sweetalert2';

import { MaestroUtil } from '../../../../../services/util/maestro-util';
import { DateUtil } from '../../../../../services/util/date-util';
import { NotaIngresoAlmacenService } from '../../../../../services/nota-ingreso-almacen.service';
import { LoteService } from '../../../../../services/lote.service';
import { AlertUtil } from '../../../../../services/util/alert-util';

@Component({
  selector: 'app-ingreso-almacen',
  templateUrl: './ingreso-almacen.component.html',
  styleUrls: ['./ingreso-almacen.component.scss', "/assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None
})
export class IngresoAlmacenComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private maestroUtil: MaestroUtil,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private ingresoAlmacenService: NotaIngresoAlmacenService,
    private loteService: LoteService,
    private alertUtil: AlertUtil) {
    // this.singleSelectCheck = this.singleSelectCheck.bind(this);
  }

  ingresoAlmacenForm: any;
  listTypeDocuments: Observable<any>;
  listStates: Observable<any>;
  listAlmacen: Observable<any>;
  selectedTypeDocument: any;
  error: any = { isError: false, errorMessage: '' };
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeErrorGenerico: string = "Ocurrio un error interno.";
  errorFecha: any = { isError: false, errorMessage: '' };
  rows: any[] = [];
  tempData = [];
  submitted: boolean = false;
  limitRef = 10;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  selected = [];
  userSession: any = {};
  @Input() popUp = false;
  @Input() lote;
  @Output() agregarEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.LoadForm();
    this.ingresoAlmacenForm.controls['fechaFin'].setValue(this.dateUtil.currentDate());
    this.ingresoAlmacenForm.controls['fechaInicio'].setValue(this.dateUtil.currentMonthAgo());
    this.userSession = JSON.parse(localStorage.getItem('user'));
  }

  async LoadFormPopup() {
    if (this.popUp) {
      this.ingresoAlmacenForm.controls['estado'].disable();
      this.ingresoAlmacenForm.controls['estado'].setValue("01");
      this.ingresoAlmacenForm.controls['producto'].disable();
      this.ingresoAlmacenForm.controls['producto'].setValue(this.lote.ProductoId);
      let producto: any = {};
      producto.Codigo = this.lote.ProductoId;
      this.cargarsubProducto();
      if (this.lote.TipoCertificacionId != "") {
        this.ingresoAlmacenForm.controls['certificacion'].disable();
        this.ingresoAlmacenForm.controls['certificacion'].setValue(this.lote.TipoCertificacionId);
      }
    }
  }

  async cargarsubProducto() {
    this.ingresoAlmacenForm.controls['subProducto'].setValue(this.lote.SubProductoId);
    this.ingresoAlmacenForm.controls['subProducto'].disable();
  }

  async LoadForm() {
    this.ingresoAlmacenForm = this.fb.group({
      fechaInicio: [, Validators.required],
      fechaFin: [, Validators.required]
    });
    this.ingresoAlmacenForm.setValidators(this.comparisonValidator());
    await this.LoadCombos();
  }

  get f() {
    return this.ingresoAlmacenForm.controls;
  }

  async LoadCombos() {
    await this.LoadFormPopup();
  }

  public comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const fechaInicio = group.controls['fechaInicio'];
      const fechaFin = group.controls['fechaFin'];
      const estado = group.controls['estado'];
      if (!fechaInicio.value || !fechaFin.value) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar ambas fechas.' };
      } else if (estado.value == null) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar un estado.' };
      } else {
        this.errorGeneral = { isError: false, errorMessage: '' };
      }
      return;
    };
  }

  compareTwoDates(): void {
    let vBeginDate = new Date(this.ingresoAlmacenForm.value.fechaInicio);
    let vEndDate = new Date(this.ingresoAlmacenForm.value.fechaFin);

    var anioFechaInicio = vBeginDate.getFullYear()
    var anioFechaFin = vEndDate.getFullYear()

    if (vEndDate < vBeginDate) {
      this.error = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio.' };
      this.ingresoAlmacenForm.value.fechaInicio.setErrors({ isError: true })
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 2) {
      this.error = { isError: true, errorMessage: 'Por favor el Rango de fechas no puede ser mayor a 2 años.' };
      this.ingresoAlmacenForm.value.fechaFin.setErrors({ isError: true })
    } else {
      this.error = { isError: false, errorMessage: '' };
    }
  }

  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.Numero.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  onSelect(event: any): void {
    this.selected = event.selected;
  }

  Buscar(): void {
    if (this.ingresoAlmacenForm.invalid || this.errorGeneral.isError) {
      this.submitted = true;
      return;
    } else {
      this.selected = [];
      this.submitted = false;
      const request = {
        FechaInicio: new Date(this.ingresoAlmacenForm.value.fechaInicio),
        FechaFin: new Date(this.ingresoAlmacenForm.value.fechaFin)
      };

      this.spinner.show(undefined,
        {
          type: 'ball-triangle-path',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        });

      this.ingresoAlmacenService.Consultar(request)
        .subscribe(res => {
          this.spinner.hide();
          if (res.Result.Success) {
            if (!res.Result.ErrCode) {
              res.Result.Data.forEach((obj: any) => {
                obj.FechaRegistroCadena = this.dateUtil.formatDate(new Date(obj.FechaRegistro));
              });
              this.tempData = res.Result.Data;
              this.rows = [...this.tempData];
            } else if (res.Result.Message && res.Result.ErrCode) {
              this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
            } else {
              this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
            }
          } else {
            this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
          }
        },
          err => {
            this.spinner.hide();
            console.error(err);
            this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
          }
        );
    }
  }
}
