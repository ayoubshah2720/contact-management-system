import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Contact } from '../../models/contact.model';
import { ContactListComponent } from './contact-list.component';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  const contacts: Contact[] = [
    {
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      company: 'Analytical Engines',
      phone: '+44 555 0100'
    },
    {
      id: '2',
      firstName: 'Grace',
      lastName: 'Hopper',
      company: 'Navy',
      phone: '+1 555 0101'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    component.contacts = contacts;
    component.primaryEmailMap = { '1': 'ada@example.com' };
    component.selectedContactId = '1';
    fixture.detectChanges();
  });

  it('renders the supplied contacts', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.contact-list__item'));
    expect(buttons.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
    expect(fixture.nativeElement.textContent).toContain('Grace Hopper');
  });

  it('emits the selected contact when clicked', () => {
    spyOn(component.contactSelected, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('.contact-list__select'));
    buttons[1].nativeElement.click();

    expect(component.contactSelected.emit).toHaveBeenCalledWith(contacts[1]);
  });
});
