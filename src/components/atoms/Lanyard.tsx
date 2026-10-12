import * as React from 'react';

export interface LanyardProps {
  /** Distance from the pivot (top of the strap) to the top edge of the card, in px. */
  length: number;
  /** Distance from the top edge of the card to the centre of the punched hole, in px. */
  holeY: number;
}

export const STRAP_WIDTH = 16;

/**
 * Woven fabric strap that hangs from the pivot and passes through the card's hole, looping over the top
 * edge of the grommet. It fades out at the top (it continues out of view), casts a soft shadow onto the
 * card and is drawn above the card faces so it reads the same from the front and the back.
 */
const Lanyard: React.FC<LanyardProps> = ({ length, holeY }) => {
  const reach = length + holeY + 3;

  return (
    <>
      <span
        aria-hidden="true"
        className="lanyard-shadow pointer-events-none absolute left-1/2"
        style={{ top: length, height: holeY + 6, width: STRAP_WIDTH, marginLeft: -STRAP_WIDTH / 2 + 4 }}
      />
      <span
        aria-hidden="true"
        data-lanyard="strap"
        className="lanyard-strap pointer-events-none absolute left-1/2 top-0"
        style={{ height: reach, width: STRAP_WIDTH, marginLeft: -STRAP_WIDTH / 2 }}
      />
    </>
  );
};

export default Lanyard;
