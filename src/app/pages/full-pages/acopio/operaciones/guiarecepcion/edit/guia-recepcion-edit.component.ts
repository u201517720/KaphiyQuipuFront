import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guia-recepcion-edit',
  templateUrl: './guia-recepcion-edit.component.html',
  styleUrls: ['./guia-recepcion-edit.component.scss']
})
export class GuiaRecepcionEditComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  frmGuiaRecepcionDetalle: FormGroup;

  ngOnInit(): void {
  }

  LoadForm() {
    this.frmGuiaRecepcionDetalle = this.fb.group({

    });
  }

}
