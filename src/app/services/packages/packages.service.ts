import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  private apiUrl = environment.apiUrl; 
  

  constructor(private http : HttpClient) { }

getAllPackages(pageNumber: number, pageSize: number): Observable<any> {
  // Update the URL to include the pageNumber and pageSize in the path
  return this.http.get<any[]>(`${this.apiUrl}Packages/${pageNumber}/${pageSize}`);
}

addPackage(packageData: { name: string, startDate: string, endDate: string }): Observable<any> {
  const url = `${this.apiUrl}Packages`; // API URL for adding a new package
  return this.http.post<any>(url, packageData); // Send the POST request with the package data
}

deletePackage(id: string): Observable<any> {
  const url = `${this.apiUrl}Packages/delete/${id}`; // Append ID to the URL
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  return this.http.post(url, null, { headers }); // POST method without body
}

}