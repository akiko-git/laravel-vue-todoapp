/*
*status code
*/

export const OK = 200;
export const CREATED = 201;
export const NOT_FOUND = 404;
//認証不可
export const UNAUTHORIZED = 401;
//認証切れ
export const CSRF_UNAUTHORIZED = 419;
//バリデーションエラー
export const UNPROCESSABLE_ENTITY = 422;
//システムエラー
export const INTERNAL_SERVER_ERROR = 500;
