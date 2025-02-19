import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { WizardStep, WizardConfigs } from '@shared/models';
import { tr } from 'date-fns/locale';

/** A component for creating wizard (multi-step) modal */
@Component({
  standalone: true,
  selector: 'app-wina-wizard',
  templateUrl: './wina-wizard.component.html',
  styleUrls: ['./wina-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
})
export class WinaWizardComponent implements OnInit {
  /** to find is edit or add */
  @Input() isEditing = false;
  /** the list of steps information including their template */
  @Input() readonly steps: WizardStep[] = [];
  /** configurations of modal */
  @Input() configs: Readonly<WizardConfigs> | undefined;
  /** flag for indicating when component is busy with fetching data */
  @Input() readonly isLoading = false;
  /** it gets called when cancel has been clicked */
  @Output() canceled = new EventEmitter();
  /** it gets called when submit has been clicked */
  @Output() submitted = new EventEmitter();
  /** it gets called when next button has been clicked */
  @Output() stepChange = new EventEmitter<string>();
  /** current step index */
  currentStepIndex = 0;

  /** component OnInit */
  ngOnInit(): void {
    if (!this.configs) {
      this.configs = new WizardConfigs();
    }
  }

  /** it gets called on step change */
  onStepChange(index: number): void {
    if (index < 0) {
      this.currentStepIndex = 0;
    } else if (index > this.steps?.length - 1) {
      this.currentStepIndex = this.steps.length - 1;
    } else {
      const movedForward = index - this.currentStepIndex >= 0;
      if (movedForward) {
        // if the step was contains no error or it has not "hasError" field it steps into
        if (!this.steps[this.currentStepIndex].hasError?.()) {
          this.currentStepIndex = index;
          this.stepChange.emit(this.steps[this.currentStepIndex].key);
        }
      } else {
        this.currentStepIndex = index;
        this.stepChange.emit(this.steps[this.currentStepIndex].key);
      }
    }
    this.steps[this.currentStepIndex].hasMet = true;
  }

  /**
   * it gets called when submit button is clicked
   * it will close the modal with result
   */
  ok(): void {
    if (!this.steps[this.currentStepIndex].hasError?.()) {
      this.submitted.emit(this.steps[this.currentStepIndex]);
    }
  }

  /**
   * it gets called when close button is clicked
   * it will close the modal without result (dismiss)
   */
  close(): void {
    this.canceled.emit();
  }
}
