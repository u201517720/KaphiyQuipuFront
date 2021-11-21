import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcadosacosEditComponent } from './marcadosacos-edit.component';

describe('MarcadosacosEditComponent', () => {
  let component: MarcadosacosEditComponent;
  let fixture: ComponentFixture<MarcadosacosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcadosacosEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcadosacosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
