// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { findRecordByFilter, getMinifiedRecords, table } from '../../lib/airtable';
import { CoffeeStore } from '../../types/coffeeStore';
import { getErrorMessage } from '../../utils/helper-functions';

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoffeeStore[] | ErrorResponse>
) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;

      if (id !== null && id !== '') {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = (record.voting) ? record.voting + 1 : 1;

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
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
      res.json({ message: `There has been an error upvoting the coffee store, ${message}` });
    }
  }
};
