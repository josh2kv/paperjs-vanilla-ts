import * as paper from 'paper';

declare module 'paper' {
  namespace paper {
    class Item {
      guide?: boolean;
    }
  }
}
