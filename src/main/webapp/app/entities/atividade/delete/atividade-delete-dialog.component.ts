import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAtividade } from '../atividade.model';
import { AtividadeService } from '../service/atividade.service';

@Component({
  standalone: true,
  templateUrl: './atividade-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AtividadeDeleteDialogComponent {
  atividade?: IAtividade;

  constructor(
    protected atividadeService: AtividadeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.atividadeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
