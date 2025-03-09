// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v3.12.4
// source: src/protos/multipay.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";

export const protobufPackage = "multipay";

/** Create new payment */
export interface CreatePaymentRequest {
  coin: string;
  amount: string;
  clientId: string;
}

export interface CreatePaymentResult {
  coin: string;
  amount: string;
  expiration: string;
  paymentId: string;
  clientId: string;
  address: string;
}

/** Verify payment */
export interface VerifyPaymentRequest {
  paymentId: string;
}

export interface VerifyPaymentResult {
  coin: string;
  amount: string;
  expiration: string;
  paymentId: string;
  clientId: string;
  address: string;
  isPaid: boolean;
  isConfirmed: boolean;
}

function createBaseCreatePaymentRequest(): CreatePaymentRequest {
  return { coin: "", amount: "", clientId: "" };
}

export const CreatePaymentRequest: MessageFns<CreatePaymentRequest> = {
  encode(message: CreatePaymentRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.coin !== "") {
      writer.uint32(10).string(message.coin);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.clientId !== "") {
      writer.uint32(26).string(message.clientId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CreatePaymentRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePaymentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.coin = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.clientId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreatePaymentRequest {
    return {
      coin: isSet(object.coin) ? globalThis.String(object.coin) : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
      clientId: isSet(object.clientId) ? globalThis.String(object.clientId) : "",
    };
  },

  toJSON(message: CreatePaymentRequest): unknown {
    const obj: any = {};
    if (message.coin !== "") {
      obj.coin = message.coin;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    if (message.clientId !== "") {
      obj.clientId = message.clientId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePaymentRequest>, I>>(base?: I): CreatePaymentRequest {
    return CreatePaymentRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreatePaymentRequest>, I>>(object: I): CreatePaymentRequest {
    const message = createBaseCreatePaymentRequest();
    message.coin = object.coin ?? "";
    message.amount = object.amount ?? "";
    message.clientId = object.clientId ?? "";
    return message;
  },
};

function createBaseCreatePaymentResult(): CreatePaymentResult {
  return { coin: "", amount: "", expiration: "", paymentId: "", clientId: "", address: "" };
}

export const CreatePaymentResult: MessageFns<CreatePaymentResult> = {
  encode(message: CreatePaymentResult, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.coin !== "") {
      writer.uint32(10).string(message.coin);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.expiration !== "") {
      writer.uint32(26).string(message.expiration);
    }
    if (message.paymentId !== "") {
      writer.uint32(34).string(message.paymentId);
    }
    if (message.clientId !== "") {
      writer.uint32(42).string(message.clientId);
    }
    if (message.address !== "") {
      writer.uint32(50).string(message.address);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CreatePaymentResult {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePaymentResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.coin = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.expiration = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.paymentId = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.clientId = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.address = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreatePaymentResult {
    return {
      coin: isSet(object.coin) ? globalThis.String(object.coin) : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
      expiration: isSet(object.expiration) ? globalThis.String(object.expiration) : "",
      paymentId: isSet(object.paymentId) ? globalThis.String(object.paymentId) : "",
      clientId: isSet(object.clientId) ? globalThis.String(object.clientId) : "",
      address: isSet(object.address) ? globalThis.String(object.address) : "",
    };
  },

  toJSON(message: CreatePaymentResult): unknown {
    const obj: any = {};
    if (message.coin !== "") {
      obj.coin = message.coin;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    if (message.expiration !== "") {
      obj.expiration = message.expiration;
    }
    if (message.paymentId !== "") {
      obj.paymentId = message.paymentId;
    }
    if (message.clientId !== "") {
      obj.clientId = message.clientId;
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePaymentResult>, I>>(base?: I): CreatePaymentResult {
    return CreatePaymentResult.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreatePaymentResult>, I>>(object: I): CreatePaymentResult {
    const message = createBaseCreatePaymentResult();
    message.coin = object.coin ?? "";
    message.amount = object.amount ?? "";
    message.expiration = object.expiration ?? "";
    message.paymentId = object.paymentId ?? "";
    message.clientId = object.clientId ?? "";
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseVerifyPaymentRequest(): VerifyPaymentRequest {
  return { paymentId: "" };
}

export const VerifyPaymentRequest: MessageFns<VerifyPaymentRequest> = {
  encode(message: VerifyPaymentRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.paymentId !== "") {
      writer.uint32(10).string(message.paymentId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VerifyPaymentRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifyPaymentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.paymentId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerifyPaymentRequest {
    return { paymentId: isSet(object.paymentId) ? globalThis.String(object.paymentId) : "" };
  },

  toJSON(message: VerifyPaymentRequest): unknown {
    const obj: any = {};
    if (message.paymentId !== "") {
      obj.paymentId = message.paymentId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifyPaymentRequest>, I>>(base?: I): VerifyPaymentRequest {
    return VerifyPaymentRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifyPaymentRequest>, I>>(object: I): VerifyPaymentRequest {
    const message = createBaseVerifyPaymentRequest();
    message.paymentId = object.paymentId ?? "";
    return message;
  },
};

function createBaseVerifyPaymentResult(): VerifyPaymentResult {
  return {
    coin: "",
    amount: "",
    expiration: "",
    paymentId: "",
    clientId: "",
    address: "",
    isPaid: false,
    isConfirmed: false,
  };
}

export const VerifyPaymentResult: MessageFns<VerifyPaymentResult> = {
  encode(message: VerifyPaymentResult, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.coin !== "") {
      writer.uint32(10).string(message.coin);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.expiration !== "") {
      writer.uint32(26).string(message.expiration);
    }
    if (message.paymentId !== "") {
      writer.uint32(34).string(message.paymentId);
    }
    if (message.clientId !== "") {
      writer.uint32(42).string(message.clientId);
    }
    if (message.address !== "") {
      writer.uint32(50).string(message.address);
    }
    if (message.isPaid !== false) {
      writer.uint32(56).bool(message.isPaid);
    }
    if (message.isConfirmed !== false) {
      writer.uint32(64).bool(message.isConfirmed);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VerifyPaymentResult {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifyPaymentResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.coin = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.expiration = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.paymentId = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.clientId = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.address = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.isPaid = reader.bool();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.isConfirmed = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerifyPaymentResult {
    return {
      coin: isSet(object.coin) ? globalThis.String(object.coin) : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
      expiration: isSet(object.expiration) ? globalThis.String(object.expiration) : "",
      paymentId: isSet(object.paymentId) ? globalThis.String(object.paymentId) : "",
      clientId: isSet(object.clientId) ? globalThis.String(object.clientId) : "",
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      isPaid: isSet(object.isPaid) ? globalThis.Boolean(object.isPaid) : false,
      isConfirmed: isSet(object.isConfirmed) ? globalThis.Boolean(object.isConfirmed) : false,
    };
  },

  toJSON(message: VerifyPaymentResult): unknown {
    const obj: any = {};
    if (message.coin !== "") {
      obj.coin = message.coin;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    if (message.expiration !== "") {
      obj.expiration = message.expiration;
    }
    if (message.paymentId !== "") {
      obj.paymentId = message.paymentId;
    }
    if (message.clientId !== "") {
      obj.clientId = message.clientId;
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.isPaid !== false) {
      obj.isPaid = message.isPaid;
    }
    if (message.isConfirmed !== false) {
      obj.isConfirmed = message.isConfirmed;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifyPaymentResult>, I>>(base?: I): VerifyPaymentResult {
    return VerifyPaymentResult.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifyPaymentResult>, I>>(object: I): VerifyPaymentResult {
    const message = createBaseVerifyPaymentResult();
    message.coin = object.coin ?? "";
    message.amount = object.amount ?? "";
    message.expiration = object.expiration ?? "";
    message.paymentId = object.paymentId ?? "";
    message.clientId = object.clientId ?? "";
    message.address = object.address ?? "";
    message.isPaid = object.isPaid ?? false;
    message.isConfirmed = object.isConfirmed ?? false;
    return message;
  },
};

export type CreatePaymentService = typeof CreatePaymentService;
export const CreatePaymentService = {
  createPayment: {
    path: "/multipay.CreatePayment/createPayment",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreatePaymentRequest) => Buffer.from(CreatePaymentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreatePaymentRequest.decode(value),
    responseSerialize: (value: CreatePaymentResult) => Buffer.from(CreatePaymentResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreatePaymentResult.decode(value),
  },
} as const;

export interface CreatePaymentServer extends UntypedServiceImplementation {
  createPayment: handleUnaryCall<CreatePaymentRequest, CreatePaymentResult>;
}

export interface CreatePaymentClient extends Client {
  createPayment(
    request: CreatePaymentRequest,
    callback: (error: ServiceError | null, response: CreatePaymentResult) => void,
  ): ClientUnaryCall;
  createPayment(
    request: CreatePaymentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreatePaymentResult) => void,
  ): ClientUnaryCall;
  createPayment(
    request: CreatePaymentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreatePaymentResult) => void,
  ): ClientUnaryCall;
}

export const CreatePaymentClient = makeGenericClientConstructor(
  CreatePaymentService,
  "multipay.CreatePayment",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): CreatePaymentClient;
  service: typeof CreatePaymentService;
  serviceName: string;
};

export type VerifyPaymentService = typeof VerifyPaymentService;
export const VerifyPaymentService = {
  verifyPayment: {
    path: "/multipay.VerifyPayment/verifyPayment",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: VerifyPaymentRequest) => Buffer.from(VerifyPaymentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => VerifyPaymentRequest.decode(value),
    responseSerialize: (value: VerifyPaymentResult) => Buffer.from(VerifyPaymentResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VerifyPaymentResult.decode(value),
  },
} as const;

export interface VerifyPaymentServer extends UntypedServiceImplementation {
  verifyPayment: handleUnaryCall<VerifyPaymentRequest, VerifyPaymentResult>;
}

export interface VerifyPaymentClient extends Client {
  verifyPayment(
    request: VerifyPaymentRequest,
    callback: (error: ServiceError | null, response: VerifyPaymentResult) => void,
  ): ClientUnaryCall;
  verifyPayment(
    request: VerifyPaymentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VerifyPaymentResult) => void,
  ): ClientUnaryCall;
  verifyPayment(
    request: VerifyPaymentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VerifyPaymentResult) => void,
  ): ClientUnaryCall;
}

export const VerifyPaymentClient = makeGenericClientConstructor(
  VerifyPaymentService,
  "multipay.VerifyPayment",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): VerifyPaymentClient;
  service: typeof VerifyPaymentService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
