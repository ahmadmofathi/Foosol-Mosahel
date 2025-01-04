import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private pdfUrl = '../../../assets/download.pdf';

  constructor(private http: HttpClient) {}

  getPDF(): Observable<Blob> {
    return this.http.get(this.pdfUrl, { responseType: 'blob' });
  }
}
