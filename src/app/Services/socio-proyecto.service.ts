import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class SocioProyectoService {

  private url = `${host}SocioProyecto`;

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  Create(request: any): Observable<any> {
    const url = `${this.url}/Registrar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Update(request: any): Observable<any> {
    const url = `${this.url}/Actualizar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  SearchById(pId: number): Observable<any> {
    const url = `${this.url}/ConsultarPorId`;
    return this.http.post<any>(url, { SocioProyectoId: pId }).catch(this.errorHandling.handleError);
  }

  SearchByPartnerId(pId: number): Observable<any> {
    const url = `${this.url}/ConsultarPorSocioId`;
    return this.http.post<any>(url, { SocioId: pId }).catch(this.errorHandling.handleError);
  }
}
