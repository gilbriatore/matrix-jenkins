import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEscola, NewEscola } from '../escola.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEscola for edit and NewEscolaFormGroupInput for create.
 */
type EscolaFormGroupInput = IEscola | PartialWithRequiredKeyOf<NewEscola>;

type EscolaFormDefaults = Pick<NewEscola, 'id'>;

type EscolaFormGroupContent = {
  id: FormControl<IEscola['id'] | NewEscola['id']>;
  nome: FormControl<IEscola['nome']>;
};

export type EscolaFormGroup = FormGroup<EscolaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EscolaFormService {
  createEscolaFormGroup(escola: EscolaFormGroupInput = { id: null }): EscolaFormGroup {
    const escolaRawValue = {
      ...this.getFormDefaults(),
      ...escola,
    };
    return new FormGroup<EscolaFormGroupContent>({
      id: new FormControl(
        { value: escolaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(escolaRawValue.nome),
    });
  }

  getEscola(form: EscolaFormGroup): IEscola | NewEscola {
    return form.getRawValue() as IEscola | NewEscola;
  }

  resetForm(form: EscolaFormGroup, escola: EscolaFormGroupInput): void {
    const escolaRawValue = { ...this.getFormDefaults(), ...escola };
    form.reset(
      {
        ...escolaRawValue,
        id: { value: escolaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EscolaFormDefaults {
    return {
      id: null,
    };
  }
}
