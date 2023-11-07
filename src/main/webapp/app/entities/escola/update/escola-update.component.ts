import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEscola } from '../escola.model';
import { EscolaService } from '../service/escola.service';
import { EscolaFormService, EscolaFormGroup } from './escola-form.service';

@Component({
  standalone: true,
  selector: 'jhi-escola-update',
  templateUrl: './escola-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EscolaUpdateComponent implements OnInit {
  isSaving = false;
  escola: IEscola | null = null;

  editForm: EscolaFormGroup = this.escolaFormService.createEscolaFormGroup();

  constructor(
    protected escolaService: EscolaService,
    protected escolaFormService: EscolaFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ escola }) => {
      this.escola = escola;
      if (escola) {
        this.updateForm(escola);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const escola = this.escolaFormService.getEscola(this.editForm);
    if (escola.id !== null) {
      this.subscribeToSaveResponse(this.escolaService.update(escola));
    } else {
      this.subscribeToSaveResponse(this.escolaService.create(escola));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEscola>>): void {
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

  protected updateForm(escola: IEscola): void {
    this.escola = escola;
    this.escolaFormService.resetForm(this.editForm, escola);
  }
}
