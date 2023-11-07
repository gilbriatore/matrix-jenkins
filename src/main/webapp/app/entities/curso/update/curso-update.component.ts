import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEscola } from 'app/entities/escola/escola.model';
import { EscolaService } from 'app/entities/escola/service/escola.service';
import { ITipoDeCurso } from 'app/entities/tipo-de-curso/tipo-de-curso.model';
import { TipoDeCursoService } from 'app/entities/tipo-de-curso/service/tipo-de-curso.service';
import { CursoService } from '../service/curso.service';
import { ICurso } from '../curso.model';
import { CursoFormService, CursoFormGroup } from './curso-form.service';

@Component({
  standalone: true,
  selector: 'jhi-curso-update',
  templateUrl: './curso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CursoUpdateComponent implements OnInit {
  isSaving = false;
  curso: ICurso | null = null;

  escolasSharedCollection: IEscola[] = [];
  tipoDeCursosSharedCollection: ITipoDeCurso[] = [];

  editForm: CursoFormGroup = this.cursoFormService.createCursoFormGroup();

  constructor(
    protected cursoService: CursoService,
    protected cursoFormService: CursoFormService,
    protected escolaService: EscolaService,
    protected tipoDeCursoService: TipoDeCursoService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareEscola = (o1: IEscola | null, o2: IEscola | null): boolean => this.escolaService.compareEscola(o1, o2);

  compareTipoDeCurso = (o1: ITipoDeCurso | null, o2: ITipoDeCurso | null): boolean => this.tipoDeCursoService.compareTipoDeCurso(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ curso }) => {
      this.curso = curso;
      if (curso) {
        this.updateForm(curso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const curso = this.cursoFormService.getCurso(this.editForm);
    if (curso.id !== null) {
      this.subscribeToSaveResponse(this.cursoService.update(curso));
    } else {
      this.subscribeToSaveResponse(this.cursoService.create(curso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurso>>): void {
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

  protected updateForm(curso: ICurso): void {
    this.curso = curso;
    this.cursoFormService.resetForm(this.editForm, curso);

    this.escolasSharedCollection = this.escolaService.addEscolaToCollectionIfMissing<IEscola>(this.escolasSharedCollection, curso.escola);
    this.tipoDeCursosSharedCollection = this.tipoDeCursoService.addTipoDeCursoToCollectionIfMissing<ITipoDeCurso>(
      this.tipoDeCursosSharedCollection,
      curso.tipo,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.escolaService
      .query()
      .pipe(map((res: HttpResponse<IEscola[]>) => res.body ?? []))
      .pipe(map((escolas: IEscola[]) => this.escolaService.addEscolaToCollectionIfMissing<IEscola>(escolas, this.curso?.escola)))
      .subscribe((escolas: IEscola[]) => (this.escolasSharedCollection = escolas));

    this.tipoDeCursoService
      .query()
      .pipe(map((res: HttpResponse<ITipoDeCurso[]>) => res.body ?? []))
      .pipe(
        map((tipoDeCursos: ITipoDeCurso[]) =>
          this.tipoDeCursoService.addTipoDeCursoToCollectionIfMissing<ITipoDeCurso>(tipoDeCursos, this.curso?.tipo),
        ),
      )
      .subscribe((tipoDeCursos: ITipoDeCurso[]) => (this.tipoDeCursosSharedCollection = tipoDeCursos));
  }
}
