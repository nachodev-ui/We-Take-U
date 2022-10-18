import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API = 'http://localhost:1337/api/sedes';

  constructor(private client : HttpClient) { }

  getSedes() {
    return this.client.get('http://localhost:1337/api/sedes');
  }

}
