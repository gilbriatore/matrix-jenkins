import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BloomDetailComponent } from './bloom-detail.component';

describe('Bloom Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloomDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BloomDetailComponent,
              resolve: { bloom: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BloomDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load bloom on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BloomDetailComponent);

      // THEN
      expect(instance.bloom).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
