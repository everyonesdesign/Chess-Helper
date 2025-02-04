export const FILES = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
export const RANKS = [ '1', '2', '3', '4', '5', '6', '7', '8' ];

export const FIELDS: string[] = [];
FILES.forEach(file => {
  RANKS.forEach(rank => {
    FIELDS.push(file + rank);
  });
});

export const PROMOTION_PIECES = [ 'b', 'n', 'r', 'q', 'B', 'N', 'R', 'Q'];
export const PIECES = [ ...PROMOTION_PIECES, 'k', 'K' ];
