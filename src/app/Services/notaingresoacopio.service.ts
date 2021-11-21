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
}
