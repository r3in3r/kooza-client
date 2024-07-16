import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-game-server-list',
  templateUrl: './game-server-list.component.html',
  styleUrls: ['./game-server-list.component.scss']
})
export class GameServerListComponent implements OnInit {
  allData: any[] = [];
  displayData: any[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';
  pageSize = 20;
  currentPage = 1;
  totalItems = 0;
  nextPageKey: string | null = null;
  prevPageKey: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(pageKey?: string) {
    this.dataService.getData(pageKey).subscribe(
      response => {
        console.log('Response from data service:', response);
        if (response.data.length === 0) {
          console.warn('The response is empty.');
        }
        this.allData = response.data.map((server: any) => ({
          name: server.attributes.name,
          players: server.attributes.players,
          ip: server.attributes.ip,
          port: server.attributes.port,
          map: server.attributes.details.map,
          appId: server.attributes.details.appId,
          country: server.attributes.country.toLowerCase(),
          status: server.attributes.status
        }));
        this.totalItems = response.meta?.total || 0;
        this.nextPageKey = response.links?.next?.split('page[key]=')[1] || null;
        this.prevPageKey = response.links?.prev?.split('page[key]=')[1] || null;
        this.currentPage = 1;  // Reset to first page when new data is loaded
        this.updateDisplayData();
        console.log('Processed data:', this.allData);
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  updateDisplayData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayData = this.allData.slice(startIndex, startIndex + this.pageSize);
    this.filteredData = this.displayData;
  }

  onNextPage() {
    if (this.currentPage * this.pageSize < this.allData.length) {
      this.currentPage++;
      this.updateDisplayData();
    } else if (this.nextPageKey) {
      this.loadData(this.nextPageKey);
    }
  }

  onPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayData();
    } else if (this.prevPageKey) {
      this.loadData(this.prevPageKey);
    }
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
      this.filteredData = this.displayData.filter(server =>
        server.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getMaxDisplayed(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  getMinDisplayed(): number {
    return ((this.currentPage - 1) * this.pageSize) + 1;
  }
}
