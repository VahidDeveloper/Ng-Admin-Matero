import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * a service to do operations associated with.
 * it is to be implemented
 */
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  /**
   * CONSTRUCTOR
   */
  constructor() {}

  /**
   * it would add ping ticket.
   */
  addPingTicket(): Observable<any> {
    return of(true);
  }
}
