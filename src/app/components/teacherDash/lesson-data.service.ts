import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LessonDataService {
  httpClient = inject(HttpClient);

  isImage(src: string): boolean {
    const imagePattern = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imagePattern.test(src);
  }
  isVideo(src: string): boolean {
    const videoPattern = /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i;
    return videoPattern.test(src);
  }
  getLessonData(id: string): Observable<any> {
    const resourcesUrl = `${environment.apiUrl}Lesson/GetLessonResources${id}`;
    return this.httpClient.get(resourcesUrl);
  }
}
