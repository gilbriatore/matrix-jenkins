import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICurso, NewCurso } from '../curso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICurso for edit and NewCursoFormGroupInput for create.
 */
type CursoFormGroupInput = ICurso | PartialWithRequiredKeyOf<NewCurso>;

type CursoFormDefaults = Pick<NewCurso, 'id'>;

type CursoFormGroupContent = {
  id: FormControl<ICurso['id'] | NewCurso['id']>;
  nome: FormControl<ICurso['nome']>;
  cargaHorasMinCurso: FormControl<ICurso['cargaHorasMinCurso']>;
  cargaHorasMinEstagio: FormControl<ICurso['cargaHorasMinEstagio']>;
  percMaxEstagioAC: FormControl<ICurso['percMaxEstagioAC']>;
  percMaxAtividadeDistancia: FormControl<ICurso['percMaxAtividadeDistancia']>;
  escola: FormControl<ICurso['escola']>;
  tipo: FormControl<ICurso['tipo']>;
};

export type CursoFormGroup = FormGroup<CursoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CursoFormService {
  createCursoFormGroup(curso: CursoFormGroupInput = { id: null }): CursoFormGroup {
    const cursoRawValue = {
      ...this.getFormDefaults(),
      ...curso,
    };
    return new FormGroup<CursoFormGroupContent>({
      id: new FormControl(
        { value: cursoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(cursoRawValue.nome),
      cargaHorasMinCurso: new FormControl(cursoRawValue.cargaHorasMinCurso),
      cargaHorasMinEstagio: new FormControl(cursoRawValue.cargaHorasMinEstagio),
      percMaxEstagioAC: new FormControl(cursoRawValue.percMaxEstagioAC),
      percMaxAtividadeDistancia: new FormControl(cursoRawValue.percMaxAtividadeDistancia),
      escola: new FormControl(cursoRawValue.escola),
      tipo: new FormControl(cursoRawValue.tipo),
    });
  }

  getCurso(form: CursoFormGroup): ICurso | NewCurso {
    return form.getRawValue() as ICurso | NewCurso;
  }

  resetForm(form: CursoFormGroup, curso: CursoFormGroupInput): void {
    const cursoRawValue = { ...this.getFormDefaults(), ...curso };
    form.reset(
      {
        ...cursoRawValue,
        id: { value: cursoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CursoFormDefaults {
    return {
      id: null,
    };
  }
}
