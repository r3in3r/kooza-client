import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.battlemetrics.com/servers';
  private game = 'rust';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImJlYWRmMWNmMTNiZmM3NmYiLCJpYXQiOjE3MTc1MjUzNDQsIm5iZiI6MTcxNzUyNTM0NCwiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjo4NjgxMDgifQ.2pYP4c7L8AZO5y9-ZrCQK1CwqqoWTdCkusJduZbLFOg';

  constructor(private http: HttpClient) {}

  getData(pageKey?: string): Observable<any> {
    const url = `${this.apiUrl}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    let params = new HttpParams()
      .set('filter[game]', this.game)
      .set('page[size]', '100');

    if (pageKey) {
      params = params.set('page[key]', pageKey);
    }

    console.log('Request URL:', url);
    console.log('Request Params:', params.toString());

    return this.http.get<any>(url, { headers, params }).pipe(
      map(response => {
        console.log('API Response:', response);
        if (response && response.data) {
          return {
            data: response.data,
            meta: response.meta,
            links: response.links
          };
        } else {
          console.warn('Empty or malformed response:', response);
          return { data: [], meta: null, links: null };
        }
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(error);
      })
    );
  }
}
