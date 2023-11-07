import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UnidadeDetailComponent } from './unidade-detail.component';

describe('Unidade Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UnidadeDetailComponent,
              resolve: { unidade: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UnidadeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load unidade on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UnidadeDetailComponent);

      // THEN
      expect(instance.unidade).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
