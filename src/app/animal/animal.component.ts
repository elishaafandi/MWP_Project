import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalService } from '../services/animal.service';

interface Filter {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})
export class AnimalComponent implements OnInit {
  animalName = '';
  loading = false;
  featuredLoading = true;
  factsLoading = true;
  error: string | null = null;
  searchResults: any[] = [];
  
  selectedFilter = 'all';
  filters: Filter[] = [
    { value: 'all', label: 'All Animals', icon: '🌍' },
    { value: 'mammal', label: 'Mammals', icon: '🦁' },
    { value: 'bird', label: 'Birds', icon: '🦅' },
    { value: 'fish', label: 'Fish', icon: '🐠' },
    { value: 'reptile', label: 'Reptiles', icon: '🦎' },
    { value: 'amphibian', label: 'Amphibians', icon: '🐸' },
    { value: 'insect', label: 'Insects', icon: '🦋' }
  ];

  featuredAnimals: any[] = [];
  filteredFeaturedAnimals: any[] = [];
  animalFacts: any[] = [];
  currentFactIndex = 0;
  private factRotationInterval: any;

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    this.loadFeaturedAnimals();
    this.loadAnimalFacts();
  }

  ngOnDestroy() {
    if (this.factRotationInterval) {
      clearInterval(this.factRotationInterval);
    }
  }

  get currentFact(): any {
    return this.animalFacts[this.currentFactIndex];
  }

  search() {
    if (!this.animalName.trim()) {
      this.error = 'Please enter an animal name';
      return;
    }

    this.loading = true;
    this.error = null;
    this.searchResults = [];

    this.animalService.getAnimalInfo(this.animalName).subscribe({
      next: data => {
        this.searchResults = data;
        this.loading = false;
        if (data.length === 0) {
          this.error = 'No animals found. Try different search terms.';
        }
      },
      error: err => {
        this.error = err.message || 'Error fetching animal data';
        this.loading = false;
      }
    });
  }

  setFilter(filterValue: string) {
    this.selectedFilter = filterValue;
    this.loadFilteredAnimals();
  }

  loadFilteredAnimals() {
    this.featuredLoading = true;
    
    this.animalService.searchAnimalsByFilter(this.selectedFilter).subscribe({
      next: data => {
        this.filteredFeaturedAnimals = data;
        this.featuredLoading = false;
      },
      error: err => {
        console.error('Error loading filtered animals:', err);
        this.featuredLoading = false;
      }
    });
  }

  getFilteredFeaturedAnimals(): any[] {
    return this.selectedFilter === 'all' ? this.featuredAnimals : this.filteredFeaturedAnimals;
  }

  selectFeaturedAnimal(animal: any) {
    this.animalName = animal.name;
    this.search();
  }

  loadFeaturedAnimals() {
    this.featuredLoading = true;
    
    this.animalService.getFeaturedAnimals().subscribe({
      next: data => {
        this.featuredAnimals = data;
        this.featuredLoading = false;
      },
      error: err => {
        console.error('Error loading featured animals:', err);
        this.featuredLoading = false;
      }
    });
  }

  loadAnimalFacts() {
    this.factsLoading = true;
    
    this.animalService.getAnimalFacts().subscribe({
      next: data => {
        this.animalFacts = data;
        this.factsLoading = false;
        this.startFactRotation();
      },
      error: err => {
        console.error('Error loading animal facts:', err);
        this.factsLoading = false;
      }
    });
  }

  nextFact() {
    this.currentFactIndex = (this.currentFactIndex + 1) % this.animalFacts.length;
  }

  previousFact() {
    this.currentFactIndex = (this.currentFactIndex - 1 + this.animalFacts.length) % this.animalFacts.length;
  }

  goToFact(index: number) {
    this.currentFactIndex = index;
  }

  private startFactRotation() {
    if (this.factRotationInterval) {
      clearInterval(this.factRotationInterval);
    }
    
    // Auto-rotate facts every 10 second
    this.factRotationInterval = setInterval(() => {
      this.nextFact();
    }, 10000);
  }
}