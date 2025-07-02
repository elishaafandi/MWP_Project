import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  
  allAnimals = [
    {
      id: 1,
      name: 'Jaguar',
      image: '/images/jaguar.avif',
      description: 'Powerful predator of the Amazon rainforest',
      habitat: 'Rainforest',
      status: 'Near Threatened'
    },
    {
      id: 2,
      name: 'Flamingo',
      image: '/images/flamingo.avif',
      description: 'Graceful pink wading bird',
      habitat: 'Wetlands',
      status: 'Least Concern'
    },
    {
      id: 3,
      name: 'Sea Turtle',
      image: '/images/turtle.avif',
      description: 'Ancient marine navigator',
      habitat: 'Ocean',
      status: 'Endangered'
    },
    {
      id: 4,
      name: 'Snow Leopard',
      image: '/images/snow.avif',
      description: 'Elusive mountain predator',
      habitat: 'Mountains',
      status: 'Vulnerable'
    },
    {
      id: 5,
      name: 'Polar Bear',
      image: '/images/polar.avif',
      description: 'Arctic ice hunter',
      habitat: 'Arctic',
      status: 'Vulnerable'
    },
    {
      id: 6,
      name: 'Orangutan',
      image: '/images/orang.avif',
      description: 'Intelligent forest dweller',
      habitat: 'Rainforest',
      status: 'Critically Endangered'
    },
    {
      id: 7,
      name: 'African Elephant',
      image: '/images/elephant.avif',
      description: 'Gentle giant of the savanna',
      habitat: 'Savanna',
      status: 'Endangered'
    },
    {
      id: 8,
      name: 'Monarch Butterfly',
      image: '/images/monarch.avif',
      description: 'Epic migrating beauty',
      habitat: 'Gardens',
      status: 'Endangered'
    }
  ];

  currentStartIndex = 0;
  itemsPerPage = 2;

  get featuredAnimals() {
    return this.allAnimals.slice(this.currentStartIndex, this.currentStartIndex + this.itemsPerPage);
  }

  get canGoNext() {
    return this.currentStartIndex + this.itemsPerPage < this.allAnimals.length;
  }

  get canGoPrevious() {
    return this.currentStartIndex > 0;
  }

  get totalPages() {
    return Math.ceil(this.allAnimals.length / this.itemsPerPage);
  }

  get currentPage() {
    return Math.floor(this.currentStartIndex / this.itemsPerPage);
  }

  get paginationArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  nextAnimals() {
    if (this.canGoNext) {
      this.currentStartIndex += this.itemsPerPage;
    }
  }

  previousAnimals() {
    if (this.canGoPrevious) {
      this.currentStartIndex -= this.itemsPerPage;
    }
  }

  goToPage(pageIndex: number) {
    this.currentStartIndex = pageIndex * this.itemsPerPage;
  }

  onExploreClick() {
    // Navigate to explore section or page
    console.log('Exploring the wild...');
  }

  onAnimalClick(animal: any) {
    // Navigate to animal details
    console.log('Selected animal:', animal.name);
  }

  onViewMoreAnimals() {
    // Navigate to animals page or show all animals
    console.log('View more animals clicked');
  }

  onJoinMission() {
  // Navigate to volunteer/donation page or show mission details
  console.log('Join mission clicked - redirect to volunteer page');
}

onStartExploring() {
  // Navigate to explore/animals page
  console.log('Start exploring clicked - redirect to animals page');
}

onLearnMore() {
  // Navigate to about page or show more information
  console.log('Learn more clicked - redirect to about page');
}
}