import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Species {
  name: string;
  preferred_common_name?: string;
  conservation_status?: {
    status?: string;
  }
  iconic_taxon_name?: string;
  threatened?: boolean;
  wikipedia_url?: string;
  default_photo?: {
    medium_url?: string;
  };
  
}


@Injectable({ providedIn: 'root' })
export class InaturalistService {
  private apiUrl = 'https://api.inaturalist.org/v1/taxa';

  constructor(private http: HttpClient) {}

  getSpeciesData(name: string): Observable<Species> {
  return this.http.get<any>(`${this.apiUrl}?q=${encodeURIComponent(name)}`).pipe(
    map(res => res.results?.[0])
  );
  }


  getThreatenedSpecies(searchQuery: string = 'endangered'): Observable<Species[]> {
  const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(searchQuery)}&rank=species&per_page=50`;

  return this.http.get<any>(url).pipe(
    map(res => {
      console.log('Raw API response:', res); // 👈 Log everything

      const threatened = res.results.filter((taxon: any) =>
        taxon.conservation_status &&
        taxon.conservation_status.status &&
        ['en', 'cr', 'vu'].includes(taxon.conservation_status.status.toLowerCase())
      );

      console.log('Threatened species found:', threatened.map((t: any) => ({
        name: t.name,
        common: t.preferred_common_name,
        status: t.conservation_status.status
      }))); // 👈 Log only relevant data

      return threatened;
    }),
    catchError(err => {
      console.error('API error:', err); // 👈 Log error if any
      return of([]);
    })
  );
}


}
