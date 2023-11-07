import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CursoDetailComponent } from './curso-detail.component';

describe('Curso Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CursoDetailComponent,
              resolve: { curso: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CursoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load curso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CursoDetailComponent);

      // THEN
      expect(instance.curso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
