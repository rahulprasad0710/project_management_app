type CustomErrorShape = {
  data: {
    message: string;
    devMessage: string;
    type: string;
    success: boolean;
    data: null | unknown;
  };
  status?: number;
};

type CustomError = {
  type?: string;
  status?: number;
  message: string;
  data: null;
  success: boolean;
};

export const getCustomerError = (err: unknown): CustomError => {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof (err as CustomErrorShape).data === "object"
  ) {
    const errorData = (err as CustomErrorShape).data;
    return {
      type: errorData.type,
      message: errorData.message,
      data: null,
      success: errorData.success,
    };
  }

  return {
    message: "Something went wrong",
    data: null,
    type: "INTERNAL_SERVER_ERROR",
    status: 500,
    success: false,
  };
};
