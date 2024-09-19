import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {
  constructor(private http: HttpClient) { }

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public searchCountryByAlphaCode ( code: string ): Observable<Country | null > {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${ code }`)
    .pipe(
      map(countries => countries.length > 0 ? countries[0]: null),
      catchError( () => of(null))
    )
  }

  public searchCapital( term:string ): Observable<Country[]> {

    return this.http.get<Country[]>(`${this.apiUrl}/capital/${ term }`)
    .pipe(
      catchError( error => of([]))
    )

  }

  public searchCountry( term:string ): Observable<Country[]> {

    return this.http.get<Country[]>(`${this.apiUrl}/name/${ term }`)
    .pipe(
      catchError( error => of([]))
    )

  }

  public searchRegion( term:string ): Observable<Country[]> {

    return this.http.get<Country[]>(`${this.apiUrl}/region/${ term }`)
    .pipe(
      catchError( error => of([]))
    )

  }


}
