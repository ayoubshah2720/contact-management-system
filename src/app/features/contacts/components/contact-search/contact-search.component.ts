import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-search',
  imports: [FormsModule],
  templateUrl: './contact-search.component.html',
  styleUrl: './contact-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactSearchComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}
