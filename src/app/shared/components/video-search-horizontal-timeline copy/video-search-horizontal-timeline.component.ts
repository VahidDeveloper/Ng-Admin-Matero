import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionSearchType, TimelineIcon } from '@shared/enums';
import { SessionSearchFoundTextsDetails, HorizontalTimeline } from '@shared/interfaces';

/** a component for show received sessionText in time line bar */
@Component({
  standalone: true,
  selector: 'app-horizontal-timeline',
  templateUrl: './video-search-horizontal-timeline.component.html',
  styleUrls: ['./video-search-horizontal-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltipModule],
})
export class VideoSearchHorizontalTimelineComponent implements OnChanges {
  /** timeline items */
  @Input() readonly items: SessionSearchFoundTextsDetails[] = [];
  /** set timeline items to the this local var */
  _items: HorizontalTimeline[] = [];
  /** vide full time */
  @Input() videoDuration: { start: number; end: number } | undefined;
  /** set video time to this local var */
  _videoDuration: { start: number; end: number } | undefined;
  /** emit selected item data from received items */
  _videoDurationToolTip: string | undefined;
  /** item click event emit selected item object */
  @Output() itemClick: EventEmitter<SessionSearchFoundTextsDetails> =
    new EventEmitter<SessionSearchFoundTextsDetails>();
  /**
   * it emit fetch more event
   * if founded item length greater than 10 fetch more icon event is available
   */
  @Output() fetchMore: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.videoDuration) {
      this._videoDuration = changes.videoDuration?.currentValue;
      if (this._videoDuration) {
        this._videoDurationToolTip = this._convertTimestampToStrTime(
          this._videoDuration?.end - this._videoDuration?.start
        );
      }
    }
    if (changes.items) {
      this._items = this._mapToLocal(changes.items.currentValue);
    }
    this._cdr.markForCheck();
  }

  /** find selected item from received items list and emit that */
  emitSelectedItem(item: HorizontalTimeline): void {
    this.itemClick.emit(item.sessionSearch);
  }

  /** mapping to local item for use in template */
  private _mapToLocal(list: SessionSearchFoundTextsDetails[]): HorizontalTimeline[] {
    if (list.length) {
      list = list.sort((a, b) => a.videoTime - b.videoTime);
      return list.map((item, index) => ({
        sessionSearch: item,
        left: this._getItemPosition(item.videoTime),
        tooltip: this._convertTimestampToStrTime(item.videoTime),
        icon: this._mappingIcon(item.textInput),
        index,
      })) as HorizontalTimeline[];
    }
    return [];
  }

  /** mapping item session result type to horizontal icons */
  private _mappingIcon = (textInput: SessionSearchType): TimelineIcon => {
    switch (textInput) {
      case SessionSearchType.SessionText:
        return TimelineIcon.Clipboard;
      case SessionSearchType.PasteFromRemote:
        return TimelineIcon.Paste;
      case SessionSearchType.CopyToRemote:
        return TimelineIcon.Copy;
      case SessionSearchType.BlockedCopyToRemote:
        return TimelineIcon.Copy;
      case SessionSearchType.KeyLog:
        return TimelineIcon.Keyboard;
      case SessionSearchType.BlockedPasteFromRemote:
        return TimelineIcon.Paste;
      case SessionSearchType.ForbiddenCommand:
        return TimelineIcon.Copy;
      default:
        return TimelineIcon.Paste;
    }
  };

  /** it get items position in timeline bar per percent */
  private _getItemPosition(videoTime: number): number {
    if (this._videoDuration) {
      return (videoTime * 100) / (this._videoDuration.end - this._videoDuration.start);
    }
    return 0;
  }

  /** it get full time from  */
  private _convertTimestampToStrTime = (time: number): string | undefined => {
    if (typeof time === 'number') {
      return new Date(time).toISOString().split('T')[1].split('.')[0];
    }
    return undefined;
  };
}
