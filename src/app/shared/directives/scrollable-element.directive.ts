import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil, throttleTime } from 'rxjs/operators';

/**
 * this directive is created to add scroll-y to an element base on window height
 */
@Directive({
  selector: '[scrollElement]',
})
export class ScrollableElementDirective implements AfterViewInit, OnDestroy {
  /**
   * get custom offset to calculate height bas on ui content
   */
  @Input() topOffset?: number;
  @HostBinding('style.overflow-y') overflowY = 'auto';
  @HostBinding('class') class = 'scrollable-element';
  private readonly domElement: HTMLElement;
  private resizeSub: Subject<any>;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _cdr: ChangeDetectorRef
  ) {
    this.resizeSub = new Subject<any>();
    // get ref HTML element
    this.domElement = this.el.nativeElement as HTMLElement;
    // register on window resize event
    fromEvent(window, 'resize')
      .pipe(throttleTime(200), debounceTime(200), takeUntil(this.resizeSub))
      .subscribe(() => this.setHeight())
      .add(() => {
        this._cdr.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  ngOnDestroy() {
    this.resizeSub.next(true);
    this.resizeSub.complete();
  }

  private setHeight() {
    const parentHeight = this.domElement.parentElement?.offsetHeight;
    if (this.topOffset && parentHeight) {
      this.renderer.setStyle(this.domElement, 'height', `${parentHeight - this.topOffset}px`);
      this._cdr.detectChanges();
    }
  }
}
