import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { apiBaseUrlInterceptor } from '../../../core/interceptors/api-base-url.interceptor';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactService,
        provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ContactService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests contacts from the configured API base URL', () => {
    service.getContacts().subscribe();

    const request = httpTestingController.expectOne(
      'https://6a2da4d72edd4cb330d1569e.mockapi.io/Contacts'
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('requests a single contact by id', () => {
    service.getContact('42').subscribe();

    const request = httpTestingController.expectOne(
      'https://6a2da4d72edd4cb330d1569e.mockapi.io/Contacts/42'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ id: '42', firstName: 'Test', lastName: 'User' });
  });

  it('requests email addresses for a contact', () => {
    let response: unknown;
    service.getEmailAddresses('42').subscribe((value) => {
      response = value;
    });

    const request = httpTestingController.expectOne(
      'https://6a2da4d72edd4cb330d1569e.mockapi.io/Contacts/42/email_addresses'
    );
    expect(request.request.method).toBe('GET');
    request.flush([
      { id: '1', ContactId: '42', email: 'primary@example.com', type: 'work', isPrimary: true },
      { email: 'secondary@example.com', type: 'personal', isPrimary: false }
    ]);

    expect(response).toEqual([
      {
        id: '1',
        ContactId: '42',
        contactId: '42',
        email: 'primary@example.com',
        type: 'work',
        isPrimary: true
      },
      {
        id: '42-2',
        contactId: '42',
        email: 'secondary@example.com',
        type: 'personal',
        isPrimary: false
      }
    ]);
  });

  it('falls back to the top-level email_addresses resource when the nested route returns 404', () => {
    let response: unknown;
    service.getEmailAddresses('8').subscribe((value) => {
      response = value;
    });

    const nestedRequest = httpTestingController.expectOne(
      'https://6a2da4d72edd4cb330d1569e.mockapi.io/Contacts/8/email_addresses'
    );
    expect(nestedRequest.request.method).toBe('GET');
    nestedRequest.flush('Not found', { status: 404, statusText: 'Not Found' });

    const fallbackRequest = httpTestingController.expectOne(
      'https://6a2da4d72edd4cb330d1569e.mockapi.io/email_addresses'
    );
    expect(fallbackRequest.request.method).toBe('GET');
    fallbackRequest.flush([
      { id: '17', contactId: '8', email: 'brian.watson@corebit.dev', type: 'work', isPrimary: true },
      { id: '18', contactId: '8', email: 'brian.watson@gmail.com', type: 'personal', isPrimary: false },
      { id: '1', contactId: '1', email: 'other@example.com', type: 'work', isPrimary: true }
    ]);

    expect(response).toEqual([
      {
        id: '17',
        contactId: '8',
        email: 'brian.watson@corebit.dev',
        type: 'work',
        isPrimary: true
      },
      {
        id: '18',
        contactId: '8',
        email: 'brian.watson@gmail.com',
        type: 'personal',
        isPrimary: false
      }
    ]);
  });
});
