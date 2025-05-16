import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsPanelComponent } from './active-jobs-panel.component';

describe('ActiveJobsPanelComponent', () => {
  let component: JobsPanelComponent;
  let fixture: ComponentFixture<JobsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
