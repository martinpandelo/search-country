import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {

    byCapital: { term: '', countries: []},
    byCountry: { term: '', countries: []},
    byRegion: { region: '', countries: []},

  }

  private saveLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify( this.cacheStore ));
  }

  private loadLocalStorage () {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
    .pipe(
      catchError( () => of([])),
      delay( 500 ),
    )
  }

  public searchCountryByAlphaCode ( code: string ): Observable<Country | null > {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${ code }`)
    .pipe(
      map(countries => countries.length > 0 ? countries[0]: null),
      catchError( () => of(null))
    )
  }

  public searchCapital( term:string ): Observable<Country[]> {

    const url = `${this.apiUrl}/capital/${ term }`;
    return this.getCountriesRequest( url )
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term: term, countries: countries } ),
        tap( () => this.saveLocalStorage() )
      );

  }

  public searchCountry( term:string ): Observable<Country[]> {

    const url = `${this.apiUrl}/name/${ term }`;
    return this.getCountriesRequest( url )
      .pipe (
        tap( countries => this.cacheStore.byCountry = { term: term, countries: countries } ),
        tap( () => this.saveLocalStorage() )
      );

  }

  public searchRegion( term:Region ): Observable<Country[]> {

    const url = `${this.apiUrl}/region/${ term }`;
    return this.getCountriesRequest( url )
      .pipe (
        tap ( countries => this.cacheStore.byRegion = { region: term, countries: countries } ),
        tap( () => this.saveLocalStorage() )
      )

  }


}
