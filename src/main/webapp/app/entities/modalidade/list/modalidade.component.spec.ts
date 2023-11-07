import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ModalidadeService } from '../service/modalidade.service';

import { ModalidadeComponent } from './modalidade.component';

describe('Modalidade Management Component', () => {
  let comp: ModalidadeComponent;
  let fixture: ComponentFixture<ModalidadeComponent>;
  let service: ModalidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'modalidade', component: ModalidadeComponent }]),
        HttpClientTestingModule,
        ModalidadeComponent,
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
      .overrideTemplate(ModalidadeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModalidadeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ModalidadeService);

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
    expect(comp.modalidades?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to modalidadeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getModalidadeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getModalidadeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
