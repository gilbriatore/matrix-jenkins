import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AtividadeDetailComponent } from './atividade-detail.component';

describe('Atividade Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AtividadeDetailComponent,
              resolve: { atividade: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AtividadeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load atividade on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AtividadeDetailComponent);

      // THEN
      expect(instance.atividade).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
