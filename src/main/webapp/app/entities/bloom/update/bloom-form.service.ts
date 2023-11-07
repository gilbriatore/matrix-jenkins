import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBloom, NewBloom } from '../bloom.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBloom for edit and NewBloomFormGroupInput for create.
 */
type BloomFormGroupInput = IBloom | PartialWithRequiredKeyOf<NewBloom>;

type BloomFormDefaults = Pick<NewBloom, 'id'>;

type BloomFormGroupContent = {
  id: FormControl<IBloom['id'] | NewBloom['id']>;
  nivel: FormControl<IBloom['nivel']>;
};

export type BloomFormGroup = FormGroup<BloomFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BloomFormService {
  createBloomFormGroup(bloom: BloomFormGroupInput = { id: null }): BloomFormGroup {
    const bloomRawValue = {
      ...this.getFormDefaults(),
      ...bloom,
    };
    return new FormGroup<BloomFormGroupContent>({
      id: new FormControl(
        { value: bloomRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nivel: new FormControl(bloomRawValue.nivel),
    });
  }

  getBloom(form: BloomFormGroup): IBloom | NewBloom {
    return form.getRawValue() as IBloom | NewBloom;
  }

  resetForm(form: BloomFormGroup, bloom: BloomFormGroupInput): void {
    const bloomRawValue = { ...this.getFormDefaults(), ...bloom };
    form.reset(
      {
        ...bloomRawValue,
        id: { value: bloomRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BloomFormDefaults {
    return {
      id: null,
    };
  }
}
