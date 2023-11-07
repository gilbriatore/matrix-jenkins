import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBloom } from '../bloom.model';
import { BloomService } from '../service/bloom.service';
import { BloomFormService, BloomFormGroup } from './bloom-form.service';

@Component({
  standalone: true,
  selector: 'jhi-bloom-update',
  templateUrl: './bloom-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BloomUpdateComponent implements OnInit {
  isSaving = false;
  bloom: IBloom | null = null;

  editForm: BloomFormGroup = this.bloomFormService.createBloomFormGroup();

  constructor(
    protected bloomService: BloomService,
    protected bloomFormService: BloomFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloom }) => {
      this.bloom = bloom;
      if (bloom) {
        this.updateForm(bloom);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bloom = this.bloomFormService.getBloom(this.editForm);
    if (bloom.id !== null) {
      this.subscribeToSaveResponse(this.bloomService.update(bloom));
    } else {
      this.subscribeToSaveResponse(this.bloomService.create(bloom));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBloom>>): void {
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

  protected updateForm(bloom: IBloom): void {
    this.bloom = bloom;
    this.bloomFormService.resetForm(this.editForm, bloom);
  }
}
