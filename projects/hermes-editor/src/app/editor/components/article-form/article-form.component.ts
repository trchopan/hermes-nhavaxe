import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";
import { QuillEditorComponent } from "ngx-quill";
import { IProfile } from "@editor/app/auth/models/profile.model";
import { IArticle } from "@editor/app/editor/models/article.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "article-form",
  templateUrl: "./article-form.component.html",
  styleUrls: ["./article-form.component.scss"]
})
export class ArticleFormComponent implements OnDestroy, AfterViewInit {
  @Input("profile")
  set profileSetter(profile: IProfile) {
    var creatorAvatar = this.form.controls.creatorAvatar;
    !creatorAvatar.value ? creatorAvatar.setValue(profile.avatar) : null;
    var creatorName = this.form.controls.creatorName;
    !creatorName.value ? creatorName.setValue(profile.fullname) : null;
  }
  @Input("creatorId")
  set creatorIdSetter(id: string) {
    var creatorId = this.form.controls.creatorId;
    !creatorId.value ? creatorId.setValue(id) : null;
  }
  @Input("article")
  set articleSetter(article: IArticle) {
    this.articlePublishAt = article.publishAt;
    Object.keys(this.form.controls).forEach(key => {
      if (article[key]) {
        this.form.get(key).setValue(article[key]);
      }
    });
  }
  @Output() onSubmit = new EventEmitter();

  ngUnsub = new Subject();
  form: FormGroup;
  show: boolean = true;
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

  constructor(private fb: FormBuilder, private dom: DomSanitizer) {
    this.form = this.fb.group({
      id: [""],
      coverImg: ["", Validators.required],
      title: ["", Validators.required],
      sapo: ["", Validators.required],
      video: [""],
      body: ["", Validators.required],
      style: ["article", Validators.required],
      creatorName: [""],
      creatorAvatar: [""],
      creatorId: [""],
      publisher: ["", Validators.required],
      reference: ["", Validators.required],
      status: ["draft"],
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
  }

  ngAfterViewInit() {
    this.setStyleClass(this.form.controls.style.value);
    this.form.controls.style.valueChanges
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(value => this.setStyleClass(value));
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
    var reference = this.form.controls.reference.value;
    var publisher = this.form.controls.publisher.value;
    var video = this.form.controls.video.value;
    this.form.controls.reference.setValue(this.toTitleCase(reference.trim()));
    this.form.controls.publisher.setValue(this.toTitleCase(publisher.trim()));
    this.form.controls.video.setValue(this.youtube_parser(video));

    console.log("Submit article", this.form.value);
    this.onSubmit.emit(this.form.value);
    this.form.reset();
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
