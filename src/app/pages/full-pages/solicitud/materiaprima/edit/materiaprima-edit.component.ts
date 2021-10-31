import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-materiaprima-edit',
  templateUrl: './materiaprima-edit.component.html',
  styleUrls: ['./materiaprima-edit.component.scss']
})
export class MateriaprimaEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

}
