import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private apiUrl = environment.apiUrl; 
  private PrivateUrl = 'https://localhost:7271/api/Subject/AddSubject';

  constructor(private http : HttpClient) { }

  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Subject/GetAllSubjects`); // Adjust the data type if needed
  }

  // addGrade(element: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}Grade/AddGrade`, element); // Adjust the data type if needed
  // }
  addSubject(gradeId: string, gradeData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    // Update URL to include gradeId in the path
    const url = `https://localhost:7271/api/Subject/AddSubject/${gradeId}`;
    
    // Send the request with gradeData as the body
    return this.http.post(url, gradeData, { headers });
  }
  
  deleteSubject(subjectId: string): Observable<any> {
    console.log('ID received in service:', subjectId);  // Ensure ID is passed
    return this.http.delete(`${this.apiUrl}Subject/DeleteSubject/${subjectId}`);
  }

  updateSubject(id: string, updatedSubject: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}Subject/EditSubject/${id}`, updatedSubject);
  }
}
