import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable()
export class NotaIngresoAlmacenService {
  private url = `${host}NotaIngresoAlmacen`;

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  enviarAlmacen(id: number, username: string): Observable<any> {
    const url = `${this.url}/Registrar`;

    const body: any = {
      GuiaRecepcionMateriaPrimaId: id,
      Usuario: username
    };
    return this.http.post<any>(url, body).catch(this.errorHandling.handleError);
  }

  Consultar(request: any): Observable<any> {
    const url = `${this.url}/Consultar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Anular(notaIngresoAlmacenId: number, usuario: string): Observable<any> {
    const url = `${this.url}/Anular`;
    let request = {
      NotaIngresoAlmacenId: notaIngresoAlmacenId,
      Usuario: usuario
    }
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  obtenerDetalle(id: number): Observable<any> {
    const url = `${this.url}/ConsultarPorId`;

    const body: any = {
      NotaIngresoAlmacenId: id
    };
    return this.http.post<any>(url, body).catch(this.errorHandling.handleError);
  }
  actualizar(notaIngresoAlmacenId: number, usuario: string, almacenId: string): Observable<any> {
    const url = `${this.url}/Actualizar`;
    let request = {
      NotaIngresoAlmacenId: notaIngresoAlmacenId,
      Usuario: usuario,
      AlmacenId: almacenId
    }
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

}