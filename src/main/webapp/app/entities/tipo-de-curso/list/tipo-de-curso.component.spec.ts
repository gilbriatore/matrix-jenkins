import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TipoDeCursoService } from '../service/tipo-de-curso.service';

import { TipoDeCursoComponent } from './tipo-de-curso.component';

describe('TipoDeCurso Management Component', () => {
  let comp: TipoDeCursoComponent;
  let fixture: ComponentFixture<TipoDeCursoComponent>;
  let service: TipoDeCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'tipo-de-curso', component: TipoDeCursoComponent }]),
        HttpClientTestingModule,
        TipoDeCursoComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TipoDeCursoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoDeCursoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TipoDeCursoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.tipoDeCursos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to tipoDeCursoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTipoDeCursoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTipoDeCursoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
