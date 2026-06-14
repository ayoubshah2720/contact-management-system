export interface ContactEmail {
  email: string;
  type?: string;
  isPrimary?: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string | number;
  notes?: string;
  status?: boolean;
  email?: string;
  primaryEmail?: string;
  emails?: ContactEmail[];
}
