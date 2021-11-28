import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class GuiaremisionService {

  private url = `${host}GuiaRemision`;

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  Registrar(request: any): Observable<any> {
    const url = `${this.url}/Registrar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarPorCorrelativo(request: any): Observable<any> {
    const url = `${this.url}/ConsultarCorrelativo`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  RegistrarDevolucion(request: any): Observable<any> {
    const url = `${this.url}/RegistrarDevolucion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Consultar(request: any): Observable<any> {
    const url = `${this.url}/Consultar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
}
