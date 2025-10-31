import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useSelector } from "metabase/lib/redux";
import { getLocation } from "metabase/selectors/routing";

export function useMetabotIdPath() {
  const location = useSelector(getLocation);
  const metabotId = Number(location?.pathname?.split("/").pop());
  return Number.isNaN(metabotId) ? null : metabotId;
}

// https://redux-toolkit.js.org/rtk-query/usage/error-handling
// https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
export const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError =>
  error instanceof Object && "status" in error && "data" in error;

type IFieldError =
  | string
  | {
      message: string;
    }
  | {
      errors: { [key: string]: any };
    };

const isFieldError = (error: unknown): error is IFieldError =>
  typeof error === "string" ||
  (error instanceof Object &&
    (("message" in error && typeof error.message === "string") ||
      ("errors" in error &&
        error.errors instanceof Object &&
        (("terms_of_service" in error.errors &&
          typeof error.errors.terms_of_service === "string") ||
          ("quantity" in error.errors &&
            typeof error.errors.quantity === "string")))));

export const handleFieldError = (error: unknown) => {
  if (!isFieldError(error)) {
    return;
  }

  if (typeof error === "string") {
    throw { data: { errors: { terms_of_service: error } } };
  }

  if ("message" in error) {
    throw { data: { errors: { terms_of_service: error.message } } };
  }

  if ("errors" in error) {
    throw { data: error };
  }
};
