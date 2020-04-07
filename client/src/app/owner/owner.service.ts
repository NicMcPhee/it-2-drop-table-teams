import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Owner } from './owner';
import { map } from 'rxjs/operators';

@Injectable()
export class OwnerService {
  readonly ownerUrl: string = environment.API_URL + 'owners';

  constructor(private httpClient: HttpClient) {
  }
  getOwners(filters?: { name?: string, email?: string, building?: string, officeNumber?: string }): Observable<Owner[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.name) {
        httpParams = httpParams.set('name', filters.name);
      }
      if (filters.email) {
        httpParams = httpParams.set('email', filters.email);
      }
      if (filters.building) {
        httpParams = httpParams.set('building', filters.building);
      }
      if (filters.officeNumber){
        httpParams = httpParams.set('officenumber', filters.officeNumber);
      }
    }
    return this.httpClient.get<Owner[]>(this.ownerUrl, {
      params: httpParams,
    });
  }
  getOwnerById(id: string): Observable<Owner> {
    const owner = this.httpClient.get<Owner>(this.ownerUrl + '/' + id);
    return owner;
  }

  filterOwners(owners: Owner[], filters: { name?: string, email?: string, building?: string, officeNumber?: string }): Owner[] {

    let filteredOwners = owners;

    // Filter by name
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.name.toLowerCase().includes(filters.name);
      });
    }

    // Filter by email
    if (filters.email) {
      filters.email = filters.email.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.email.toLowerCase().includes(filters.email);
      });
    }

    // Filter by building
    if (filters.building) {
      filters.building = filters.building.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.building.toLowerCase().includes(filters.building);
      });
    }

    // Filter by officeNumber
    if (filters.officeNumber) {
      filters.officeNumber = filters.officeNumber.toLowerCase();

      filteredOwners = filteredOwners.filter(owner => {
        return owner.officeNumber.toLowerCase().includes(filters.officeNumber);
      });
    }

    return filteredOwners;
  }

  addOwner(newOwner: Owner): Observable<string> {
    // Send post request to add a new owner with the owner data as the body.
    return this.httpClient.post<{id: string}>(this.ownerUrl + '/new', newOwner).pipe(map(res => res.id));
  }
}
