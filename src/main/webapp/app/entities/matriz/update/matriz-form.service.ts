import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMatriz, NewMatriz } from '../matriz.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMatriz for edit and NewMatrizFormGroupInput for create.
 */
type MatrizFormGroupInput = IMatriz | PartialWithRequiredKeyOf<NewMatriz>;

type MatrizFormDefaults = Pick<NewMatriz, 'id'>;

type MatrizFormGroupContent = {
  id: FormControl<IMatriz['id'] | NewMatriz['id']>;
  codigo: FormControl<IMatriz['codigo']>;
};

export type MatrizFormGroup = FormGroup<MatrizFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MatrizFormService {
  createMatrizFormGroup(matriz: MatrizFormGroupInput = { id: null }): MatrizFormGroup {
    const matrizRawValue = {
      ...this.getFormDefaults(),
      ...matriz,
    };
    return new FormGroup<MatrizFormGroupContent>({
      id: new FormControl(
        { value: matrizRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigo: new FormControl(matrizRawValue.codigo),
    });
  }

  getMatriz(form: MatrizFormGroup): IMatriz | NewMatriz {
    return form.getRawValue() as IMatriz | NewMatriz;
  }

  resetForm(form: MatrizFormGroup, matriz: MatrizFormGroupInput): void {
    const matrizRawValue = { ...this.getFormDefaults(), ...matriz };
    form.reset(
      {
        ...matrizRawValue,
        id: { value: matrizRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MatrizFormDefaults {
    return {
      id: null,
    };
  }
}
