import { Contact } from '../../features/contacts/models/contact.model';

export function matchesContactSearch(contact: Contact, searchTerm: string): boolean {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [
    `${contact.firstName} ${contact.lastName}`.trim(),
    contact.email,
    contact.primaryEmail,
    contact.phone,
    contact.company,
    contact.jobTitle,
    contact.city,
    contact.country
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(normalizedSearch);
}
