import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class DbInteractionService {
  constructor(private http: HttpClient,private service: LoaderService) { }
  callApi(flag,url,dt){
   if(flag > 0){
     return this.http.post(`${environment.apiUrl + url}`,dt);
   }
   else{
     const data = dt ? '?' + dt : '';
     return this.http.get(`${environment.apiUrl + url}` + data);
   }
  }
  loggedout(){
    console.log('asaas');
    this.callApi(1,'logout',{id:localStorage.getItem('id')}).pipe((map((x: any)=> x.suc))).subscribe(res =>{
      console.log('ss');
       if(res > 0){
        localStorage.clear();
        this.service.navigateToParicularPage('/',null);
       }
    });
  }
}
