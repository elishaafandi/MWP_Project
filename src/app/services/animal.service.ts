// Enhanced animal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private ninjaApiUrl = 'https://api.api-ninjas.com/v1/animals?name=';
  private ninjaApiKey = 'JuiATxT8HfNwU/AiLBb0ZA==lg7G2o21AtMx5m59';
  private iNatApiUrl = 'https://api.inaturalist.org/v1/search?q=';

  // List of animals for featured section and facts
  private featuredAnimalNames = [
    'lion', 'tiger', 'elephant', 'giraffe', 'cheetah', 'rabbit',
    'leopard', 'rhinoceros', 'hippopotamus', 'gorilla', 'chimpanzee', 'polar bear'
  ];

  private factAnimalNames = [
    'octopus', 'dolphin', 'shark', 'whale', 'penguin', 'eagle',
    'owl', 'hummingbird', 'chameleon', 'gecko', 'python', 'cobra'
  ];

  constructor(private http: HttpClient) {}

  getAnimalInfo(animalName: string): Observable<any> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.ninjaApiKey });
    
    return this.http.get<any[]>(`${this.ninjaApiUrl}${animalName}`, { headers }).pipe(
      switchMap(ninjaData => {
        if (!ninjaData || ninjaData.length === 0) {
          throw new Error('No animals found');
        }

        // For each animal from ninja API, get image from iNaturalist
        const animalPromises = ninjaData.map(animal => 
          this.getAnimalImage(animal.name).pipe(
            map(imageUrl => ({
              ...animal,
              imageUrl: imageUrl || 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop'
            })),
            catchError(() => of({
              ...animal,
              imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop'
            }))
          )
        );

        return forkJoin(animalPromises);
      }),
      catchError(error => {
        console.error('Error fetching animal data:', error);
        throw new Error('Failed to fetch animal information');
      })
    );
  }

  private getAnimalImage(animalName: string): Observable<string> {
    return this.http.get<any>(`${this.iNatApiUrl}${animalName}&type=taxon`).pipe(
      map(iNatData => {
        const taxon = iNatData.results[0]?.record;
        return taxon?.default_photo?.medium_url || '';
      }),
      catchError(() => of(''))
    );
  }

  getFeaturedAnimals(): Observable<any[]> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.ninjaApiKey });
    
    const animalPromises = this.featuredAnimalNames.map(name => 
      this.http.get<any[]>(`${this.ninjaApiUrl}${name}`, { headers }).pipe(
        switchMap(ninjaData => {
          if (!ninjaData || ninjaData.length === 0) {
            return of(null);
          }
          
          const animal = ninjaData[0]; // Take first result
          return this.getAnimalImage(animal.name).pipe(
            map(imageUrl => ({
              ...animal,
              imageUrl: imageUrl || `https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop`
            }))
          );
        }),
        catchError(() => of(null))
      )
    );

    return forkJoin(animalPromises).pipe(
      map(results => results.filter(animal => animal !== null))
    );
  }

  getAnimalFacts(): Observable<any[]> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.ninjaApiKey });
    
    const factPromises = this.factAnimalNames.map(name => 
      this.http.get<any[]>(`${this.ninjaApiUrl}${name}`, { headers }).pipe(
        switchMap(ninjaData => {
          if (!ninjaData || ninjaData.length === 0) {
            return of(null);
          }
          
          const animal = ninjaData[0]; // Take first result
          return this.getAnimalImage(animal.name).pipe(
            map(imageUrl => ({
              ...animal,
              imageUrl: imageUrl || `https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop`,
              funFact: this.generateFunFact(animal)
            }))
          );
        }),
        catchError(() => of(null))
      )
    );

    return forkJoin(factPromises).pipe(
      map(results => results.filter(animal => animal !== null))
    );
  }

  private generateFunFact(animal: any): string {
    const facts = [];
    
    if (animal.characteristics?.lifespan) {
      facts.push(`${animal.name}s can live up to ${animal.characteristics.lifespan}!`);
    }
    
    if (animal.characteristics?.weight) {
      facts.push(`${animal.name}s can weigh ${animal.characteristics.weight}!`);
    }
    
    if (animal.characteristics?.diet) {
      facts.push(`${animal.name}s are ${animal.characteristics.diet.toLowerCase()}s!`);
    }
    
    if (animal.characteristics?.habitat) {
      facts.push(`${animal.name}s live in ${animal.characteristics.habitat.toLowerCase()}!`);
    }
    
    if (animal.characteristics?.predators) {
      facts.push(`${animal.name}s need to watch out for ${animal.characteristics.predators}!`);
    }
    
    if (animal.characteristics?.prey) {
      facts.push(`${animal.name}s hunt ${animal.characteristics.prey}!`);
    }

    if (animal.characteristics?.top_speed) {
      facts.push(`${animal.name}s can reach speeds of ${animal.characteristics.top_speed}!`);
    }

    if (animal.characteristics?.wingspan) {
      facts.push(`${animal.name}s have a wingspan of ${animal.characteristics.wingspan}!`);
    }

    return facts.length > 0 ? facts[Math.floor(Math.random() * facts.length)] : `${animal.name}s are amazing creatures!`;
  }

  searchAnimalsByFilter(filterType: string): Observable<any[]> {
    if (filterType === 'all') {
      return this.getFeaturedAnimals();
    }

    const headers = new HttpHeaders({ 'X-Api-Key': this.ninjaApiKey });
    const searchTerms = this.getSearchTermsByFilter(filterType);
    
    const searchPromises = searchTerms.map(term => 
      this.http.get<any[]>(`${this.ninjaApiUrl}${term}`, { headers }).pipe(
        switchMap(ninjaData => {
          if (!ninjaData || ninjaData.length === 0) {
            return of([]);
          }
          
          const animalPromises = ninjaData
            .filter(animal => this.matchesFilter(animal, filterType))
            .slice(0, 4) // Limit per search term
            .map(animal => 
              this.getAnimalImage(animal.name).pipe(
                map(imageUrl => ({
                  ...animal,
                  imageUrl: imageUrl || `https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop`
                }))
              )
            );
          
          return animalPromises.length > 0 ? forkJoin(animalPromises) : of([]);
        }),
        catchError(() => of([]))
      )
    );

    return forkJoin(searchPromises).pipe(
      map(results => results.flat().slice(0, 12)) // Limit total results
    );
  }

  private getSearchTermsByFilter(filterType: string): string[] {
    const filterMap: { [key: string]: string[] } = {
      'mammal': ['lion', 'tiger', 'elephant', 'bear', 'wolf', 'deer'],
      'bird': ['eagle', 'hawk', 'owl', 'robin', 'sparrow', 'penguin'],
      'fish': ['shark', 'tuna', 'salmon', 'bass', 'trout', 'cod'],
      'reptile': ['snake', 'lizard', 'turtle', 'gecko', 'iguana', 'chameleon'],
      'amphibian': ['frog', 'toad', 'salamander', 'newt'],
      'insect': ['butterfly', 'bee', 'ant', 'beetle', 'spider', 'moth']
    };
    
    return filterMap[filterType] || [];
  }

  private matchesFilter(animal: any, filterType: string): boolean {
    const animalType = animal.characteristics?.type?.toLowerCase() || '';
    
    switch (filterType) {
      case 'mammal':
        return animalType.includes('mammal');
      case 'bird':
        return animalType.includes('bird');
      case 'fish':
        return animalType.includes('fish');
      case 'reptile':
        return animalType.includes('reptile');
      case 'amphibian':
        return animalType.includes('amphibian');
      case 'insect':
        return animalType.includes('insect') || animalType.includes('spider');
      default:
        return true;
    }
  }
}