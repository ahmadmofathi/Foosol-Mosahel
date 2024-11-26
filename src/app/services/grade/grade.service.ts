import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private apiUrl = environment.apiUrl; 
  private PrivateUrl = 'https://localhost:7271/api/Grade/AddGrade'

  constructor(private http : HttpClient) { }

  getAllGrades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Grade/GetAllGrades`); // Adjust the data type if needed
  }

  // addGrade(element: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}Grade/AddGrade`, element); // Adjust the data type if needed
  // }
  addGrade(levelId: string, gradeData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = { levelId: levelId };
    
    return this.http.post(this.PrivateUrl, gradeData, { headers, params });
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Grade/DeleteGrade/${id}`);
  }

  updateGrade(id: string, updatedGrade: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}Grade/EditGrade/${id}`, updatedGrade);
  }
}
