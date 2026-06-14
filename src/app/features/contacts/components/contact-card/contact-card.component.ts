import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FullNamePipe } from '../../../../shared/pipes/full-name.pipe';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-card',
  imports: [FullNamePipe],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactCardComponent {
  @Input({ required: true }) contact!: Contact;
  @Input() isSelected = false;
  @Input() primaryEmail = '';

  get primaryLine(): string {
    return this.primaryEmail || this.contact.phone || 'No direct contact available';
  }

  get secondaryLine(): string {
    return [this.contact.city, this.contact.country].filter(Boolean).join(', ') || 'Location unavailable';
  }

  get indicatorClass(): string {
    const colorIndex = Number(this.contact.id) % 4;
    return ['online', 'away', 'busy', 'offline'][colorIndex];
  }

  get initials(): string {
    const first = this.contact.firstName?.charAt(0) ?? '';
    const last = this.contact.lastName?.charAt(0) ?? '';
    return `${first}${last}`.trim().toUpperCase() || '?';
  }
}
