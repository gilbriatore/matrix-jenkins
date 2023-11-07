import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMatriz } from '../matriz.model';
import { MatrizService } from '../service/matriz.service';

@Component({
  standalone: true,
  templateUrl: './matriz-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MatrizDeleteDialogComponent {
  matriz?: IMatriz;

  constructor(
    protected matrizService: MatrizService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.matrizService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
