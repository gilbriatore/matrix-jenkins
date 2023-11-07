import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEscola } from '../escola.model';
import { EscolaService } from '../service/escola.service';

@Component({
  standalone: true,
  templateUrl: './escola-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EscolaDeleteDialogComponent {
  escola?: IEscola;

  constructor(
    protected escolaService: EscolaService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.escolaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
