import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { FullNamePipe } from '../../../../shared/pipes/full-name.pipe';
import { Contact } from '../../models/contact.model';
import { EmailAddress } from '../../models/email-address.model';

@Component({
  selector: 'app-contact-details',
  imports: [DatePipe, EmptyStateComponent, ErrorStateComponent, FullNamePipe, LoadingSpinnerComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDetailsComponent {
  @Input() contact: Contact | null = null;
  @Input() emailAddresses: EmailAddress[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() retry = new EventEmitter<void>();

  get emailList(): EmailAddress[] {
    return this.emailAddresses;
  }

  get location(): string {
    return [this.contact?.city, this.contact?.country].filter(Boolean).join(', ') || 'Not available';
  }

  get role(): string {
    const companyLine = [this.contact?.jobTitle, this.contact?.company].filter(Boolean).join(' at ');
    return companyLine || 'Not available';
  }

  get notes(): string {
    return this.contact?.notes?.trim() || 'No notes available';
  }

  get primaryEmail(): string {
    return this.emailList.find((email) => email.isPrimary)?.email || this.emailList[0]?.email || 'Not available';
  }

  get company(): string {
    return this.contact?.company?.trim() || 'Not available';
  }

  get jobTitle(): string {
    return this.contact?.jobTitle?.trim() || 'Not available';
  }

  get address(): string {
    return this.contact?.address?.trim() || 'Not available';
  }

  get createdAtValue(): number | string | null {
    return this.normalizeTimestamp(this.contact?.createdAt);
  }

  get updatedAtValue(): number | string | null {
    return this.normalizeTimestamp(this.contact?.updatedAt);
  }

  private normalizeTimestamp(value: string | number | undefined): number | string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'number') {
      return value < 10_000_000_000 ? value * 1000 : value;
    }

    return value;
  }
}
