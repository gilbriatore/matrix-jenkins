import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EscolaService } from '../service/escola.service';

import { EscolaComponent } from './escola.component';

describe('Escola Management Component', () => {
  let comp: EscolaComponent;
  let fixture: ComponentFixture<EscolaComponent>;
  let service: EscolaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'escola', component: EscolaComponent }]), HttpClientTestingModule, EscolaComponent],
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
      .overrideTemplate(EscolaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EscolaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EscolaService);

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
    expect(comp.escolas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to escolaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEscolaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEscolaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
