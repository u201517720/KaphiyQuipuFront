import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private url = `${host}Maestro`;

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) { }

    ObtenerTipoCambio(): Observable<any> {
    const url = `${this.url}/GetExchangeRate`;
    return this.http.post<any>(url, {}).catch(this.errorHandling.handleError);
  }


}