// src/app/retailers/retailers.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-retailers',
  templateUrl: './retailers.component.html',
  styleUrls: ['./retailers.component.scss']
})
export class RetailersComponent implements OnInit {
  data: any[] = [];
  displayedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 50;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe(
      response => {
        console.log('Response from data service:', response);
        if (response.length === 0) {
          console.warn('The response is empty.');
        }
        this.data = response.map((server: any) => ({
          name: server.attributes.name,
          players: server.attributes.players,
          ip: server.attributes.ip,
          port: server.attributes.port,
          map: server.attributes.details.map,
          appId: server.attributes.details.appId,
          country: server.attributes.country.toLowerCase(), // Ensure country code is lowercase
          status: server.attributes.status
        }));
        console.log('Processed data:', this.data);
        this.updateDisplayedData();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedData = this.data.slice(startIndex, endIndex);
    console.log('Displayed data:', this.displayedData);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  getTotalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  joinServer(ip: string, port: number, appId: number): void {
    const steamConnectUrl = `steam://connect/${ip}:${port}/${appId}`;
    window.location.href = steamConnectUrl;
  }
}
