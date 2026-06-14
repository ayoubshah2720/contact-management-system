import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Contact } from '../../models/contact.model';
import { ContactCardComponent } from '../contact-card/contact-card.component';

@Component({
  selector: 'app-contact-list',
  imports: [ContactCardComponent, EmptyStateComponent, ErrorStateComponent, LoadingSpinnerComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListComponent {
  @Input() contacts: Contact[] = [];
  @Input() selectedContactId: string | null = null;
  @Input() primaryEmailMap: Record<string, string> = {};
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() contactSelected = new EventEmitter<Contact>();
  @Output() retry = new EventEmitter<void>();

  readonly trackByContactId = (_: number, contact: Contact): string => contact.id;
}
