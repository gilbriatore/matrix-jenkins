import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatrizDetailComponent } from './matriz-detail.component';

describe('Matriz Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MatrizDetailComponent,
              resolve: { matriz: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MatrizDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load matriz on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MatrizDetailComponent);

      // THEN
      expect(instance.matriz).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
