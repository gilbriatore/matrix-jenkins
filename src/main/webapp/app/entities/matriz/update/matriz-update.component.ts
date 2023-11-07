import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMatriz } from '../matriz.model';
import { MatrizService } from '../service/matriz.service';
import { MatrizFormService, MatrizFormGroup } from './matriz-form.service';

@Component({
  standalone: true,
  selector: 'jhi-matriz-update',
  templateUrl: './matriz-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MatrizUpdateComponent implements OnInit {
  isSaving = false;
  matriz: IMatriz | null = null;

  editForm: MatrizFormGroup = this.matrizFormService.createMatrizFormGroup();

  constructor(
    protected matrizService: MatrizService,
    protected matrizFormService: MatrizFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matriz }) => {
      this.matriz = matriz;
      if (matriz) {
        this.updateForm(matriz);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const matriz = this.matrizFormService.getMatriz(this.editForm);
    if (matriz.id !== null) {
      this.subscribeToSaveResponse(this.matrizService.update(matriz));
    } else {
      this.subscribeToSaveResponse(this.matrizService.create(matriz));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatriz>>): void {
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

  protected updateForm(matriz: IMatriz): void {
    this.matriz = matriz;
    this.matrizFormService.resetForm(this.editForm, matriz);
  }
}
