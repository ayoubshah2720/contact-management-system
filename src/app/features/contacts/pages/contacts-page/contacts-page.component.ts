import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { ApiState } from '../../../../core/models/api-state.model';
import { ErrorMessageService } from '../../../../core/services/error-message.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { matchesContactSearch } from '../../../../shared/utils/contact-search.util';
import { Contact } from '../../models/contact.model';
import { EmailAddress } from '../../models/email-address.model';
import { ContactService } from '../../services/contact.service';
import { ContactDetailsComponent } from '../../components/contact-details/contact-details.component';
import { ContactListComponent } from '../../components/contact-list/contact-list.component';
import { ContactSearchComponent } from '../../components/contact-search/contact-search.component';

interface ContactsPageViewModel {
  contactsState: ApiState<Contact[]>;
  detailsState: ApiState<EmailAddress[]>;
  filteredContacts: Contact[];
  primaryEmailMap: Record<string, string>;
  searchTerm: string;
  selectedContact: Contact | null;
}

@Component({
  selector: 'app-contacts-page',
  imports: [
    AsyncPipe,
    ContactDetailsComponent,
    ContactListComponent,
    ContactSearchComponent,
    EmptyStateComponent
  ],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsPageComponent {
  private readonly contactService = inject(ContactService);
  private readonly errorMessageService = inject(ErrorMessageService);

  private readonly refreshContacts$ = new BehaviorSubject<void>(undefined);
  private readonly refreshEmailAddresses$ = new BehaviorSubject<void>(undefined);
  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly selectedContactId$ = new BehaviorSubject<string | null>(null);

  readonly contactsState$ = this.refreshContacts$.pipe(
    switchMap(() =>
      this.contactService.getContacts().pipe(
        map((contacts) => [...contacts].sort((left, right) => this.getFullName(left).localeCompare(this.getFullName(right)))),
        tap((contacts) => {
          const selectedContactId = this.selectedContactId$.value;
          if (!contacts.length) {
            this.selectedContactId$.next(null);
            return;
          }

          const hasSelectedContact = contacts.some((contact) => contact.id === selectedContactId);
          if (!hasSelectedContact) {
            this.selectedContactId$.next(contacts[0].id);
          }
        }),
        map((contacts): ApiState<Contact[]> => ({
          data: contacts,
          error: null,
          status: 'success'
        })),
        startWith<ApiState<Contact[]>>({
          data: [],
          error: null,
          status: 'loading'
        }),
        catchError((error: unknown) =>
          of<ApiState<Contact[]>>({
            data: [],
            error: this.errorMessageService.getMessage(error, 'Unable to load contacts right now.'),
            status: 'error'
          })
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly selectedContact$ = combineLatest([this.contactsState$, this.selectedContactId$]).pipe(
    map(([contactsState, selectedContactId]) => contactsState.data.find((contact) => contact.id === selectedContactId) ?? null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly detailsState$ = combineLatest([this.selectedContactId$, this.refreshEmailAddresses$]).pipe(
    switchMap(([selectedContactId]) => {
      if (!selectedContactId) {
        return of<ApiState<EmailAddress[]>>({
          data: [],
          error: null,
          status: 'idle'
        });
      }

      return this.contactService.getEmailAddresses(selectedContactId).pipe(
        map((emailAddresses): ApiState<EmailAddress[]> => ({
          data: emailAddresses,
          error: null,
          status: 'success'
        })),
        startWith<ApiState<EmailAddress[]>>({
          data: [],
          error: null,
          status: 'loading'
        }),
        catchError((error: unknown) =>
          of<ApiState<EmailAddress[]>>({
            data: [],
            error: this.errorMessageService.getMessage(error, 'Unable to load email addresses right now.'),
            status: 'error'
          })
        )
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly vm$: Observable<ContactsPageViewModel> = combineLatest([
    this.contactsState$,
    this.detailsState$,
    this.selectedContact$,
    this.searchTerm$
  ]).pipe(
    map(([contactsState, detailsState, selectedContact, searchTerm]) => {
      const filteredContacts = contactsState.data.filter((contact) => this.matchesSearch(contact, searchTerm));
      const primaryEmailMap = this.buildPrimaryEmailMap(contactsState.data, selectedContact, detailsState.data);

      return {
        contactsState,
        detailsState,
        filteredContacts,
        primaryEmailMap,
        searchTerm,
        selectedContact
      };
    })
  );

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  onContactSelected(contact: Contact): void {
    if (contact.id === this.selectedContactId$.value) {
      return;
    }

    this.selectedContactId$.next(contact.id);
  }

  retryContacts(): void {
    this.refreshContacts$.next(undefined);
  }

  retryEmailAddresses(): void {
    this.refreshEmailAddresses$.next(undefined);
  }

  private buildPrimaryEmailMap(
    contacts: Contact[],
    selectedContact: Contact | null,
    emailAddresses: EmailAddress[]
  ): Record<string, string> {
    const primaryEmailMap = contacts.reduce<Record<string, string>>((accumulator, contact) => {
      const summaryEmail = contact.primaryEmail || contact.email;
      if (summaryEmail) {
        accumulator[contact.id] = summaryEmail;
      }
      return accumulator;
    }, {});

    if (selectedContact) {
      const selectedPrimaryEmail =
        emailAddresses.find((emailAddress) => emailAddress.isPrimary)?.email ||
        emailAddresses[0]?.email ||
        primaryEmailMap[selectedContact.id];

      if (selectedPrimaryEmail) {
        primaryEmailMap[selectedContact.id] = selectedPrimaryEmail;
      }
    }

    return primaryEmailMap;
  }

  private getFullName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`.trim();
  }

  private matchesSearch(contact: Contact, searchTerm: string): boolean {
    return matchesContactSearch(contact, searchTerm);
  }
}
