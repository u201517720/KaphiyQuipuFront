import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcadosacosComponent } from './marcadosacos.component';

describe('MarcadosacosComponent', () => {
  let component: MarcadosacosComponent;
  let fixture: ComponentFixture<MarcadosacosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcadosacosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcadosacosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
