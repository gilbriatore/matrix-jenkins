import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAtividade } from '../atividade.model';
import { AtividadeService } from '../service/atividade.service';
import { AtividadeFormService, AtividadeFormGroup } from './atividade-form.service';

@Component({
  standalone: true,
  selector: 'jhi-atividade-update',
  templateUrl: './atividade-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AtividadeUpdateComponent implements OnInit {
  isSaving = false;
  atividade: IAtividade | null = null;

  editForm: AtividadeFormGroup = this.atividadeFormService.createAtividadeFormGroup();

  constructor(
    protected atividadeService: AtividadeService,
    protected atividadeFormService: AtividadeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atividade }) => {
      this.atividade = atividade;
      if (atividade) {
        this.updateForm(atividade);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const atividade = this.atividadeFormService.getAtividade(this.editForm);
    if (atividade.id !== null) {
      this.subscribeToSaveResponse(this.atividadeService.update(atividade));
    } else {
      this.subscribeToSaveResponse(this.atividadeService.create(atividade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAtividade>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(atividade: IAtividade): void {
    this.atividade = atividade;
    this.atividadeFormService.resetForm(this.editForm, atividade);
  }
}
