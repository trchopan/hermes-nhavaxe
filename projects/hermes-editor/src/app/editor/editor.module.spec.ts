import { EditorModule } from '@editor/app/editor/editor.module';

describe('EditorModule', () => {
  let editorModule: EditorModule;

  beforeEach(() => {
    editorModule = new EditorModule();
  });

  it('should create an instance', () => {
    expect(editorModule).toBeTruthy();
  });
});
