import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";
import { QuillEditorComponent } from "ngx-quill";
import { IArticle } from "@editor/app/editor/models/article.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { UserService } from "@editor/app/auth/services/user.service";

@Component({
  selector: "article-form",
  templateUrl: "./article-form.component.html",
  styleUrls: ["./article-form.component.scss"]
})
export class ArticleFormComponent implements OnDestroy, AfterViewInit {
  @Input("article")
  set articleSetter(article: IArticle) {
    this.articlePublishAt = article.publishAt;
    Object.keys(this.form.controls).forEach(key => {
      if (article[key]) {
        this.form.get(key).setValue(article[key]);
      }
    });
    this.articles
      .getBodyData(article.id)
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(bodyData =>
        this.form.controls.bodyData.setValue(bodyData ? bodyData.body : "")
      );
  }
  @Output() onSubmit = new EventEmitter();

  ngUnsub = new Subject();
  form: FormGroup;
  articlePublishAt: number = Date.now();
  imgSrc: string;
  videoIframe: SafeHtml;
  quillClassName: string = "ql-editor";
  quillContent: string;
  quillFormats = [
    "bold",
    "italic",
    "underline",
    "header",
    "list",
    "align",
    "blockquote",
    "image"
  ];
  quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      ["blockquote"],
      [{ align: "center" }],
      [{ align: "right" }],
      [{ header: 2 }],
      [{ list: "bullet" }],
      ["clean"]
    ]
  };

  constructor(
    public articles: ArticlesService,
    public user: UserService,
    private fb: FormBuilder,
    private dom: DomSanitizer
  ) {
    this.form = this.fb.group({
      id: [""],
      coverImg: ["", Validators.required],
      title: ["", Validators.required],
      sapo: ["", Validators.required],
      video: [""],
      bodyData: ["", Validators.required],
      style: ["article", Validators.required],
      categoryId: ["", Validators.required],
      categoryName: ["", Validators.required],
      creatorId: [user.authData.id],
      creatorName: [user.profile.fullname],
      creatorAvatar: [user.profile.avatar],
      publisher: ["", Validators.required],
      reference: ["", Validators.required],
      status: ["draft", Validators.required],
      publishAt: [Date.now()],
      note: [""],
      tags: [""]
    });

    this.form.controls.coverImg.valueChanges
      .pipe(
        takeUntil(this.ngUnsub),
        distinctUntilChanged(),
        debounceTime(1000)
      )
      .subscribe(coverSrc => (this.imgSrc = coverSrc));

    this.form.controls.video.valueChanges
      .pipe(
        takeUntil(this.ngUnsub),
        distinctUntilChanged(),
        debounceTime(1000)
      )
      .subscribe(video => {
        let youtube = this.youtube_parser(video);
        if (youtube) {
          let html = `
          <iframe width="350" height="196"
            src="https://www.youtube.com/embed/${youtube}"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
          `;
          this.videoIframe = this.dom.bypassSecurityTrustHtml(html);
        }
        console.log("video is", youtube);
      });

    this.form.controls.categoryId.valueChanges
      .pipe(
        takeUntil(this.ngUnsub),
        distinctUntilChanged(),
        debounceTime(1000)
      )
      .subscribe(catId =>
        this.form.controls.categoryName.setValue(
          this.articles.categories$.value.find(cat => cat.id === catId).name
        )
      );
  }

  ngAfterViewInit() {
    this.setStyleClass(this.form.controls.style.value);
    this.form.controls.style.valueChanges
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(value => this.setStyleClass(value));
  }

  get status() {
    return this.form.get("status");
  }

  @ViewChild("quillEditor") quillEditorComp: QuillEditorComponent;

  // Add style class based on document style (article/picture)
  // Based on the customed style sheet for class .ql-editor
  setStyleClass(value: string) {
    let styleClass =
      value === "article"
        ? this.quillClassName + " article-style"
        : this.quillClassName + " picture-style";
    let container = this.quillEditorComp.quillEditor.container;
    container.childNodes[0].className = styleClass;
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  setPublishAt(date: Date) {
    this.form.controls.publishAt.setValue(date.getTime());
    this.form.controls.publishAt.markAsDirty();
  }

  submit() {
    let bodyData = this.form.controls.bodyData.value;

    let article = {
      ...this.form.value,
      bodyData: {
        body: bodyData,
        modifiedAt: Date.now(),
        modifiedBy: this.user.authData.id
      }
    };
    console.log("Submit article", article);
    this.form.valid && this.onSubmit.emit(article);
  }

  toTitleCase = (str: string) =>
    str.replace(
      /\w\S*/g,
      (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
}
