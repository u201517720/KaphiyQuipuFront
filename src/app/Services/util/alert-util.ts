import { Injectable } from '@angular/core';
import swal from 'sweetalert2';


@Injectable()
export class AlertUtil {

  constructor() { }

  alertError(title: String, mensaje: any) {
    swal.fire({
      icon: "error",
      title: title,
      text: mensaje,
      customClass: {
        confirmButton: 'btn btn-error'
      },
    })
  }

  alertOk(title: String, mensaje: any) {
    swal.fire({
      icon: "success",
      title: title,
      text: mensaje,
      customClass: {
        confirmButton: 'btn btn-success'
      },
    })
  }

  alertOkCallback(title: String, mensaje: any, callback) {
    swal.fire({
      icon: "success",
      title: title,
      text: mensaje,
      customClass: {
        confirmButton: 'btn btn-success'
      },
    }).then((result) => {

      callback(result); // this should execute now

    })
  }

  alertSiNoCallback(title: String, mensaje: any, callback) {
    swal.fire({
      icon: "warning",
      title: title,
      text: mensaje,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {

      callback(result); // this should execute now

    })
  }

  alertRegistro(title: String, mensaje: any, callback) {
    swal.fire({
      title: title,
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2F8BE6',
      cancelButtonColor: '#F55252',
      confirmButtonText: 'Si',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      buttonsStyling: false,
    }).then(function (result) {
      callback(result);
    });
  }

  alertWarning(title: String, mensaje: any) {
    swal.fire({
      icon: "warning",
      title: title,
      text: mensaje,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
    })
  }

  alertWarningCallback(title: String, mensaje: any, callback) {
    swal.fire({
      icon: "warning",
      title: title,
      text: mensaje,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
    }).then((result) => {
      callback(result); // this should execute now
    })
  }

}
