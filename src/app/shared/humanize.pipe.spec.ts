import { HumanizePipe } from './humanize.pipe';

describe('HumanizePipe', () => {
  let pipe: HumanizePipe;
  beforeEach(() => {
    pipe = new HumanizePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('makes strings easier to read for people', () => {
    expect(pipe.transform('HardToRead')).toEqual('Hard to Read');
  });

  it('does nothing if enabled is false', () => {
    expect(pipe.transform('HardToRead', false)).toEqual('HardToRead');
  });
});
