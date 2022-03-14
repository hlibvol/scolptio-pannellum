import { PropertyOwnerPipe } from "./property-owner.pipe";


describe('PropertyOwnerPipe', () => {
  it('create an instance', () => {
    const pipe = new PropertyOwnerPipe();
    expect(pipe).toBeTruthy();
  });
});
