import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {

  private apiUrl = environment.apiUrl; 
  constructor(private http : HttpClient) { }

  createLecture(classId: string, lessonId: string): Observable<any> {
    const url = `${this.apiUrl}Lecture/CreateLecture/${classId}/${lessonId}`;
    // const payload = { periodInMinutes };
  return this.http.post(url, null);
  }
  // createLecture(classId: string, lessonId: string, periodInMinutes : number): Observable<any> {
  //   const url = `${this.apiUrl}Lecture/CreateLecture/${classId}/${lessonId}`;
  //   const payload = { periodInMinutes };
  // return this.http.post(url, payload);
  // }

  setStatus(statusData: any): Observable<HttpResponse<any>> {
    const lectureId = localStorage.getItem('createdLectureId'); 
    if (!lectureId) {
      console.error('Lecture ID is missing from localStorage');
      return new Observable();
    }

    const url = `${this.apiUrl}Lecture/SetStats/${lectureId}`; 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
    });

    return this.http.post(url, statusData, { headers, observe: 'response', responseType: 'text' as 'json' });
  }

  setSetting(periodInMinutes: any): Observable<HttpResponse<any>> {
    const lectureId = localStorage.getItem('createdLectureId'); 
    if (!lectureId) {
      console.error('Lecture ID is missing from localStorage');
      return new Observable();
    }

    const url = `${this.apiUrl}Lecture/SetSettings/${lectureId}`; 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
    });

    return this.http.post(url, {periodInMinutes}, { headers, observe: 'response', responseType: 'text' as 'json' });
  }
}
