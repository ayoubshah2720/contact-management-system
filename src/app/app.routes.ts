import { Routes } from '@angular/router';
import { ContactsPageComponent } from './features/contacts/pages/contacts-page/contacts-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contacts'
  },
  {
    path: 'contacts',
    component: ContactsPageComponent
  },
  {
    path: '**',
    redirectTo: 'contacts'
  }
];
