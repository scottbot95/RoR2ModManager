import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigParserService } from '../services/config-parser.service';
import { MockConfigParserService } from '../../../core/services/mocks.spec';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ConfigParserService,
          useClass: MockConfigParserService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
