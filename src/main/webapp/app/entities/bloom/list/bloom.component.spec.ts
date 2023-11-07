import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BloomService } from '../service/bloom.service';

import { BloomComponent } from './bloom.component';

describe('Bloom Management Component', () => {
  let comp: BloomComponent;
  let fixture: ComponentFixture<BloomComponent>;
  let service: BloomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'bloom', component: BloomComponent }]), HttpClientTestingModule, BloomComponent],
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
      .overrideTemplate(BloomComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BloomComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BloomService);

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
    expect(comp.blooms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bloomService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBloomIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBloomIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
