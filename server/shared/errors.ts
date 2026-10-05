export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}
export function requireRecord<T>(value: T, message = 'Record not found'): NonNullable<T> {
  if (!value) throw new ApiError(404, message)
  return value as NonNullable<T>
}
