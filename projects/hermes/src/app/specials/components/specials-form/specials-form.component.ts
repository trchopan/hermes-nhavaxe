import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import {
  switchMap,
  distinctUntilChanged,
  debounceTime,
  map
} from "rxjs/operators";
import { ISpecials } from "@app/app/specials/models/specials.model";
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
    specials && this.form.setValue(specials);
  }
  @Output()
  onSubmit = new EventEmitter();

  form: FormGroup;
  subForm: FormGroup;

  previewMainOne$: Observable<IArticle>;
  previewMainTwo$: Observable<IArticle>;
  previewSubOne$: Observable<IArticle>;
  previewSubTwo$: Observable<IArticle>;
  previewSubThree$: Observable<IArticle>;
  previewSubFour$: Observable<IArticle>;
  previewSubFive$: Observable<IArticle>;
  previewSubSix$: Observable<IArticle>;
  previewSubSeven$: Observable<IArticle>;

  constructor(private fb: FormBuilder, private articles: ArticlesService) {
    this.form = this.fb.group({
      title: ["", Validators.required],
      mainOne: ["", Validators.required],
      mainTwo: ["", Validators.required],
      subOne: [""],
      subTwo: [""],
      subThree: [""],
      subFour: [""],
      subFive: [""],
      subSix: [""],
      subSeven: [""]
    });
  }

  ngOnInit() {
    this.previewMainOne$ = this.form.controls.mainOne.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.mainOne.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewMainTwo$ = this.form.controls.mainTwo.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.mainTwo.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubOne$ = this.form.controls.subOne.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subOne.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubTwo$ = this.form.controls.subTwo.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subTwo.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubThree$ = this.form.controls.subThree.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subThree.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubFour$ = this.form.controls.subFour.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subFour.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubFive$ = this.form.controls.subFive.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subFive.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubSix$ = this.form.controls.subSix.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subSix.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
    this.previewSubSeven$ = this.form.controls.subSeven.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const id = this.nhavaxeLinkParser(value) || value;
        this.form.controls.subSeven.setValue(id);
        return this.articles.getArticleData(id);
      })
    );
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
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
