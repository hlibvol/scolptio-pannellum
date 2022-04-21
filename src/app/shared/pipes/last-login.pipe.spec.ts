import { DatePipe } from '@angular/common';
import { LastLoginPipe } from './last-login.pipe';

describe('LastLoginPipe', () => {
  it('create an instance', () => {
    const pipe = new LastLoginPipe(new DatePipe('en-US'));
    expect(pipe).toBeTruthy();
  });
});
