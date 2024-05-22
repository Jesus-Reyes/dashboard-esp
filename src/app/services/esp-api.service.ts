import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../interfaces/Logs.interface';

@Injectable({
  providedIn: 'root'
})
export class EspApiService {

  constructor(
    private htttp: HttpClient
  ) { }


  getLogs(){
    return this.htttp.get<Log[]>(`http://3.88.206.120/api/v1/logs`);
  }


}
