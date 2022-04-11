// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { findRecordByFilter } from '../../lib/airtable';
import { CoffeeStore } from '../../types/coffeeStore';
import { getErrorMessage } from '../../utils/helper-functions';

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoffeeStore[] | ErrorResponse>
) {
  const { id } = req.query;

  try {
    if (id !== null && id !== '') {
      const records = await findRecordByFilter(id.toString());

      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: `The coffee store could not be found for id: ${id}` });
      }
    } else {
      res.status(400);
      res.json({
        message: 'The id of the coffee store is missing from the request',
      });
    }
  } catch (error) {
    const message = getErrorMessage(error);
    res.status(500);
    res.json({ message: `Something went wrong while trying to get a coffee store by id, ${message}` });
  }
}
