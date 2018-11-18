import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IArticle } from "@app/app/editor/models/article.model";
import { Observable } from "rxjs";
import {
  switchMap,
  map,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";
import { ArticlesService } from "@app/app/editor/services/articles.service";

@Component({
  selector: "hm-tags-id",
  templateUrl: "./tags-id.component.html",
  styleUrls: ["./tags-id.component.scss"]
})
export class TagsIdComponent implements OnInit {
  form: FormGroup;
  result$: Observable<IArticle[]>;

  constructor(private fb: FormBuilder, private articles: ArticlesService) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: ["", Validators.required]
    });

    this.result$ = this.form.controls.id.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(id => this.articles.getArticleData(id)),
      map(data => data ? [data] : [])
    );
  }
}
