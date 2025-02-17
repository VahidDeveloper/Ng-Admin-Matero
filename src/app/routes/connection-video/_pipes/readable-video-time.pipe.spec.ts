import { ReadableVideoTimePipe } from './readable-video-time.pipe';

describe('ReadableVideoTimePipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableVideoTimePipe();
    expect(pipe).toBeTruthy();
  });

  it('test pipe"s functionality', () => {
    const pipe = new ReadableVideoTimePipe();
    expect(pipe.transform(0)).toEqual('00:00');
    expect(pipe.transform(60000)).toEqual('01:00');
    expect(pipe.transform(75000)).toEqual('01:15');
    expect(pipe.transform(3660000)).toEqual('01:01:00');
    expect(pipe.transform(3675000)).toEqual('01:01:15');
  });
});
