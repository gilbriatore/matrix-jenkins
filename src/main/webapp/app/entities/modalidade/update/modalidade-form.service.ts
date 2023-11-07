import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IModalidade, NewModalidade } from '../modalidade.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IModalidade for edit and NewModalidadeFormGroupInput for create.
 */
type ModalidadeFormGroupInput = IModalidade | PartialWithRequiredKeyOf<NewModalidade>;

type ModalidadeFormDefaults = Pick<NewModalidade, 'id'>;

type ModalidadeFormGroupContent = {
  id: FormControl<IModalidade['id'] | NewModalidade['id']>;
  nome: FormControl<IModalidade['nome']>;
};

export type ModalidadeFormGroup = FormGroup<ModalidadeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModalidadeFormService {
  createModalidadeFormGroup(modalidade: ModalidadeFormGroupInput = { id: null }): ModalidadeFormGroup {
    const modalidadeRawValue = {
      ...this.getFormDefaults(),
      ...modalidade,
    };
    return new FormGroup<ModalidadeFormGroupContent>({
      id: new FormControl(
        { value: modalidadeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(modalidadeRawValue.nome),
    });
  }

  getModalidade(form: ModalidadeFormGroup): IModalidade | NewModalidade {
    return form.getRawValue() as IModalidade | NewModalidade;
  }

  resetForm(form: ModalidadeFormGroup, modalidade: ModalidadeFormGroupInput): void {
    const modalidadeRawValue = { ...this.getFormDefaults(), ...modalidade };
    form.reset(
      {
        ...modalidadeRawValue,
        id: { value: modalidadeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ModalidadeFormDefaults {
    return {
      id: null,
    };
  }
}
