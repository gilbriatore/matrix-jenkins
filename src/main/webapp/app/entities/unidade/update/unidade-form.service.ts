import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUnidade, NewUnidade } from '../unidade.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUnidade for edit and NewUnidadeFormGroupInput for create.
 */
type UnidadeFormGroupInput = IUnidade | PartialWithRequiredKeyOf<NewUnidade>;

type UnidadeFormDefaults = Pick<NewUnidade, 'id'>;

type UnidadeFormGroupContent = {
  id: FormControl<IUnidade['id'] | NewUnidade['id']>;
  codigo: FormControl<IUnidade['codigo']>;
};

export type UnidadeFormGroup = FormGroup<UnidadeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UnidadeFormService {
  createUnidadeFormGroup(unidade: UnidadeFormGroupInput = { id: null }): UnidadeFormGroup {
    const unidadeRawValue = {
      ...this.getFormDefaults(),
      ...unidade,
    };
    return new FormGroup<UnidadeFormGroupContent>({
      id: new FormControl(
        { value: unidadeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigo: new FormControl(unidadeRawValue.codigo),
    });
  }

  getUnidade(form: UnidadeFormGroup): IUnidade | NewUnidade {
    return form.getRawValue() as IUnidade | NewUnidade;
  }

  resetForm(form: UnidadeFormGroup, unidade: UnidadeFormGroupInput): void {
    const unidadeRawValue = { ...this.getFormDefaults(), ...unidade };
    form.reset(
      {
        ...unidadeRawValue,
        id: { value: unidadeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UnidadeFormDefaults {
    return {
      id: null,
    };
  }
}
