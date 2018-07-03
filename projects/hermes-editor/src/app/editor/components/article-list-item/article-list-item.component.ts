import { Component, Input } from '@angular/core';
import { IArticle } from '@editor/app/editor/models/article.model';

@Component({
  selector: 'article-list-item',
  templateUrl: './article-list-item.component.html',
  styleUrls: ['./article-list-item.component.scss']
})
export class ArticleListItemComponent {
  @Input() article: IArticle
  now = Date.now()
}
