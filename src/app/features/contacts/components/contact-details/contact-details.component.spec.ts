import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsComponent } from './contact-details.component';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    component.contact = {
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      company: 'Analytical Engines',
      jobTitle: 'Programmer',
      phone: '+44 555 0100',
      address: '12 Computing Lane',
      city: 'London',
      country: 'United Kingdom',
      createdAt: '2026-01-10T00:00:00.000Z',
      updatedAt: '2026-02-10T00:00:00.000Z'
    };
    component.emailAddresses = [
      {
        id: 'email-1',
        contactId: '1',
        email: 'ada.primary@example.com',
        type: 'Work',
        isPrimary: true
      },
      {
        id: 'email-2',
        contactId: '1',
        email: 'ada.secondary@example.com',
        type: 'Personal'
      }
    ];
    fixture.detectChanges();
  });

  it('displays the selected contact details', () => {
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Ada Lovelace');
    expect(textContent).toContain('Programmer at Analytical Engines');
    expect(textContent).toContain('12 Computing Lane');
    expect(textContent).toContain('London, United Kingdom');
    expect(textContent).toContain('ada.primary@example.com');
    expect(textContent).toContain('ada.secondary@example.com');
    expect(textContent).toContain('Primary');
  });
});
