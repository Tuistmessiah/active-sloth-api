/**
 * * Endpoints
 */

export type GetDaysInCurrentMonth = ApiFunction<DayDTO[]>;
export type GetDaysInCurrentMonthRES = SuccessResponse<DayDTO[]>;

export type UpdateDay = ApiFunction<DayDTO>;
export type UpdateDayRES = SuccessResponse<DayDTO>;

export type CreateDay = ApiFunction<DayDTO>;
export type CreateDayRES = SuccessResponse<DayDTO>;

/**
 * * Data Transfer Objects
 */

export type Tag = 'work' | 'finance' | 'love' | 'family' | 'health' | 'personal' | 'wellbeing' | 'hobbies' | undefined;

export interface EntryDTO {
  text: string;
  tag?: Tag;
}

export interface DayDTO {
  id: string;
  date: string;
  title?: string;
  entries: EntryDTO[];
}

/**
 * * Response Structure
 */

interface BaseResponse {
  status: 'success' | 'error';
}

export interface SuccessResponse<T> extends BaseResponse {
  status: 'success';
  data: T;
}

interface ErrorResponse extends BaseResponse {
  status: 'error';
  errorCode: number;
  message: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
export type ApiFunction<T> = Promise<ApiResponse<T>>;
