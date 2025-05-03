import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CarIssueDetailsComponent } from './car-issue-details.component';

describe('CarIssueDetailsComponent', () => {
  let component: CarIssueDetailsComponent;
  let fixture: ComponentFixture<CarIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarIssueDetailsComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CarIssueDetailsComponent);
    component = fixture.componentInstance;
    component.vehicleModel = { _id: 'vehicle123', name: 'Toyota Corolla' };
    component.userModel = { _id: 'user123', name: 'John Doe' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit jobCreated event on valid form submission', () => {
    spyOn(component.jobCreated, 'emit');
    component.issueForm.setValue({
      issueDescription: 'Engine making strange noise',
      urgency: 'high',
      preferredDate: '2025-05-01',
      additionalNotes: 'Happens when accelerating'
    });
    component.submitIssue();
    expect(component.jobCreated.emit).toHaveBeenCalledWith({
      jobName: 'Issue for Toyota Corolla',
      customer: 'user123',
      vehicle: 'vehicle123',
      issueDetails: {
        issueDescription: 'Engine making strange noise',
        urgency: 'high',
        preferredDate: '2025-05-01',
        additionalNotes: 'Happens when accelerating'
      }
    });
  });
});
