import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAtividade, NewAtividade } from '../atividade.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAtividade for edit and NewAtividadeFormGroupInput for create.
 */
type AtividadeFormGroupInput = IAtividade | PartialWithRequiredKeyOf<NewAtividade>;

type AtividadeFormDefaults = Pick<NewAtividade, 'id'>;

type AtividadeFormGroupContent = {
  id: FormControl<IAtividade['id'] | NewAtividade['id']>;
  nome: FormControl<IAtividade['nome']>;
};

export type AtividadeFormGroup = FormGroup<AtividadeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AtividadeFormService {
  createAtividadeFormGroup(atividade: AtividadeFormGroupInput = { id: null }): AtividadeFormGroup {
    const atividadeRawValue = {
      ...this.getFormDefaults(),
      ...atividade,
    };
    return new FormGroup<AtividadeFormGroupContent>({
      id: new FormControl(
        { value: atividadeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(atividadeRawValue.nome),
    });
  }

  getAtividade(form: AtividadeFormGroup): IAtividade | NewAtividade {
    return form.getRawValue() as IAtividade | NewAtividade;
  }

  resetForm(form: AtividadeFormGroup, atividade: AtividadeFormGroupInput): void {
    const atividadeRawValue = { ...this.getFormDefaults(), ...atividade };
    form.reset(
      {
        ...atividadeRawValue,
        id: { value: atividadeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AtividadeFormDefaults {
    return {
      id: null,
    };
  }
}
