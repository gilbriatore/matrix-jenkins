import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITipoDeCurso, NewTipoDeCurso } from '../tipo-de-curso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITipoDeCurso for edit and NewTipoDeCursoFormGroupInput for create.
 */
type TipoDeCursoFormGroupInput = ITipoDeCurso | PartialWithRequiredKeyOf<NewTipoDeCurso>;

type TipoDeCursoFormDefaults = Pick<NewTipoDeCurso, 'id'>;

type TipoDeCursoFormGroupContent = {
  id: FormControl<ITipoDeCurso['id'] | NewTipoDeCurso['id']>;
  nome: FormControl<ITipoDeCurso['nome']>;
};

export type TipoDeCursoFormGroup = FormGroup<TipoDeCursoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TipoDeCursoFormService {
  createTipoDeCursoFormGroup(tipoDeCurso: TipoDeCursoFormGroupInput = { id: null }): TipoDeCursoFormGroup {
    const tipoDeCursoRawValue = {
      ...this.getFormDefaults(),
      ...tipoDeCurso,
    };
    return new FormGroup<TipoDeCursoFormGroupContent>({
      id: new FormControl(
        { value: tipoDeCursoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(tipoDeCursoRawValue.nome),
    });
  }

  getTipoDeCurso(form: TipoDeCursoFormGroup): ITipoDeCurso | NewTipoDeCurso {
    return form.getRawValue() as ITipoDeCurso | NewTipoDeCurso;
  }

  resetForm(form: TipoDeCursoFormGroup, tipoDeCurso: TipoDeCursoFormGroupInput): void {
    const tipoDeCursoRawValue = { ...this.getFormDefaults(), ...tipoDeCurso };
    form.reset(
      {
        ...tipoDeCursoRawValue,
        id: { value: tipoDeCursoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TipoDeCursoFormDefaults {
    return {
      id: null,
    };
  }
}
