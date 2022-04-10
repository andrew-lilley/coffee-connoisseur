// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { CoffeeStore } from '../../types/coffeeStore';

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoffeeStore[] | ErrorResponse>
) {
  try {
    // Get the query params and make sure that they have the right type.
    let newLatLong, newLimit;
    const { latLong, limit } = req.query;
    if (latLong) {
      newLatLong = latLong.toString();
    }
    if (limit) {
      newLimit = Number(limit);
    }

    const response = await fetchCoffeeStores(newLatLong, newLimit);

    res.status(200);
    res.json(response);
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
      message: `There has been an issue getting the coffee stores by your location, ${message}`,
    });
  }
}
