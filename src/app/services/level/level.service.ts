import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = environment.apiUrl; 
  

  constructor(private http : HttpClient) { }

  getAllLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Level/GetAllLevels`); // Adjust the data type if needed
  }

  addLevel(element: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Level/AddLevel`, element); // Adjust the data type if needed
  }

  deleteLEvel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Level/DeleteRegion/${id}`);
  }

  updateLevel(id: string, updatedLevel: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}Level/EditLevel/${id}`, updatedLevel);
  }
}
