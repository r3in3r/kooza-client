import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-game-server-list',
  templateUrl: './game-server-list.component.html',
  styleUrls: ['./game-server-list.component.scss']
})
export class GameServerListComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.dataService.getData().subscribe(
      response => {
        console.log('Response from data service:', response);
        if (response.length === 0) {
          console.warn('The response is empty.');
        }
        this.data = response;
        this.filteredData = this.data; // Initialize filtered data
        console.log('Processed data:', this.data);
      },
      error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check the console for details.');
      }
    );
  }

  joinServer(ip: string, port: number): void {
    const steamConnectUrl = `steam://connect/${ip}:${port}`;
    console.log('Connecting to:', steamConnectUrl);
    window.location.href = steamConnectUrl;
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.searchTerm = inputElement.value;
      this.filteredData = this.data.filter(server => server.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
  }
}
