import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type { SerializedError } from "@reduxjs/toolkit";

export type TypedEndpointBuilder = EndpointBuilder<
    BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError | SerializedError
    >,
    string,
    "api"
>;
