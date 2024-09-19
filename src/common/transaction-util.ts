import { DataSource, QueryRunner } from "typeorm";

export const withTransaction = async <T>(dataSource: DataSource, operation: (qr: QueryRunner) => Promise<T>): Promise<T> => {
  const qr = dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const result = await operation(qr);
    await qr.commitTransaction();
    return result;
  } catch (error) {
    await qr.rollbackTransaction();
    throw error;
  } finally {
    await qr.release();
  }
};