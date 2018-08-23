import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { map, tap, switchMap, startWith } from "rxjs/operators";
import { AngularFirestore } from "angularfire2/firestore";
import { MatTableDataSource, MatSort, MatSnackBar } from "@angular/material";
import { IFieldDoc, IFieldData } from "@admin/app/fields.models";

const initialFieldDoc: IFieldDoc = {
  fieldData: []
};

@Component({
  selector: "hm-admin-fields-edit",
  templateUrl: "./fields-edit.component.html",
  styleUrls: ["./fields-edit.component.scss"]
})
export class FieldsEditComponent implements OnInit, OnDestroy {
  ngUnsub = new Subject();

  collectionForm: FormGroup;
  fieldForm: FormGroup;
  collections: Array<string> = ["houseprices", "carprices"];

  displayedColumns: string[] = ["index", "id", "name"];
  collectionFields$: Observable<MatTableDataSource<IFieldData>>;

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private afFirestore: AngularFirestore,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.collectionForm = this.fb.group({
      name: [this.collections[0]]
    });

    this.fieldForm = this.fb.group({
      index: [0, Validators.required],
      id: ["", Validators.required],
      name: ["", Validators.required]
    });

    this.collectionFields$ = this.collectionForm.valueChanges.pipe(
      startWith({ name: this.collections[0] }),
      switchMap(value => {
        return this.afFirestore
          .collection(value.name)
          .doc<IFieldDoc>("_fields")
          .snapshotChanges()
          .pipe(
            map(snapshot => {
              const data = snapshot.payload.data();
              let fieldData = data.fieldData
                ? data.fieldData
                : initialFieldDoc.fieldData;
              fieldData = fieldData.map((data, i) => ({ index: i, ...data }));
              return new MatTableDataSource(fieldData);
            }),
            tap(datasource => (datasource.sort = this.sort))
          );
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  selectField(field) {
    this.fieldForm.setValue(field);
  }

  updateField(currentFields, remove?) {
    const index = this.fieldForm.value.index;
    let data = currentFields as IFieldData[];
    if (remove && this.fieldForm.value.index >= 0) {
      data = data.filter(x => x.index != index);
      this.updateFStore(data);
    }
    if (this.fieldForm.valid) {
      data = data.concat(this.fieldForm.value);
      this.updateFStore(data);
    }
  }

  private updateFStore(fieldData) {
    let newFields = fieldData;
    newFields.sort((a, b) => a.index - b.index);
    newFields = newFields.map((data, i) =>
      data.map(data => ({ ...data, name: data.name.trim(), index: i }))
    );

    this.afFirestore
      .collection(this.collectionForm.controls.name.value)
      .doc("_fields")
      .set({ fieldData: newFields })
      .then(() =>
        this.snackbar.open("Update success", null, { duration: 1000 })
      )
      .catch(error => {
        this.snackbar.open("Update error", null, { duration: 1000 });
        console.log("Update error", error);
      });

    this.fieldForm.reset();
  }
}
