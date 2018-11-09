import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { LayoutService } from "@app/app/core/services/layout.service";
import { map, catchError } from "rxjs/operators";
import { parseVideo, IVideo, IVideoData } from "../models/videos.model";
import { UserService } from "@app/app/auth/services/user.service";
import { stringify } from "@angular/compiler/src/util";

const CacheCollection = "cache";
const VideosDoc = "videos";

@Injectable()
export class VideosService {
  private className = "[Videos]";

  error$: BehaviorSubject<any>;
  videoData$: Observable<IVideoData>;

  constructor(
    private afFirestore: AngularFirestore,
    private layout: LayoutService,
    private user: UserService
  ) {
    this.error$ = new BehaviorSubject(null);

    this.videoData$ = this.afFirestore
      .collection(CacheCollection)
      .doc(VideosDoc)
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          if (!snapshot.payload.exists) return null;
          const data = snapshot.payload.data() as any;
          return {
            creatorId: data.creatorId,
            creatorName: data.creatorName,
            publishAt: data.publishAt,
            videos: data.videos.map(video => parseVideo(video))
          };
        }),
        catchError(error => {
          this.error$.next(error);
          return of(null);
        })
      );
  }

  async update(videos: IVideo[]) {
    this.layout.loading$.next(true);
    console.log(this.className + "updating cache", videos);
    try {
      await this.afFirestore
        .collection(CacheCollection)
        .doc(VideosDoc)
        .set({
          videos,
          creatorId: this.user.authData.id,
          creatorName: this.user.profile.fullname,
          publishAt: Date.now()
        });
      this.layout.handleSuccess(this.className, null);
    } catch (error) {
      this.layout.handleError(this.className, "update", error);
    }
  }
}
