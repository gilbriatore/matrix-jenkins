import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatrizService } from '../service/matriz.service';

import { MatrizComponent } from './matriz.component';

describe('Matriz Management Component', () => {
  let comp: MatrizComponent;
  let fixture: ComponentFixture<MatrizComponent>;
  let service: MatrizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'matriz', component: MatrizComponent }]), HttpClientTestingModule, MatrizComponent],
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
      .overrideTemplate(MatrizComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatrizComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MatrizService);

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
    expect(comp.matrizs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to matrizService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMatrizIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMatrizIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
