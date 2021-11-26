import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class NotaingresoacopioService {

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  private url = `${host}NotaIngresoAcopio`;

  Save(request: any): Observable<any> {
    const url = `${this.url}/Registrar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Search(request: any): Observable<any> {
    const url = `${this.url}/Consultar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  SearchById(request: any): Observable<any> {
    const url = `${this.url}/ConsultarPorId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  UbicarAlmacen(request: any): Observable<any> {
    const url = `${this.url}/UbicarAlmacen`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConfirmarEtiquetado(request: any): Observable<any> {
    const url = `${this.url}/ConfirmarEtiquetado`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarDevolucion(request: any): Observable<any> {
    const url = `${this.url}/ConsultarDevolucion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  RegistrarDevolucion(request: any): Observable<any> {
    const url = `${this.url}/RegistrarDevolucion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarDevolucionPorId(request: any): Observable<any> {
    const url = `${this.url}/ConsultarDevolucionPorId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConfirmarAtencionCompleta(request: any): Observable<any> {
    const url = `${this.url}/ConfirmarAtencionCompleta`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
}
