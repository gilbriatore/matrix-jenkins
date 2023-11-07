import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITipoDeCurso } from '../tipo-de-curso.model';

@Component({
  standalone: true,
  selector: 'jhi-tipo-de-curso-detail',
  templateUrl: './tipo-de-curso-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TipoDeCursoDetailComponent {
  @Input() tipoDeCurso: ITipoDeCurso | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
