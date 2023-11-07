import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TipoDeCursoDetailComponent } from './tipo-de-curso-detail.component';

describe('TipoDeCurso Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoDeCursoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TipoDeCursoDetailComponent,
              resolve: { tipoDeCurso: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TipoDeCursoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tipoDeCurso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TipoDeCursoDetailComponent);

      // THEN
      expect(instance.tipoDeCurso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
