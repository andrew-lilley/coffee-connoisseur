import Airtable, { FieldSet, Records, Record } from 'airtable';
import { CoffeeStore } from '../types/coffeeStore';

const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
    ? process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
    : ''
);

const table = base('coffee-stores');

const getMinifiedRecord = (record: Record<FieldSet>) => {
  return {
    // recordId: record.id,
    ...record.fields,
  } as CoffeeStore;
};

const getMinifiedRecords = (records: Records<FieldSet>) => {
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id: string) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
