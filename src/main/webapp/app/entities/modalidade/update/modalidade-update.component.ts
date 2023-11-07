import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IModalidade } from '../modalidade.model';
import { ModalidadeService } from '../service/modalidade.service';
import { ModalidadeFormService, ModalidadeFormGroup } from './modalidade-form.service';

@Component({
  standalone: true,
  selector: 'jhi-modalidade-update',
  templateUrl: './modalidade-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ModalidadeUpdateComponent implements OnInit {
  isSaving = false;
  modalidade: IModalidade | null = null;

  editForm: ModalidadeFormGroup = this.modalidadeFormService.createModalidadeFormGroup();

  constructor(
    protected modalidadeService: ModalidadeService,
    protected modalidadeFormService: ModalidadeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ modalidade }) => {
      this.modalidade = modalidade;
      if (modalidade) {
        this.updateForm(modalidade);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const modalidade = this.modalidadeFormService.getModalidade(this.editForm);
    if (modalidade.id !== null) {
      this.subscribeToSaveResponse(this.modalidadeService.update(modalidade));
    } else {
      this.subscribeToSaveResponse(this.modalidadeService.create(modalidade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModalidade>>): void {
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

  protected updateForm(modalidade: IModalidade): void {
    this.modalidade = modalidade;
    this.modalidadeFormService.resetForm(this.editForm, modalidade);
  }
}
