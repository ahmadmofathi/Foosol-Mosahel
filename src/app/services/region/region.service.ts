import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private apiUrl = environment.apiUrl; 
  

  constructor(private http : HttpClient) { }

  getAllRegions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Region/GetAllRegions`); // Adjust the data type if needed
  }

  getAllRe(pageNumber: number, pageSize: number): Observable<any> {
 
    const url = `${this.apiUrl}Region/GetAllRegions/${pageNumber}/${pageSize}`;
  
    // Send the GET request without query parameters
    return this.http.get(url);

  }


  addRegion(element: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Region/AddRegion`, element); // Adjust the data type if needed
  }

  deleteRegion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Region/DeleteRegion/${id}`);
  }

  updateRegion(id: string, updatedRegion: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}Region/EditRegion/${id}`, updatedRegion);
  }
}
