import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteMachineService } from '@phoenix-front-apps/wina-services';
import { RemoteMachinesSelectorComponent } from './remote-machines-selector.component';
import {
  FilterRemoteMachines,
  ListServerRequest,
  RemoteMachineExtended,
} from '@phoenix-front-apps/models';

describe('RemoteMachinesSelectorComponent', () => {
  let component: RemoteMachinesSelectorComponent;
  let fixture: ComponentFixture<RemoteMachinesSelectorComponent>;
  let remoteMachineService: RemoteMachineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoteMachinesSelectorComponent],
      providers: [
        {
          provide: RemoteMachineService,
          useValue: {
            getRemoteMachines: jest.fn(() => of({ results: [] })),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    remoteMachineService = TestBed.inject(RemoteMachineService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteMachinesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit test 1: initialFilter is not null', () => {
    component.getRemoteMachinesList = jest.fn();
    component.initialFilter = new FilterRemoteMachines();
    component.initialFilter.operatingSystems = ['windows'];
    component.ngOnInit();
    expect(component._filter).toEqual(component.initialFilter);
    expect(component.getRemoteMachinesList).toHaveBeenCalled();
    expect(component._gridOptions.rowSelectable).toBeTruthy();
    expect(component._gridOptions.showFilterButton).toBeFalsy();
  });

  it('ngOnInit test 2: initialFilter is null', () => {
    component.getRemoteMachinesList = jest.fn();
    component.initialFilter = null;
    component.ngOnInit();
    expect(component._filter).not.toEqual(component.initialFilter);
    expect(component.getRemoteMachinesList).toHaveBeenCalled();
    expect(component._gridOptions.rowSelectable).toBeTruthy();
    expect(component._gridOptions.showFilterButton).toBeFalsy();
  });

  it('getRemoteMachinesList test: should either replace or append received list', () => {
    const firstRemoteMachine = {
      ...new RemoteMachineExtended(),
      id: 1,
    };
    const secondRemoteMachine = {
      ...new RemoteMachineExtended(),
      id: 2,
    };
    remoteMachineService.getRemoteMachines = jest.fn((f, req: ListServerRequest) => {
      if (req.pageNumber === 1) {
        return of({
          results: [firstRemoteMachine],
          filterCount: 20,
          totalCount: 20,
        });
      } else {
        return of({
          results: [secondRemoteMachine],
          filterCount: 20,
          totalCount: 20,
        });
      }
    });

    // test 1: first page is gotten:
    component.listServerRequest = new ListServerRequest(1, 1);
    component.getRemoteMachinesList();
    expect(component._remoteMachinesList).toEqual([firstRemoteMachine]);

    // test 2: second page is gotten:
    component.listServerRequest = new ListServerRequest(2, 1);
    component.getRemoteMachinesList();
    expect(component._remoteMachinesList).toEqual([firstRemoteMachine, secondRemoteMachine]);

    // test 3: first page is gotten again:
    component.listServerRequest = new ListServerRequest(1, 1);
    component.getRemoteMachinesList();
    expect(component._remoteMachinesList).toEqual([firstRemoteMachine]);
  });

  it('_changeSelectedRemotes test 1: isSingularSelection is true', () => {
    component.isSingularSelection = true;
    const firstRemoteMachine = {
      ...new RemoteMachineExtended(),
      id: 1,
    };
    const secondRemoteMachine = {
      ...new RemoteMachineExtended(),
      id: 2,
    };

    // test 1: new item is selected
    component._changeSelectedRemotes([firstRemoteMachine, secondRemoteMachine]);
    // in isSingularSelection, only the latest selected item would be considered.
    expect(component._selectedRemotes).toEqual([secondRemoteMachine]);

    // test 2: all items become unselected
    component._changeSelectedRemotes([]);
    expect(component._selectedRemotes).toEqual([]);
  });

  it('_changeSelectedRemotes test 2: isSingularSelection is false', () => {
    component.isSingularSelection = false;
    const firstRemoteMachine = {
      ...new RemoteMachineExtended(),
      id: 1,
    };
    const secondRemoteMachine = {
      ...new RemoteMachineExtended(),
      id: 2,
    };

    // test 1: new item is selected
    component._changeSelectedRemotes([firstRemoteMachine, secondRemoteMachine]);
    expect(component._selectedRemotes).toEqual([firstRemoteMachine, secondRemoteMachine]);

    // test 2: all items become unselected
    component._changeSelectedRemotes([]);
    expect(component._selectedRemotes).toEqual([]);
  });

  it('toggleFilter test 1: initialFilter is not null', () => {
    component._serverSideListHelper.onAdvancedFilterChange = jest.fn();
    component.initialFilter = new FilterRemoteMachines();
    component.initialFilter.operatingSystems = ['windows'];
    component._showFilters = false;
    component.toggleFilter();
    expect(component._showFilters).toBeTruthy();
    expect(component._serverSideListHelper.onAdvancedFilterChange).toHaveBeenCalled();
    expect(component._filter).toEqual(component.initialFilter);
  });

  it('toggleFilter test 2: initialFilter is null', () => {
    component._serverSideListHelper.onAdvancedFilterChange = jest.fn();
    component.initialFilter = null;
    component._showFilters = true;
    component.toggleFilter();
    expect(component._showFilters).toBeFalsy();
    expect(component._serverSideListHelper.onAdvancedFilterChange).toHaveBeenCalled();
    expect(component._filter).not.toEqual(component.initialFilter);
  });

  it('_onFilter test', () => {
    component._serverSideListHelper.onAdvancedFilterChange = jest.fn();
    const newFilter = new FilterRemoteMachines();
    newFilter.operatingSystems = ['windows'];
    component._onFilter(newFilter);
    expect(component._serverSideListHelper.onAdvancedFilterChange).toHaveBeenCalled();
    expect(component._filter).toEqual(newFilter);
  });
});
