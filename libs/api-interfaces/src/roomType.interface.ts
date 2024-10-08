export enum BedConfiguration {
  ONE_QUEEN = 'oneQueen',
  ONE_KING = 'oneKing',
  TWO_QUEENS = 'twoQueens',
  ONE_TWIN = 'oneTwin',
  TWO_TWINS = 'twoTwins',
}


export interface IRoomType {
  bedConfiguration: BedConfiguration;
  id: string;
  maxGuests: number;
  name: string;
  rate: number;
  squareFootage: number;
}
