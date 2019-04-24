import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

export interface Changeset<T> {
  added: Set<T>;
  removed: Set<T>;
}

export class SelectionChangesetModel<T> extends SelectionModel<T> {
  private _initialValues: Set<T>;

  constructor(multiple: boolean, initialValues: Observable<T[]> | T[]) {
    if (Array.isArray(initialValues)) {
      super(multiple, initialValues);
      this._initialValues = new Set<T>(initialValues);
    } else {
      super(multiple);
      this._initialValues = new Set<T>();
      initialValues.subscribe(values => {
        this._initialValues = new Set(values);
      });
    }
  }

  public getChangeset(): Changeset<T> {
    const removed = new Set<T>(this._initialValues);
    const added = new Set<T>();

    this.selected.forEach(s => {
      if (this._initialValues.has(s)) {
        removed.delete(s);
      } else {
        added.add(s);
      }
    });

    return { added, removed };
  }

  public isDirty(): boolean {
    const changes = this.getChangeset();
    return changes.added.size !== 0 || changes.removed.size !== 0;
  }
}
