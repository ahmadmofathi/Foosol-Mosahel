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
    const url = `${this.apiUrl}Class/AddClass/${gradeId}`;
    const token = localStorage.getItem('authToken');
    console.log(token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    // Set responseType to 'text' to handle plain text response
    return this.http.post(url, classData, { headers, responseType: 'text' });
  }
  addExistingStudentToClass(classIds: string, stdNumber: string): Observable<any> {
    const url = `${this.apiUrl}Class/AddStudent/${classIds}/${stdNumber}`;
    const token = localStorage.getItem('authToken');
    console.log(token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post(url, {},{ headers, responseType: 'text' });
  }
  

  getClassesByGradeId(gradeId: string): Observable<any> {
    const url = `${this.apiUrl}Class/GetTeacherClasses/${gradeId}`;
    const token = localStorage.getItem('authToken');
    console.log(token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url,{ headers });
  }
  
  getStudentsInClass(classId: string ,pageNumber: number, pageSize: number): Observable<any>{

    const url = `${this.apiUrl}Class/GetStudents/${classId}/${pageNumber}/${pageSize}`;

    return this.http.get(url);

  }
  
  

}
