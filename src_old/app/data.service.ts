import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.battlemetrics.com/servers';
  private game = 'rust';
  private token = 'YOUR_API_TOKEN'; // Replace with your actual token

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    const params = new URLSearchParams({
      'filter[game]': this.game,
      'filter[status]': 'online',
      'sort': 'name',
      'page[size]': '100', // Fetch 100 items in a single page
      'fields[server]': 'name,ip,port,players,country,status,map'
    });

    const url = `${this.apiUrl}?${params.toString()}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    console.log('Request URL:', url); // Log the request URL for debugging

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        console.log('API Response:', response); // Log the response for debugging
        if (response && response.data) {
          return response.data.map((server: any) => ({
            name: server.attributes.name,
            players: server.attributes.players,
            ip: server.attributes.ip,
            port: server.attributes.port,
            map: server.attributes.details.map,
            country: server.attributes.country.toLowerCase(), // Ensure country code is lowercase
            status: server.attributes.status
          }));
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
