import { Component, OnInit } from '@angular/core';
import { InaturalistService, Species } from '../services/inaturalist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Add this interface
interface ConservationVideo {
  title: string;
  description: string;
  embedUrl: SafeResourceUrl;
  duration: string;
}

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
  selectedLocation: { lat: number, lng: number } | null = null;
  
  // Add video property
  conservationVideos: ConservationVideo[] = [];

  constructor(
    private inaturalistService: InaturalistService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const queries = ['elephant', 'tiger', 'lion', 'panda', 'koala', 'kangaroo', 'rhino', 'giraffe',
      'gorilla', 'chimpanzee', 'orangutan', 'snow leopard', 'cheetah', 'jaguar',
      'polar bear', 'grizzly bear', 'red panda', 'zebra', 'hippopotamus', 'crocodile',
      'flamingo', 'peacock', 'wolf', 'fox', 'lynx', 'sloth', 'tapir', 'anteater',
      'armadillo', 'capybara', 'otter', 'beaver', 'badger', 'hedgehog', 'platypus',
      'emu', 'cassowary', 'lemur', 'wombat', 'bison', 'moose', 'caribou', 'reindeer'];
    
    queries.forEach(query => this.fetchThreatened(query));
    
    // Initialize videos
    this.initializeVideos();
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

  // Add video initialization method
 private initializeVideos(): void {
  const videoData = [
    {
      title: "What is an Endangered Species ?",
      description: "A WWF Wild Classroom episode explaining what 'endangered species' means, why animals become endangered, and how conservation efforts work to protect them.",
      youtubeId: "6tjDCZrGnxc",
      duration: "06:07"
    },
    {
      title: "How do we know if an Animal is Endangered",
      description: "An educational video where a student’s question is answered with fieldwork and data-driven insights into identifying endangered animals.",
      youtubeId: "OjDGRZxQ0B0",
      duration: "6:58"
    },
    {
      title: "How to Save our Forests and Rewild Our Planet",
      description: "Sir David Attenborough discusses the recovery of forests worldwide and shares how rewilding our planet is achievable.",
      youtubeId: "Ig9Tfc_hNsE",
      duration: "7:45"
    },
    {
      title: "How to Save our Planet ?",
      description: "Sir David Attenborough outlines actionable steps humans can take now to protect and restore Earth’s ecosystems.",
      youtubeId: "0Puv0Pss33M",
      duration: "8:28"
    },
    {
      title: "The Importance of Forest",
      description: "An Ecosia video highlighting why forests matter—from biodiversity to climate—and what we can do to preserve them.",
      youtubeId: "_dWJVHIE9S8",
      duration: "6:25"
    },
    {
      title: "Why do we need Zoos",
      description: "Explores the modern role of zoos in conservation, research, and education, showing how they support endangered species.",
      youtubeId: "XOrPmOXhxo0",
      duration: "4:09"
    }
  ];

  this.conservationVideos = videoData.map(video => ({
    title: video.title,
    description: video.description,
    embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&color=white`
    ),
    duration: video.duration
  }));
}

}