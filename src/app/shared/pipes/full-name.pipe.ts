import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../../features/contacts/models/contact.model';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {
  transform(contact: Pick<Contact, 'firstName' | 'lastName'> | null | undefined): string {
    if (!contact) {
      return '';
    }

    return `${contact.firstName} ${contact.lastName}`.trim();
  }
}
