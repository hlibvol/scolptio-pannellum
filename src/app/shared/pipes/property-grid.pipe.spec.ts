import { PropertyGridPipe } from './property-grid.pipe';
import { PropertyOwnerPipe } from './property-owner.pipe';

describe('OrderPropertyByPipe', () => {
  it('create an instance', () => {
    const pipe = new PropertyGridPipe(new PropertyOwnerPipe);
    expect(pipe).toBeTruthy();
  });
});
