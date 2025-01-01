import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private apiUrl = environment.apiUrl; 

  constructor(private http : HttpClient) { }

  // addStudent(element: any): Observable<any> {
  //   const token = localStorage.getItem('authToken'); // Replace 'authToken' with your actual token key
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });

  //   return this.http.post<any>(`${this.apiUrl}Auth/AddStudent`, element, { headers });
  // }

  
  addStudent(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}Auth/AddStudent`; // Adjust the endpoint as needed
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Retrieve token from localStorage
    });
    return this.http.post(url, formData, { headers });
  }

  addExitStudent(body: { studentPhoneNumber: string, classId: string, subjectIds: string[] }): Observable<any> {
    const url = `${this.apiUrl}Auth/AssignStudentToClass`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post(url, body, { headers });
  }

  getStudentByClassId(classId: string): Observable<any> {
    const url = `${this.apiUrl}Auth/GetStudentsInClass/${classId}`;
    const headers = new HttpHeaders({
      // Add any required headers here if needed (e.g., Authorization header)
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(url, { headers });
  }


  
}
