import { Component, OnInit } from '@angular/core';
import { InaturalistService, Species } from '../services/inaturalist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-endangered-animal-page',
  templateUrl: './endangered-animal-page.component.html',
  styleUrls: ['./endangered-animal-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EndangeredAnimalPageComponent implements OnInit {
  threatenedSpecies: Species[] = [];
  loading = false;
  error: string | null = null;
  selectedSpecies: Species | null = null;

  constructor(private inaturalistService: InaturalistService) {}

  ngOnInit() {
    const queries = ['elephant', 'tiger', 'panda', 'rhino', 'gorilla', 'orangutan', 'snow leopard', 'cheetah', 'jaguar', 'lion'];
    queries.forEach(query => this.fetchThreatened(query));
  }

  fetchThreatened(query: string): void {
    this.loading = true;
    this.error = null;

    const statusPriority: Record<string, number> = { cr: 1, en: 2, vu: 3 };

    this.inaturalistService.getThreatenedSpecies(query).subscribe({
      next: (data) => {
        this.threatenedSpecies = [
          ...this.threatenedSpecies,
          ...data
        ].sort((a, b) =>
          (statusPriority[a.conservation_status?.status?.toLowerCase() || 'vu'] ?? 4) -
          (statusPriority[b.conservation_status?.status?.toLowerCase() || 'vu'] ?? 4)
        ).slice(0, 10);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load species';
        this.loading = false;
      }
    });
  }

  getConservationStatusFull(statusCode?: string): string {
    const conservationStatusMap: { [key: string]: string } = {
      cr: 'Critically Endangered',
      en: 'Endangered',
      vu: 'Vulnerable',
      nt: 'Near Threatened',
      lc: 'Least Concern',
      dd: 'Data Deficient',
      ne: 'Not Evaluated',
      ex: 'Extinct',
      ew: 'Extinct in the Wild'
    };
    if (!statusCode) return 'Unknown';
    return conservationStatusMap[statusCode.toLowerCase()] || statusCode;
  }

  openPopup(species: Species): void {
    this.selectedSpecies = species;
  }

  closePopup(): void {
    this.selectedSpecies = null;
  }

selectedLocation: { lat: number, lng: number } | null = null;

showDetails(species: Species) {
  this.selectedSpecies = species;
  this.selectedLocation = null;

  if (species.id) {
    this.inaturalistService.getObservationByTaxonId(species.id).subscribe(obs => {
      if (obs && obs.geojson) {
        this.selectedLocation = {
          lat: obs.geojson.coordinates[1],
          lng: obs.geojson.coordinates[0]
        };
      }
    });
  }
}


}
