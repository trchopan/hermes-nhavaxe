import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Observable, of } from "rxjs";
import {
  switchMap,
  distinctUntilChanged,
  debounceTime,
  map,
  tap
} from "rxjs/operators";
import {
  ISpecials,
  SpecialsAmount
} from "@app/app/specials/models/specials.model";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { IArticle } from "@app/app/editor/models/article.model";

@Component({
  selector: "hm-specials-form",
  templateUrl: "./specials-form.component.html",
  styleUrls: ["./specials-form.component.scss"]
})
export class SpecialsFormComponent implements OnInit {
  @Input("specials")
  set specialsSetter(specials: ISpecials) {
    if (!specials) return;

    this.form.controls.title.setValue(specials.title);
    Object.keys(this.form.value)
      .filter(x => x !== "title")
      .forEach(
        key =>
          specials.articles[key] &&
          this.form.controls[key].setValue(specials.articles[key].id)
      );
  }
  @Output()
  onSubmit = new EventEmitter();

  form: FormGroup;
  previewArticles$: Observable<IArticle>[];
  mainArticles$: Observable<IArticle>[];
  subArticles$: Observable<IArticle>[];
  controls: FormControl[];
  articlesData: IArticle[];

  constructor(private fb: FormBuilder, private articles: ArticlesService) {
    this.controls = Array.apply(null, { length: SpecialsAmount }).map(
      () => new FormControl()
    );
    this.articlesData = [];
    this.form = this.fb.group({
      title: ["", Validators.required],
      ...this.controls
    });
  }

  ngOnInit() {
    this.previewArticles$ = Object.keys(this.form.value)
      .filter(x => x !== "title")
      .map(key =>
        this.form.controls[key].valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(value => {
            const id = this.nhavaxeLinkParser(value) || value;
            this.form.controls[key].setValue(id);
            return this.articles.getArticleData(id);
          }),
          tap(article => {
            this.articlesData[key] = article;
          })
        )
      );
    this.mainArticles$ = this.previewArticles$.slice(0, 2);
    this.subArticles$ = this.previewArticles$.slice(2);
  }

  submit() {
    if (this.form.valid) {
      console.log({
        title: this.form.value.title,
        articles: this.articlesData
      });
      this.onSubmit.emit({
        title: this.form.value.title,
        articles: this.articlesData
      });
    }
  }

  nhavaxeLinkParser(url): string {
    let regExp = /^.*(nhavaxe.vn\/article\/)(.*)/;
    let match = url.match(regExp);
    if (match && match[2].length > 0) {
      return match[2];
    } else {
      return null;
    }
  }
}
