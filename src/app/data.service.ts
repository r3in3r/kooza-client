// src/app/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.battlemetrics.com/servers?filter[game]=palworld';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      map((response: any) => {
        console.log('API response:', response);
        if (response && response.data) {
          return response.data;
        } else {
          console.warn('Empty or malformed response:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(error);
      })
    );
  }
}
