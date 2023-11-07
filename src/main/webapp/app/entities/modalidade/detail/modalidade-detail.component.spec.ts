import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ModalidadeDetailComponent } from './modalidade-detail.component';

describe('Modalidade Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalidadeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ModalidadeDetailComponent,
              resolve: { modalidade: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ModalidadeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load modalidade on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ModalidadeDetailComponent);

      // THEN
      expect(instance.modalidade).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
