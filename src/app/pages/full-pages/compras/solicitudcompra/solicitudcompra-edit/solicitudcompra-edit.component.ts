import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-solicitudcompra-edit',
  templateUrl: './solicitudcompra-edit.component.html',
  styleUrls: ['./solicitudcompra-edit.component.scss']
})
export class SolicitudcompraEditComponent implements OnInit {

  frmSolicitudCompraNew: FormGroup;
  frmTitle = 'REGISTRO DE SOLICITUD DE COMPRA';
  listPaises: any[];
  listCiudades: any[];
  listMonedas: any[];
  listUniMedida: any[];
  listTipoProduccion: any[];
  listEmpaques: any[];
  listTiposEmpaques: any[];
  listProductos: any[];
  listSubProductos: any[];
  listGradosPreparacion: any[];
  listCalidad: any[];
  selectedPais: any;
  selectedCiudad: any;
  selectedMoneda: any;
  selectedUniMedida: any;
  selectedTipoProduccion: any;
  selectedEmpaque: any;
  selectedTipoEmpaque: any;
  selectedProducto: any;
  selectedSubProducto: any;
  selectedGradoPreparacion: any;
  selectedCalidad: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmSolicitudCompraNew = this.fb.group({
      pais: [],
      ciudad: [],
      moneda: [],
      unidadMedida: [],
      tipoProduccion: [],
      empaque: [],
      tipoEmpaque: [],
      producto: [],
      subProducto: [],
      gradoPreparacion: [],
      calidad: [],
      cantASolicitar: [],
      pesoXSaco: [],
      pesoEnKilos: [],
      observaciones: []
    });
  }

  get f() {
    return this.frmSolicitudCompraNew.controls;
  }

  onChangePais(e: any) {

  }

  ChangeProduct(e: any) {

  }

  EnviarSolicitud() {

  }

  CalcularPesoEnKilos() {

  }

  Cancelar() {

  }

}
