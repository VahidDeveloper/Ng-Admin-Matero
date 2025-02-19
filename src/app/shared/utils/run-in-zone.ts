import { NgZone } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';

/**
 *
 * @param zone ngZone for running observable in angular zone
 */
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return source => {
    return new Observable(observer => {
      const onNext = (value: T) => zone.run(() => observer.next(value));
      const onError = (e: any) => zone.run(() => observer.error(e));
      const onComplete = () => zone.run(() => observer.complete());
      return source.subscribe({ next: onNext, error: onError, complete: onComplete });
    });
  };
}
