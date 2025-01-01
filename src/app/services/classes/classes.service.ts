import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

   private apiUrl = environment.apiUrl; 
  //  private PrivateUrl = 'https://threeclix.runasp.net/api/Class/AddClass'


   constructor(private http:HttpClient) { }


   addClass(gradeId: string, teacherId: string, classData: any): Observable<any> {
    const url = `${this.apiUrl}Class/AddClass/${gradeId}/${teacherId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    // Set responseType to 'text' to handle plain text response
    return this.http.post(url, classData, { headers, responseType: 'text' });
  }
  

  getClassesByGradeId(gradeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Class/GetClasses/${gradeId}`);
  }
  
 
  getStudentsInClass(classId: string ,pageNumber: number, pageSize: number): Observable<any>{

    const url = `${this.apiUrl}Class/GetStudents/${classId}/${pageNumber}/${pageSize}`;

    return this.http.get(url);

  }
  
  

}
