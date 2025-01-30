import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiUrl = environment.apiUrl;
  private privateAPI = `${environment.apiUrl}Lesson/CreateLesson`; // private baseUrl = 'https://localhost:7271/api/Lesson/CreateLesson/d8b6056b-2aeb-481e-8ba8-7ecc0de979bd';

  constructor(private http: HttpClient) {}

  // getAllClasses(pageNumber: number, pageSize: number): Observable<any> {
  //   // Construct the URL with path parameters
  //   const url = `${this.apiUrl}Grade/GetAllGrades/${pageNumber}/${pageSize}`;

  //   // Send the GET request without query parameters
  //   return this.http.get(url);
  // }

  getAllLessonsBySubjectId(
    subjectId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<any> {
    const url = `${this.apiUrl}Lesson/GetLessonsBySubjectId/${subjectId}/${pageNumber}/${pageSize}`;

    return this.http.get(url);
  }
  addLesson(subjectId: string, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}Lesson/CreateLesson/${subjectId}`;
    return this.http.post(url, formData);
  }

  createLesson(lessonData: any): Observable<any> {
    // Ensure LessonName is set and not null or undefined
    if (!lessonData.LessonName) {
      throw new Error('LessonName is required');
    }
    // Appending the ID to the API URL
    return this.http.post<any>(
      `${this.privateAPI}/b24a12f8-132e-4c80-b5b1-42abf795e944`,
      lessonData
    );
  }

  uploadLesson(lessonName: string, lessonResources: File[]): Observable<any> {
    const subjectId = localStorage.getItem('selectedSubjectId');
    if (!subjectId) {
      console.error('No subject selected');
      return of(null);
    }

    const url = `${this.apiUrl}Lesson/CreateLesson/${subjectId}`;
    const formData = new FormData();
    formData.append('LessonName', lessonName);
    console.log('lessonResources:', lessonResources);

    if (lessonResources.length > 0) {
      lessonResources.forEach((file) => {
        formData.append('lessonResources', file, file.name);
      });
    }
    const headers = { 'Content-Type': 'application/json' };
    // Set responseType to 'text'
    return this.http.post(url, formData, { responseType: 'text' });
    // return this.http.post(url, formData, { headers });
  }

  // Method to get lesson resources
  getLessonResources(): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const teacherId = authToken ? this.getTeacherIdFromToken(authToken) : null;
    const lessonId = localStorage.getItem('selectedLessonId');
    console.log(teacherId,lessonId);
    if (!teacherId || !lessonId) {
      console.error('Teacher ID or Lesson ID is missing');
      return new Observable();
    }

    const url = `${this.apiUrl}Lesson/GetTeacherResources/${teacherId}/${lessonId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      // Authorization: `Bearer ${environment.authToken}`,
    });

    return this.http.get(url, { headers });
  }
  getSelectedLessonResources(lessonId:string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const teacherId = authToken ? this.getTeacherIdFromToken(authToken) : null;
    // const lessonId = localStorage.getItem('selectedLessonId');
    console.log(teacherId,lessonId);
    if (!teacherId || !lessonId) {
      console.error('Teacher ID or Lesson ID is missing');
      return new Observable();
    }

    const url = `${this.apiUrl}Lesson/GetTeacherResources/${teacherId}/${lessonId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      // Authorization: `Bearer ${environment.authToken}`,
    });

    return this.http.get(url, { headers });
  }
  deleteResource(resourceId: string): Observable<HttpResponse<string>> {
    const authToken = localStorage.getItem('authToken');
    const teacherId = authToken ? this.getTeacherIdFromToken(authToken) : null;
    if (!teacherId) {
      console.error('Teacher ID is missing');
      return new Observable<any>();
    }

    const url = `${this.apiUrl}Lesson/TeacherDeleteResource/${teacherId}/${resourceId}/true`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      // Authorization: `Bearer ${environment.authToken}`,
    });

    return this.http.delete(url, {
      headers,
      observe: 'response',
      responseType: 'text',
    });
  }

  // lesson.service.ts
  addTeacherResource(formData: FormData): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const teacherId = authToken ? this.getTeacherIdFromToken(authToken) : null;
    const lessonId = localStorage.getItem('selectedLessonId');

    if (!teacherId || !lessonId) {
      console.error('Teacher ID or Lesson ID is missing');
      return new Observable<any>();
    }

    const url = `${this.apiUrl}Lesson/AddTeacherResource/${teacherId}/${lessonId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      // Authorization: `Bearer ${environment.authToken}`,
    });

    return this.http.post(url, formData, { headers, responseType: 'text' });
  }

  // Helper method to extract teacher ID from auth token
  private getTeacherIdFromToken(token: string): string | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.sub || null;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
}
