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
    const queries = ['elephant', 'tiger', 'lion', 'panda', 'koala', 'kangaroo', 'rhino', 'giraffe',
  'gorilla', 'chimpanzee', 'orangutan', 'snow leopard', 'cheetah', 'jaguar',
  'polar bear', 'grizzly bear', 'red panda', 'zebra', 'hippopotamus', 'crocodile',
  'flamingo', 'peacock', 'wolf', 'fox', 'lynx', 'sloth', 'tapir', 'anteater',
  'armadillo', 'capybara', 'otter', 'beaver', 'badger', 'hedgehog', 'platypus',
  'emu', 'cassowary', 'lemur', 'wombat', 'bison', 'moose', 'caribou', 'reindeer'];
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

  getStatusClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'lc':
    case 'least_concern':
      return 'least-concern';
    case 'nt':
    case 'near_threatened':
      return 'near-threatened';
    case 'vu':
    case 'vulnerable':
      return 'vulnerable';
    case 'en':
    case 'endangered':
      return 'endangered';
    case 'cr':
    case 'critically_endangered':
      return 'critically-endangered';
    case 'ew':
    case 'extinct_in_the_wild':
      return 'extinct-in-wild';
    case 'ex':
    case 'extinct':
      return 'extinct';
    default:
      return 'unknown';
  }
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
