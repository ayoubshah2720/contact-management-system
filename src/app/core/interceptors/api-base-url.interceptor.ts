import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (environment.useLocalMockData || /^https?:\/\//i.test(request.url)) {
    return next(request);
  }

  const normalizedBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath = request.url.replace(/^\/+/, '');

  return next(request.clone({ url: `${normalizedBaseUrl}/${normalizedPath}` }));
};
