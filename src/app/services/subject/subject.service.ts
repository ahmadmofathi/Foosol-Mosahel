import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = environment.apiUrl;
  private PrivateUrl = 'https://mousahel2-001-site3.ptempurl.com/api/Subject/AddSubject';

  // private PrivateUrl = 'https://threeclix.runasp.net/api/Subject/AddSubject';

  constructor(private http: HttpClient) {}

  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Subject/GetAllSubjects`); // Adjust the data type if needed
  }

  getAllSub(pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.apiUrl}Subject/GetAllSubjects/${pageNumber}/${pageSize}`;

    // Send the GET request without query parameters
    return this.http.get(url);
  }

  getSubjectsByGradeId(
    gradeId: string,
    pageNumber: number,
    itemsPerPage: number
  ): Observable<any> {
    const url = `${this.apiUrl}Subject/GetByGradeId/${gradeId}/${pageNumber}/${itemsPerPage}`;
    return this.http.get<any>(url);
  }

  // addGrade(element: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}Grade/AddGrade`, element); // Adjust the data type if needed
  // }

  addSubject(gradeId: string, gradeData: any): Observable<any> {
    // Construct the URL with the levelId as a path parameter
    const url = `${this.PrivateUrl}/${gradeId}`;

    // Set headers for the POST request
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Send the POST request with gradeData in the body and headers
    return this.http.post(url, gradeData, { headers });
  }

  // addSubject(gradeId: string, gradeData: any): Observable<any> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');

  //   // Update URL to include gradeId in the path
  //   const url = `https://localhost:7271/api/Subject/AddSubject/${gradeId}`;

  //   // Send the request with gradeData as the body
  //   return this.http.post(url, gradeData, { headers });
  // }

  deleteSubject(subjectId: string): Observable<any> {
    console.log('ID received in service:', subjectId); // Ensure ID is passed
    return this.http.delete(`${this.apiUrl}Subject/DeleteSubject/${subjectId}`);
  }

  updateSubject(id: string, updatedSubject: any): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}Subject/EditSubject/${id}`,
      updatedSubject
    );
  }

  addSubjectPrice(data: {
    subjectId: string;
    levelId: string;
    classId: string;
    price: number;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}Subject/AddSubjectPrice`, data, {
      headers,
    });
  }
}
