import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';
import { ContactsPageComponent } from './contacts-page.component';

describe('ContactsPageComponent', () => {
  let fixture: ComponentFixture<ContactsPageComponent>;
  let component: ContactsPageComponent;

  const contacts: Contact[] = [
    {
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      company: 'Analytical Engines',
      phone: '+44 555 0100',
      email: 'ada@example.com'
    },
    {
      id: '2',
      firstName: 'Grace',
      lastName: 'Hopper',
      company: 'US Navy',
      phone: '+1 555 0101',
      email: 'grace@example.com'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsPageComponent],
      providers: [
        {
          provide: ContactService,
          useValue: {
            getContacts: () => of(contacts),
            getEmailAddresses: () =>
              of([
                {
                  id: 'email-1',
                  contactId: '1',
                  email: 'ada@example.com',
                  isPrimary: true
                }
              ])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsPageComponent);
    component = fixture.componentInstance;
  });

  it('filters contacts by search term', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.onSearchTermChange('grace');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const sidebarText = fixture.nativeElement.querySelector('.contacts-page__sidebar')?.textContent ?? '';
    expect(sidebarText).toContain('Grace Hopper');
    expect(sidebarText).not.toContain('Ada Lovelace');
  }));
});
