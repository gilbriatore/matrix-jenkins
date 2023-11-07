import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UnidadeService } from '../service/unidade.service';

import { UnidadeComponent } from './unidade.component';

describe('Unidade Management Component', () => {
  let comp: UnidadeComponent;
  let fixture: ComponentFixture<UnidadeComponent>;
  let service: UnidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'unidade', component: UnidadeComponent }]),
        HttpClientTestingModule,
        UnidadeComponent,
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
      .overrideTemplate(UnidadeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UnidadeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UnidadeService);

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
    expect(comp.unidades?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to unidadeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUnidadeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUnidadeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
