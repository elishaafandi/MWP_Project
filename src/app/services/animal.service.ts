// src/app/services/animal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private ninjaApiUrl = 'https://api.api-ninjas.com/v1/animals?name=';
  private ninjaApiKey = 'JuiATxT8HfNwU/AiLBb0ZA==lg7G2o21AtMx5m59';
  private iNatApiUrl = 'https://api.inaturalist.org/v1/search?q=';

  constructor(private http: HttpClient) {}

  getAnimalInfo(animalName: string): Observable<any> {
    const iNat$ = this.http.get<any>(`${this.iNatApiUrl}${animalName}&type=taxon`);

    return iNat$.pipe(
      map(iNatData => {
        const taxon = iNatData.results[0]?.record;
        if (!taxon) throw new Error('No results from iNaturalist');

        const imageUrl = taxon.default_photo?.medium_url || '';
        const commonName = taxon.preferred_common_name || animalName;
        const sciName = taxon.name;

        return { imageUrl, commonName, sciName };
      }),
      switchMap(iNatResult => {
        const headers = new HttpHeaders({ 'X-Api-Key': this.ninjaApiKey });
        const ninja$ = this.http.get<any>(`${this.ninjaApiUrl}${iNatResult.commonName}`, { headers });

        // Combine Observables: ninja$ and the static iNatResult wrapped in `of()`
        return forkJoin({
          ninja: ninja$,
          iNat: of(iNatResult)
        });
      }),
      map(({ ninja, iNat }) => ({
        imageUrl: iNat.imageUrl,
        commonName: iNat.commonName,
        sciName: iNat.sciName,
        details: ninja[0] || null
      }))
    );
  }
}
