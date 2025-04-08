import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private apiUrl2 =
    environment.apiUrl+'api/Auth/RegisterTeacher';

  constructor(private http: HttpClient) {}

  login(credentials: { phone: string; password: string }): Observable<any> {
    // Send the POST request with email and password in the body
    return this.http.post(`${this.apiUrl}Auth`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggin(): boolean {
    return !!localStorage.getItem('authToken');
  }

  Logout = (): void => {
    localStorage.removeItem('authToken');
  };

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);

    const userDetail = {
      id: decodedToken.sub,
      fullName: decodedToken.given_name + ' ' + decodedToken.family_name,
      role: decodedToken.role || [],
    };

    return userDetail;
  };

  register(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl2, formData);
  }
}
