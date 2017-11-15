import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreetingDetailComponent } from './greeting-detail.component';

describe('GreetingDetailComponent', () => {
  let component: GreetingDetailComponent;
  let fixture: ComponentFixture<GreetingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreetingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
