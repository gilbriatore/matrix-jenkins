import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBloom } from '../bloom.model';
import { BloomService } from '../service/bloom.service';

@Component({
  standalone: true,
  templateUrl: './bloom-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BloomDeleteDialogComponent {
  bloom?: IBloom;

  constructor(
    protected bloomService: BloomService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bloomService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
