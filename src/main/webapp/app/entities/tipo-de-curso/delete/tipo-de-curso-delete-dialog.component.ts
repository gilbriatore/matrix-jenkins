import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITipoDeCurso } from '../tipo-de-curso.model';
import { TipoDeCursoService } from '../service/tipo-de-curso.service';

@Component({
  standalone: true,
  templateUrl: './tipo-de-curso-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TipoDeCursoDeleteDialogComponent {
  tipoDeCurso?: ITipoDeCurso;

  constructor(
    protected tipoDeCursoService: TipoDeCursoService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tipoDeCursoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
