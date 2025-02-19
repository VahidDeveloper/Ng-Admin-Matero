import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteApplication } from '@phoenix-front-apps/models';
import { RemoteApplicationListGridComponent } from './remote-application-list-grid.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('RemoteApplicationListGridComponent', () => {
  let component: RemoteApplicationListGridComponent;
  let fixture: ComponentFixture<RemoteApplicationListGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoteApplicationListGridComponent],
      imports: [CorePipesModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteApplicationListGridComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test remove emit', () => {
    jest.spyOn(component.remove, 'emit');

    component.onRemove(0);
    expect(component.remove.emit).toHaveBeenCalledWith(0);
  });

  it('test edit emit', () => {
    jest.spyOn(component.edit, 'emit');

    component.onEdit(13);
    expect(component.edit.emit).toHaveBeenCalledWith(13);
  });

  it('test select (non-readonly)', () => {
    jest.spyOn(component.selected, 'emit');

    component.onSelect(new RemoteApplication());
    expect(component.selected.emit).not.toHaveBeenCalled();
  });

  it('test select (readonly)', () => {
    const selectedApplication = new RemoteApplication();
    (component as any).isReadonly = true;
    jest.spyOn(component.selected, 'emit');

    component.onSelect(selectedApplication);
    expect(component.selected.emit).toHaveBeenCalledWith(selectedApplication);
  });
});
