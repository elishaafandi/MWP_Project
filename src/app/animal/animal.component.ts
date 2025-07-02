import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalService } from '../services/animal.service';

interface Filter {
  value: string;
  label: string;
  icon: string;
}

interface FeaturedAnimal {
  name: string;
  sciName: string;
  imageUrl: string;
  diet: string;
  habitat: string;
  location: string;
  type: string;
}

interface AnimalFact {
  name: string;
  imageUrl: string;
  funFact: string;
  weight: string;
  lifespan: string;
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
  error: string | null = null;
  searchResult: any = null;
  
  selectedFilter = 'all';
  filters: Filter[] = [
    { value: 'all', label: 'All Animals', icon: '🌍' },
    { value: 'mammal', label: 'Mammals', icon: '🦁' },
    { value: 'bird', label: 'Birds', icon: '🦅' },
    { value: 'fish', label: 'Fish', icon: '🐠' },
    { value: 'reptile', label: 'Reptiles', icon: '🦎' }
  ];

  featuredAnimals: FeaturedAnimal[] = [
    {
      name: 'African Lion',
      sciName: 'Panthera leo',
      imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=300&fit=crop',
      diet: 'Carnivore',
      habitat: 'Grasslands, Savannas',
      location: 'Africa',
      type: 'mammal'
    },
    {
      name: 'African Elephant',
      sciName: 'Loxodonta africana',
      imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
      diet: 'Herbivore',
      habitat: 'Savannas, Forests',
      location: 'Africa',
      type: 'mammal'
    },
    {
      name: 'Siberian Tiger',
      sciName: 'Panthera tigris altaica',
      imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=300&fit=crop',
      diet: 'Carnivore',
      habitat: 'Forests',
      location: 'Asia',
      type: 'mammal'
    },
    {
      name: 'Bald Eagle',
      sciName: 'Haliaeetus leucocephalus',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop',
      diet: 'Carnivore',
      habitat: 'Forests, Wetlands',
      location: 'North America',
      type: 'bird'
    },
    {
      name: 'Great White Shark',
      sciName: 'Carcharodon carcharias',
      imageUrl: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&h=300&fit=crop',
      diet: 'Carnivore',
      habitat: 'Ocean',
      location: 'Worldwide',
      type: 'fish'
    },
    {
      name: 'Green Sea Turtle',
      sciName: 'Chelonia mydas',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      diet: 'Herbivore',
      habitat: 'Ocean',
      location: 'Tropical Waters',
      type: 'reptile'
    }
  ];

  animalFacts: AnimalFact[] = [
    {
      name: 'Octopus',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      funFact: 'Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.',
      weight: '3-10 kg',
      lifespan: '1-2 years'
    },
    {
      name: 'Giraffe',
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
      funFact: 'A giraffe\'s tongue is 18-20 inches long and is blue-black in color to protect it from sunburn while reaching for leaves!',
      weight: '800-1200 kg',
      lifespan: '20-25 years'
    },
    {
      name: 'Dolphin',
      imageUrl: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=400&h=300&fit=crop',
      funFact: 'Dolphins have names for each other! They use unique signature whistles to identify and call specific individuals.',
      weight: '150-650 kg',
      lifespan: '20-45 years'
    },
    {
      name: 'Emperor Penguin',
      imageUrl: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=300&fit=crop',
      funFact: 'Male emperor penguins incubate their eggs on their feet for 64 days during the harsh Antarctic winter without eating!',
      weight: '22-45 kg',
      lifespan: '15-20 years'
    },
    {
      name: 'Cheetah',
      imageUrl: 'https://images.unsplash.com/photo-1539681944150-ca0297e8ad0b?w=400&h=300&fit=crop',
      funFact: 'Cheetahs can accelerate from 0 to 70 mph in just 3 seconds, making them faster than most sports cars!',
      weight: '35-72 kg',
      lifespan: '8-12 years'
    },
    {
      name: 'Hummingbird',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      funFact: 'Hummingbirds are the only birds that can fly backwards, upside down, and hover in place like tiny helicopters!',
      weight: '2-20 g',
      lifespan: '3-5 years'
    }
  ];

  currentFactIndex = 0;

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    // Initialize with first fact
    this.startFactRotation();
  }

  get currentFact(): AnimalFact {
    return this.animalFacts[this.currentFactIndex];
  }

  search() {
    if (!this.animalName.trim()) {
      this.error = 'Please enter an animal name';
      return;
    }

    this.loading = true;
    this.error = null;
    this.searchResult = null;

    this.animalService.getAnimalInfo(this.animalName).subscribe({
      next: data => {
        this.searchResult = data;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Error fetching animal data. Try: lion, elephant, tiger, shark, etc.';
        this.loading = false;
      }
    });
  }

  setFilter(filterValue: string) {
    this.selectedFilter = filterValue;
  }

  getFilteredFeaturedAnimals(): FeaturedAnimal[] {
    if (this.selectedFilter === 'all') {
      return this.featuredAnimals;
    }
    return this.featuredAnimals.filter(animal => animal.type === this.selectedFilter);
  }

  selectFeaturedAnimal(animal: FeaturedAnimal) {
    this.animalName = animal.name;
    this.search();
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
    // Auto-rotate facts every 8 seconds
    setInterval(() => {
      this.nextFact();
    }, 8000);
  }
}