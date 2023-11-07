import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUnidade } from '../unidade.model';
import { UnidadeService } from '../service/unidade.service';

@Component({
  standalone: true,
  templateUrl: './unidade-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UnidadeDeleteDialogComponent {
  unidade?: IUnidade;

  constructor(
    protected unidadeService: UnidadeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.unidadeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
