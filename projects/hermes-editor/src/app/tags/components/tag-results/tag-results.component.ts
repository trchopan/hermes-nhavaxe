import { Component, Input } from '@angular/core';
import { IArticleTags } from '@editor/app/tags/models/article-tags.model';

@Component({
  selector: 'hm-editor-tag-results',
  templateUrl: './tag-results.component.html',
  styleUrls: ['./tag-results.component.scss']
})
export class TagResultsComponent {
  @Input() list: IArticleTags[]

  constructor() { }

}
