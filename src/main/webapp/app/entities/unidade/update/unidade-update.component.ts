import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUnidade } from '../unidade.model';
import { UnidadeService } from '../service/unidade.service';
import { UnidadeFormService, UnidadeFormGroup } from './unidade-form.service';

@Component({
  standalone: true,
  selector: 'jhi-unidade-update',
  templateUrl: './unidade-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UnidadeUpdateComponent implements OnInit {
  isSaving = false;
  unidade: IUnidade | null = null;

  editForm: UnidadeFormGroup = this.unidadeFormService.createUnidadeFormGroup();

  constructor(
    protected unidadeService: UnidadeService,
    protected unidadeFormService: UnidadeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unidade }) => {
      this.unidade = unidade;
      if (unidade) {
        this.updateForm(unidade);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unidade = this.unidadeFormService.getUnidade(this.editForm);
    if (unidade.id !== null) {
      this.subscribeToSaveResponse(this.unidadeService.update(unidade));
    } else {
      this.subscribeToSaveResponse(this.unidadeService.create(unidade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnidade>>): void {
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

  protected updateForm(unidade: IUnidade): void {
    this.unidade = unidade;
    this.unidadeFormService.resetForm(this.editForm, unidade);
  }
}
