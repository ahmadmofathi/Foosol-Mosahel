import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupscriptionService {

private apiUrl = environment.apiUrl;

constructor(private http: HttpClient) {}

  addSelection(payload: any): Observable<any> {
    const url = `${this.apiUrl}Auth/AddSelection`; // Full endpoint URL
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`

    });

    return this.http.post(url, payload, { headers });
  }
}
