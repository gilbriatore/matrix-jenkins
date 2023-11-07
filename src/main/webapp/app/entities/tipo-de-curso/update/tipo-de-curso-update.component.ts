import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITipoDeCurso } from '../tipo-de-curso.model';
import { TipoDeCursoService } from '../service/tipo-de-curso.service';
import { TipoDeCursoFormService, TipoDeCursoFormGroup } from './tipo-de-curso-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tipo-de-curso-update',
  templateUrl: './tipo-de-curso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TipoDeCursoUpdateComponent implements OnInit {
  isSaving = false;
  tipoDeCurso: ITipoDeCurso | null = null;

  editForm: TipoDeCursoFormGroup = this.tipoDeCursoFormService.createTipoDeCursoFormGroup();

  constructor(
    protected tipoDeCursoService: TipoDeCursoService,
    protected tipoDeCursoFormService: TipoDeCursoFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoDeCurso }) => {
      this.tipoDeCurso = tipoDeCurso;
      if (tipoDeCurso) {
        this.updateForm(tipoDeCurso);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoDeCurso = this.tipoDeCursoFormService.getTipoDeCurso(this.editForm);
    if (tipoDeCurso.id !== null) {
      this.subscribeToSaveResponse(this.tipoDeCursoService.update(tipoDeCurso));
    } else {
      this.subscribeToSaveResponse(this.tipoDeCursoService.create(tipoDeCurso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoDeCurso>>): void {
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

  protected updateForm(tipoDeCurso: ITipoDeCurso): void {
    this.tipoDeCurso = tipoDeCurso;
    this.tipoDeCursoFormService.resetForm(this.editForm, tipoDeCurso);
  }
}
