import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = environment.apiUrl;
  // private PrivateUrl = 'https://localhost:7271/api/Grade/AddGrade'
  // private baseUrl = 'https://localhost:7271/api/Grade/GetByLevelId';

  private PrivateUrl =
  environment.apiUrl+'api/Grade/AddGrade';

  constructor(private http: HttpClient) {}

  getAllGrades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Grade/GetAllGrades`); // Adjust the data type if needed
  }

  getGradesByLevelId(
    levelId: string,
    pageNumber: number,
    itemsPerPage: number
  ): Observable<any> {
    const url = `${this.apiUrl}Grade/GetByLevelId/${levelId}/${pageNumber}/${itemsPerPage}`;
    return this.http.get<any>(url);
  }

  // getAllClasses(pageNumber: number, pageSize: number): Observable<any> {

  //   let params = new HttpParams()
  //     .set('pageNumber', pageNumber.toString())
  //     .set('pageSize', pageSize.toString());

  //   // Send the GET request with headers
  //   return this.http.get(`${this.apiUrl}Grade/GetAllGrades`, { params });

  // }

  getAllClasses(pageNumber: number, pageSize: number): Observable<any> {
    // Construct the URL with path parameters
    const url = `${this.apiUrl}Grade/GetAllGrades/${pageNumber}/${pageSize}`;

    // Send the GET request without query parameters
    return this.http.get(url);
  }

  addGrade(levelId: string, gradeData: any): Observable<any> {
    // Construct the URL with the levelId as a path parameter
    const url = `${this.PrivateUrl}/${levelId}`;

    // Set headers for the POST request
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Send the POST request with gradeData in the body and headers
    return this.http.post(url, gradeData, { headers });
  }

  // addGrade(levelId: string, gradeData: any): Observable<any> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   const params = { levelId: levelId };

  //   return this.http.post(this.PrivateUrl, gradeData, { headers, params });
  // }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Grade/DeleteGrade/${id}`);
  }

  updateGrade(id: string, updatedGrade: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}Grade/EditGrade/${id}`, updatedGrade);
  }
}
