import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EscolaDetailComponent } from './escola-detail.component';

describe('Escola Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscolaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EscolaDetailComponent,
              resolve: { escola: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EscolaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load escola on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EscolaDetailComponent);

      // THEN
      expect(instance.escola).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
