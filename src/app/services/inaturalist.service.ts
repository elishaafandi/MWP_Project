import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Species {
   id: number;
  name: string;
  preferred_common_name?: string;
  conservation_status?: {
    status?: string;
  };
  iconic_taxon_name?: string;
  threatened?: boolean;
  wikipedia_url?: string;
  default_photo?: {
    medium_url?: string;
  };
  showMore?: boolean; // 👈 Add this line
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
      const threatened = res.results.filter((taxon: any) =>
        taxon.conservation_status &&
        taxon.conservation_status.status &&
        ['en', 'cr', 'vu'].includes(taxon.conservation_status.status.toLowerCase())
      );

      return threatened.map((taxon: any) => ({
        name: taxon.name,
        preferred_common_name: taxon.preferred_common_name,
        conservation_status: {
          status: taxon.conservation_status.status
        },
        iconic_taxon_name: taxon.iconic_taxon_name,
        threatened: taxon.threatened,
        wikipedia_url: taxon.wikipedia_url,
        default_photo: {
          medium_url: taxon.default_photo?.medium_url
        }
      } as Species));
    }),
    catchError(err => {
      console.error('API error:', err);
      return of([]);
    })
  );
}


getObservationByTaxonId(taxonId: number): Observable<any> {
  const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&per_page=1`;

  return this.http.get<any>(url).pipe(
    map(res => res.results?.[0] || null),
    catchError(err => {
      console.error('Observation fetch error:', err);
      return of(null);
    })
  );
}



}
