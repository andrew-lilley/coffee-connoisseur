// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';
import { CoffeeStore } from '../../types/coffeeStore';

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoffeeStore[] | ErrorResponse>
) {
  if (req.method === 'POST') {
    // Get the request data to post.
    const { id, name, neighbourhood, address, voting, imgUrl } = req.body;

    try {
      if (id !== null && id !== '') {
        const records = await findRecordByFilter(id);

        if (records && records.length > 0) {
          res.status(200);
          res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: 'The coffee store name is missing from the request' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'The id of coffee store is missing from the request' });
      }
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      console.error(error);

      res.status(500);
      res.json({
        message: `There has been an issue trying to create or find a coffee store, ${message}`,
      });
    }
  } else {
    res.status(500);
    res.json({
      message: `This API endpoint expects a POST request, the method used was ${req.method}`,
    });
  }
}