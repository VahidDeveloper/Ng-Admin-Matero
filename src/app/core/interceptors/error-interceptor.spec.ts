import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { errorInterceptor } from './error-interceptor';
import { ToastService } from '@shared/services';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let router: Router;
  let toast: ToastService;
  const emptyFn = () => {};

  function assertStatus(status: number, statusText: string) {
    spyOn(router, 'navigateByUrl');

    http.get('/user').subscribe({ next: emptyFn, error: emptyFn, complete: emptyFn });

    httpMock.expectOne('/user').flush({}, { status, statusText });

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/${status}`, {
      skipLocationChange: true,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => httpMock.verify());

  it('should handle status code 401', () => {
    spyOn(router, 'navigateByUrl');
    spyOn(toast, 'open');

    http.get('/user').subscribe({ next: emptyFn, error: emptyFn, complete: emptyFn });
    httpMock.expectOne('/user').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(toast.open).toHaveBeenCalledWith('401 Unauthorized', 'error');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should handle status code 403', () => {
    assertStatus(403, 'Forbidden');
  });

  it('should handle status code 404', () => {
    assertStatus(404, 'Not Found');
  });

  it('should handle status code 500', () => {
    assertStatus(500, 'Internal Server Error');
  });

  it('should handle others status code', () => {
    spyOn(toast, 'open');

    http.get('/user').subscribe({ next: emptyFn, error: emptyFn, complete: emptyFn });

    httpMock.expectOne('/user').flush({}, { status: 504, statusText: 'Gateway Timeout' });

    expect(toast.open).toHaveBeenCalledWith('504 Gateway Timeout', 'error');
  });
});
