import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DbInteractionService {

  constructor(private http: HttpClient) { }
  callApi(flag,url,dt){
   if(flag > 0){
     return this.http.post(`${environment.apiUrl + url}`,dt);
   }
   else{
     const data = dt ? '?' + dt : '';
     return this.http.get(`${environment.apiUrl + url}` + data);
   }
  }
}
