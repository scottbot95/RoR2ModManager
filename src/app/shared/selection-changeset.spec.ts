import { SelectionChangesetModel } from './selection-changeset';

interface FakeData {
  data: number;
}

const INITIAL_VALUES: FakeData[] = [
  { data: 1 },
  { data: 2 },
  { data: 3 },
  { data: 4 }
];
const ADDED_VALUES: FakeData[] = [{ data: 5 }, { data: 6 }];
const REMOVED_VALUES = INITIAL_VALUES.slice(0, 2);

describe('SelectionChangesetModel', () => {
  let selection: SelectionChangesetModel<FakeData>;

  beforeEach(() => {
    selection = new SelectionChangesetModel(true, INITIAL_VALUES);

    selection.select(...ADDED_VALUES);
    selection.deselect(...REMOVED_VALUES);
  });

  it('should create an instance', () => {
    expect(selection).toBeTruthy();
  });

  it('should calculate added changes', () => {
    expect(selection.getChangeset().added).toEqual(new Set(ADDED_VALUES));
  });

  it('should calculate removed changes', () => {
    expect(selection.getChangeset().removed).toEqual(new Set(REMOVED_VALUES));
  });

  it('to be dirty', () => {
    expect(selection.isDirty()).toBeTruthy();
  });

  it('to be clean after reset', () => {
    selection.reset();
    expect(selection.isDirty()).toBeFalsy();
  });
});
