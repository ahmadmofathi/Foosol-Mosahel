import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  
private apiUrl = environment.apiUrl; 

  constructor(private http : HttpClient) { }

   addSubjectPrice(element: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}Subject/AddSubjectPrice`, element); // Adjust the data type if needed
    }
}
