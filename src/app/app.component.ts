import { Component, OnInit } from '@angular/core';
import {of, timer, concat, fromEvent, interval, Observable, Subscription, forkJoin} from 'rxjs';
import {map, mergeMap, mapTo, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  subscriptions: Subscription[] = [];

  reset() {
    this.subscriptions.map(s => s.unsubscribe());
  }

  /**
   * Subscribe to Observables in order but only when the previous completes, let me know, then move to the next one.
   */
  concat() {
    const postOne$ = timer(2000).pipe(mapTo({ id: 1}));
    const postTwo$ = timer(5000).pipe(mapTo({ id: 2}));
    const postThree$ = timer(2000).pipe(mapTo({ id: 3}));

    const unsubscribe = concat(postOne$, postTwo$, postThree$).subscribe(val => console.log(val));

    this.subscriptions.push(unsubscribe);
  }

  /**
   * Don’t let me know until all the Observables are complete, then give me all the values at once. ( Array )
   * (forkJoin is the Promise.all() of Rx.)
   */
  forkJoin() {
    const postOne$ = timer(2000).pipe(mapTo({ id: 1}));
    const postTwo$ = timer(5000).pipe(mapTo({ id: 2}));
    const postThree$ = timer(2000).pipe(mapTo({ id: 3}));

    const unsubscribe = forkJoin(postOne$, postTwo$, postThree$).subscribe(val => console.log(val));

    this.subscriptions.push(unsubscribe);
  }

  /**
   * Only when the inner Observable emits, let me know by merging the value to the outer Observable.
   */
  mergeMap() {
    // Source ( or outer ) Observable
    const clicks$ = fromEvent(document, 'click');
    // Inner Observable
    const innerObservable$ = interval(1000);

    const unsubscribe = clicks$.pipe(mergeMap(event => innerObservable$)).subscribe(val => console.log(val));

    this.subscriptions.push(unsubscribe);
  }

  /**
   * Like mergeMap but when the source Observable emits cancel any previous subscriptions of the inner Observable.
   */
  switchMap() {
    // Source ( or outer ) Observable
    const clicks$ = fromEvent(document, 'click');
    // Inner Observable
    const innerObservable$ = interval(1000);

    const unsubscribe = clicks$.pipe(switchMap(event => innerObservable$)).subscribe(val => console.log(val));

    this.subscriptions.push(unsubscribe);
  }
}
