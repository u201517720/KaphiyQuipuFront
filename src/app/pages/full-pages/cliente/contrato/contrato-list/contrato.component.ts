import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { DateUtil } from '../../../../../services/util/date-util';
import { MaestroUtil } from '../../../../../services/util/maestro-util';
import { ContratoService } from '../../../../../services/contrato.service';
import { TranslateService, TranslationChangeEvent, LangChangeEvent } from '@ngx-translate/core';
import { ContratoListTraduccion } from '../../../../../services/translate/contrato/contrato-list-translate';


@Component({
  selector: 'app-contrato-cliente',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContratoClienteComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dateUtil: DateUtil,
    private spinner: NgxSpinnerService,
    private maestroUtil: MaestroUtil,
    private contratoService: ContratoService,
    private translate: TranslateService
  ) {

  }
  public onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();
  contratoForm: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  listProductos: any[];
  listTipoProduccion: any[];
  listCalidad: any[];
  listEstadoMuestra: any[];
  listEstadoSeguimiento: any[];
  selectedProducto: any;
  selectedTipoProduccion: any;
  selectedCalidad: any;
  selectedEstadoMuestra: any;
  selectedEstadoSeguimiento: any;
  selected = [];
  limitRef = 10;
  rows = [];
  tempData = [];
  errorGeneral = { isError: false, msgError: '' };
  msgErrorGenerico = 'Ocurrio un error interno.';
  userSession: any;
  browserLang: string;
  @Input() popUp = false;
  @Output() agregarContratoEvent = new EventEmitter<any>();
  contratoListTraduccion: ContratoListTraduccion;

  ngOnInit(): void {
    this.userSession = JSON.parse(localStorage.getItem('user'));
    this.LoadForm();
    this.LoadCombos(this.translate.getDefaultLang());
    this.contratoForm.controls['fechaInicial'].setValue(this.dateUtil.currentMonthAgo());
    this.contratoForm.controls['fechaFinal'].setValue(this.dateUtil.currentDate());
    this.contratoListTraduccion = new ContratoListTraduccion();
    this.translate.onLangChange.subscribe((event: TranslationChangeEvent) => {
      localStorage.setItem("language", event.lang);
      this.listEstadoMuestra = [];
      this.LoadCombos(event.lang);
      this.rows = [];
    });


    this.cargarCliente(this.userSession);
  }


  LoadForm(): void {
    this.contratoForm = this.fb.group({
      nroContrato: [],
      codCliente: [],
      fechaInicial: [, Validators.required],
      fechaFinal: [, Validators.required],
      descCliente: [],
      producto: [],
      tipoProduccion: [],
      calidad: [],
      estadoMuestra: [],
      estadoSeguimiento: []
    });
  }
  cargarCliente(objLogin) {
    if (objLogin.Result.Data.CodigoCliente) {
      this.contratoForm.controls["codCliente"].setValue(objLogin.Result.Data.CodigoCliente);
      this.contratoForm.value.codCliente = objLogin.Result.Data.CodigoCliente;
      this.contratoForm.controls["descCliente"].setValue(objLogin.Result.Data.Cliente);
      this.contratoForm.controls["codCliente"].disable();
      this.contratoForm.controls["descCliente"].disable();
    }
  }

  get f() {
    return this.contratoForm.controls;
  }

  updateLimit(event: any): void {
    this.limitRef = event.target.value;
  }

  filterUpdate(event: any): void {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.Numero.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  onSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  LoadCombos(lang: string): void {
    const form = this;
    this.maestroUtil.obtenerMaestros('EstadoMuestra', (res: any) => {
      if (res.Result.Success) {
        if (lang == 'en') {
          var list = []
          res.Result.Data.forEach(x => {
            let object: any = {};
            object.Codigo = x.Codigo;
            object.Label = x.Mnemonico;
            list.push(object);
          });
          form.listEstadoMuestra = list;
        }
        else {
          form.listEstadoMuestra = res.Result.Data;
        }
      }
    }, lang);
    this.maestroUtil.obtenerMaestros('EstadoSeguimientoAduana', (res: any) => {
      if (res.Result.Success) {
        if (lang == 'en') {
          var list = []
          res.Result.Data.forEach(x => {
            let object: any = {};
            object.Codigo = x.Codigo;
            object.Label = x.Mnemonico;
            list.push(object);
          });
          form.listEstadoSeguimiento = list;
        }
        else {
        form.listEstadoSeguimiento = res.Result.Data;
        }
      }
    }, lang);
    this.maestroUtil.obtenerMaestros('Producto', (res: any) => {
      if (res.Result.Success) {
        if (lang == 'en') {
          var list = []
          res.Result.Data.forEach(x => {
            let object: any = {};
            object.Codigo = x.Codigo;
            object.Label = x.Mnemonico;
            list.push(object);
          });
          form.listProductos = list;
        }
        else {
        form.listProductos = res.Result.Data;
        }
      }
    }, lang);
    this.maestroUtil.obtenerMaestros('TipoProduccion', (res: any) => {
      if (res.Result.Success) {
        if (lang == 'en') {
          var list = []
          res.Result.Data.forEach(x => {
            let object: any = {};
            object.Codigo = x.Codigo;
            object.Label = x.Mnemonico;
            list.push(object);
          });
          form.listTipoProduccion = list;
        }
        else {
        form.listTipoProduccion = res.Result.Data;
        }
      }
    }, lang);
    this.maestroUtil.obtenerMaestros('Calidad', (res: any) => {
      if (res.Result.Success) {
        if (lang == 'en') {
          var list = []
          res.Result.Data.forEach(x => {
            let object: any = {};
            object.Codigo = x.Codigo;
            object.Label = x.Mnemonico;
            list.push(object);
          });
          form.listCalidad = list;
        }
        else {
        form.listCalidad = res.Result.Data;
        }
      }
    }, lang);
  }

  getRequest(lang: string): any {
    return {
      Numero: this.contratoForm.value.nroContrato ? this.contratoForm.value.nroContrato : '',
      NumeroCliente: this.contratoForm.controls.codCliente.value ? this.contratoForm.controls.codCliente.value : '',
      RazonSocial: this.contratoForm.value.descCliente ? this.contratoForm.value.descCliente : '',
      ProductoId: this.contratoForm.value.producto ? this.contratoForm.value.producto : '',
      TipoProduccionId: this.contratoForm.value.tipoProduccion ? this.contratoForm.value.tipoProduccion : '',
      CalidadId: this.contratoForm.value.calidad ? this.contratoForm.value.calidad : '',
      EstadoMuestraId: this.contratoForm.value.estadoMuestra ? this.contratoForm.value.estadoMuestra : '',
      EstadoSeguimientoId: this.contratoForm.value.estadoSeguimiento ? this.contratoForm.value.estadoSeguimiento : '',
      EmpresaId: this.userSession.Result.Data.EmpresaId,
      FechaInicio: this.contratoForm.value.fechaInicial ? this.contratoForm.value.fechaInicial : '',
      FechaFin: this.contratoForm.value.fechaFinal ? this.contratoForm.value.fechaFinal : '',
      Idioma: lang
    };
  }
//test
  Buscar(lang: string): void {
    var lenguaje = localStorage.getItem("language");
    lang = lang == '' ? (lenguaje == null ? this.translate.getDefaultLang() : lenguaje) : lang;
    this.Search(lang);
  }

  Search(lang: string, xls = false): void {
    if (!this.contratoForm.invalid && !this.errorGeneral.isError) {
      this.spinner.show();
      const request = this.getRequest(lang);
      this.contratoService.ConsultarTrackingContrato(request).subscribe((res: any) => {
        this.spinner.hide();
        if (res.Result.Success) {
          this.errorGeneral = { isError: false, msgError: '' };
          res.Result.Data.forEach((obj: any) => {
            obj.FechaContratoString = this.dateUtil.formatDate(new Date(obj.FechaContrato));
          });
          this.rows = res.Result.Data;
          this.tempData = this.rows;

        } else {
          this.errorGeneral = { isError: true, msgError: res.Result.Message };
        }
      }, (err: any) => {
        this.spinner.hide();
        console.log(err);
        this.errorGeneral = { isError: true, msgError: this.msgErrorGenerico };
      });
    } else {

    }
  }



}
