import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Contact } from '../models/contact.model';
import { EmailAddress } from '../models/email-address.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  getContacts(): Observable<Contact[]> {
    if (environment.useLocalMockData) {
      return this.http.get<Contact[]>('/mock-data/contacts.json');
    }

    return this.http.get<Contact[]>('/Contacts');
  }

  getContact(contactId: string): Observable<Contact> {
    return this.http.get<Contact>(`/Contacts/${contactId}`);
  }

  getEmailAddresses(contactId: string): Observable<EmailAddress[]> {
    if (environment.useLocalMockData) {
      return this.http
        .get<EmailAddress[]>('/mock-data/email-addresses.json')
        .pipe(
          map((emailAddresses) => emailAddresses.filter((item) => item.contactId === contactId)),
          map((emailAddresses) => this.normalizeEmailAddresses(emailAddresses, contactId))
        );
    }

    return this.http.get<EmailAddress[]>(`/Contacts/${contactId}/email_addresses`).pipe(
      map((emailAddresses) => this.normalizeEmailAddresses(emailAddresses, contactId)),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 404) {
          return throwError(() => error);
        }

        return this.http.get<EmailAddress[]>('/email_addresses').pipe(
          map((emailAddresses) =>
            emailAddresses.filter(
              (item) => (item.contactId || item.ContactId || '').toString() === contactId
            )
          ),
          map((emailAddresses) => this.normalizeEmailAddresses(emailAddresses, contactId))
        );
      })
    );
  }

  private normalizeEmailAddresses(emailAddresses: EmailAddress[], contactId: string): EmailAddress[] {
    return emailAddresses.map((emailAddress, index) => ({
      ...emailAddress,
      id: emailAddress.id || `${contactId}-${index + 1}`,
      contactId: emailAddress.contactId || emailAddress.ContactId || contactId
    }));
  }
}
