import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
};

export type Epoch = {
  __typename?: 'Epoch';
  id: Scalars['ID'];
  index: Scalars['Int'];
  /** Get input from this particular epoch given the input's index */
  input: Input;
  inputs: InputConnection;
  /** Get notices from this particular input with additional ability to filter and paginate them */
  notices: NoticeConnection;
  /** Get reports from this particular epoch with additional ability to filter and paginate them */
  reports: ReportConnection;
  /** Get vouchers from this particular epoch with additional ability to filter and paginate them */
  vouchers: VoucherConnection;
};


export type EpochInputArgs = {
  index: Scalars['Int'];
};


export type EpochInputsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InputFilter>;
};


export type EpochNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<NoticeFilter>;
};


export type EpochReportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ReportFilter>;
};


export type EpochVouchersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoucherFilter>;
};

export type EpochConnection = {
  __typename?: 'EpochConnection';
  edges: Array<EpochEdge>;
  nodes: Array<Epoch>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type EpochEdge = {
  __typename?: 'EpochEdge';
  cursor: Scalars['String'];
  node: Epoch;
};

export type Input = {
  __typename?: 'Input';
  blockNumber: Scalars['BigInt'];
  epoch: Epoch;
  id: Scalars['ID'];
  index: Scalars['Int'];
  msgSender: Scalars['String'];
  /** Get notice from this particular input given the notice's index */
  notice: Notice;
  /** Get notices from this particular input with additional ability to filter and paginate them */
  notices: NoticeConnection;
  /** Get report from this particular input given report's index */
  report: Report;
  /** Get reports from this particular input with additional ability to filter and paginate them */
  reports: ReportConnection;
  timestamp: Scalars['BigInt'];
  /** Get voucher from this particular input given the voucher's index */
  voucher: Voucher;
  /** Get vouchers from this particular input with additional ability to filter and paginate them */
  vouchers: VoucherConnection;
};


export type InputNoticeArgs = {
  index: Scalars['Int'];
};


export type InputNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<NoticeFilter>;
};


export type InputReportArgs = {
  index: Scalars['Int'];
};


export type InputReportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ReportFilter>;
};


export type InputVoucherArgs = {
  index: Scalars['Int'];
};


export type InputVouchersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoucherFilter>;
};

export type InputConnection = {
  __typename?: 'InputConnection';
  edges: Array<InputEdge>;
  nodes: Array<Input>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type InputEdge = {
  __typename?: 'InputEdge';
  cursor: Scalars['String'];
  node: Input;
};

export type InputFilter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumberGreaterThan?: InputMaybe<Scalars['BigInt']>;
  blockNumberLowerThan?: InputMaybe<Scalars['BigInt']>;
  msgSender?: InputMaybe<Scalars['String']>;
  timestampGreaterThan?: InputMaybe<Scalars['BigInt']>;
  timestampLowerThan?: InputMaybe<Scalars['BigInt']>;
};

export type Notice = {
  __typename?: 'Notice';
  id: Scalars['ID'];
  index: Scalars['Int'];
  input: Input;
  /** Keccak in Ethereum hex binary format, starting with '0x' */
  keccak: Scalars['String'];
  /** Payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
  proof?: Maybe<Proof>;
};

export type NoticeConnection = {
  __typename?: 'NoticeConnection';
  edges: Array<NoticeEdge>;
  nodes: Array<Notice>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type NoticeEdge = {
  __typename?: 'NoticeEdge';
  cursor: Scalars['String'];
  node: Notice;
};

export type NoticeFilter = {
  dummy: Scalars['String'];
};

/** Connection pattern cursor based pagination page info */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type Proof = {
  __typename?: 'Proof';
  keccakInHashesSiblings: Array<Scalars['String']>;
  machineStateHash: Scalars['String'];
  noticesEpochRootHash: Scalars['String'];
  outputHashesInEpochSiblings: Array<Scalars['String']>;
  /** Hashes given in Ethereum hex binary format (32 bytes), starting with '0x' */
  outputHashesRootHash: Scalars['String'];
  vouchersEpochRootHash: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  epoch: Epoch;
  epochI: Epoch;
  epochs: EpochConnection;
  input: Input;
  /** Get all available inputs with additional ability to filter and paginate them */
  inputs: InputConnection;
  notice: Notice;
  /** Get all available notices with additional ability to filter and paginate them */
  notices: NoticeConnection;
  report: Report;
  /** Get all available reports with additional ability to filter and paginate them */
  reports: ReportConnection;
  voucher: Voucher;
  /** Get all available vouchers with additional ability to filter and paginate them */
  vouchers: VoucherConnection;
};


export type QueryEpochArgs = {
  id: Scalars['ID'];
};


export type QueryEpochIArgs = {
  index: Scalars['Int'];
};


export type QueryEpochsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryInputArgs = {
  id: Scalars['ID'];
};


export type QueryInputsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InputFilter>;
};


export type QueryNoticeArgs = {
  id: Scalars['ID'];
};


export type QueryNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<NoticeFilter>;
};


export type QueryReportArgs = {
  id: Scalars['ID'];
};


export type QueryReportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ReportFilter>;
};


export type QueryVoucherArgs = {
  id: Scalars['ID'];
};


export type QueryVouchersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoucherFilter>;
};

export type Report = {
  __typename?: 'Report';
  id: Scalars['ID'];
  index: Scalars['Int'];
  input: Input;
  /** Payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
};

export type ReportConnection = {
  __typename?: 'ReportConnection';
  edges: Array<ReportEdge>;
  nodes: Array<Report>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ReportEdge = {
  __typename?: 'ReportEdge';
  cursor: Scalars['String'];
  node: Report;
};

export type ReportFilter = {
  dummy: Scalars['String'];
};

export type Voucher = {
  __typename?: 'Voucher';
  /** Destination address as an Ethereum hex binary format (20 bytes), starting with '0x' */
  destination: Scalars['String'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  input: Input;
  /** Payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
  proof?: Maybe<Proof>;
};

export type VoucherConnection = {
  __typename?: 'VoucherConnection';
  edges: Array<VoucherEdge>;
  nodes: Array<Voucher>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type VoucherEdge = {
  __typename?: 'VoucherEdge';
  cursor: Scalars['String'];
  node: Voucher;
};

export type VoucherFilter = {
  destination: Scalars['String'];
};

export type NoticeQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NoticeQuery = { __typename?: 'Query', notice: { __typename?: 'Notice', id: string, payload: string, index: number, keccak: string, proof?: { __typename?: 'Proof', outputHashesRootHash: string, vouchersEpochRootHash: string, noticesEpochRootHash: string, machineStateHash: string, keccakInHashesSiblings: Array<string>, outputHashesInEpochSiblings: Array<string> } | null, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } } };

export type NoticesQueryVariables = Exact<{ [key: string]: never; }>;


export type NoticesQuery = { __typename?: 'Query', notices: { __typename?: 'NoticeConnection', nodes: Array<{ __typename?: 'Notice', id: string, index: number, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } };

export type NoticesByEpochAndInputQueryVariables = Exact<{
  epoch_index: Scalars['Int'];
  input_index: Scalars['Int'];
}>;


export type NoticesByEpochAndInputQuery = { __typename?: 'Query', epoch: { __typename?: 'Epoch', input: { __typename?: 'Input', notices: { __typename?: 'NoticeConnection', nodes: Array<{ __typename?: 'Notice', id: string, index: number, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } } } };

export type NoticesByEpochQueryVariables = Exact<{
  epoch_index: Scalars['Int'];
}>;


export type NoticesByEpochQuery = { __typename?: 'Query', epoch: { __typename?: 'Epoch', inputs: { __typename?: 'InputConnection', nodes: Array<{ __typename?: 'Input', notices: { __typename?: 'NoticeConnection', nodes: Array<{ __typename?: 'Notice', id: string, index: number, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } }> } } };

export type VoucherQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VoucherQuery = { __typename?: 'Query', voucher: { __typename?: 'Voucher', id: string, destination: string, payload: string, index: number, proof?: { __typename?: 'Proof', outputHashesRootHash: string, vouchersEpochRootHash: string, noticesEpochRootHash: string, machineStateHash: string, keccakInHashesSiblings: Array<string>, outputHashesInEpochSiblings: Array<string> } | null, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } } };

export type VouchersQueryVariables = Exact<{ [key: string]: never; }>;


export type VouchersQuery = { __typename?: 'Query', vouchers: { __typename?: 'VoucherConnection', nodes: Array<{ __typename?: 'Voucher', id: string, index: number, destination: string, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } };

export type VouchersByEpochAndInputQueryVariables = Exact<{
  epoch_index: Scalars['Int'];
  input_index: Scalars['Int'];
}>;


export type VouchersByEpochAndInputQuery = { __typename?: 'Query', epoch: { __typename?: 'Epoch', input: { __typename?: 'Input', vouchers: { __typename?: 'VoucherConnection', nodes: Array<{ __typename?: 'Voucher', id: string, index: number, destination: string, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } } } };

export type VouchersByEpochQueryVariables = Exact<{
  epoch_index: Scalars['Int'];
}>;


export type VouchersByEpochQuery = { __typename?: 'Query', epoch: { __typename?: 'Epoch', inputs: { __typename?: 'InputConnection', nodes: Array<{ __typename?: 'Input', vouchers: { __typename?: 'VoucherConnection', nodes: Array<{ __typename?: 'Voucher', id: string, index: number, destination: string, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } }> } } };

export type ReportQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ReportQuery = { __typename?: 'Query', report: { __typename?: 'Report', id: string, payload: string, index: number, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } } };

export type ReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportsQuery = { __typename?: 'Query', reports: { __typename?: 'ReportConnection', nodes: Array<{ __typename?: 'Report', id: string, index: number, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } };

export type ReportsByEpochAndInputQueryVariables = Exact<{
  epoch_index: Scalars['Int'];
  input_index: Scalars['Int'];
}>;


export type ReportsByEpochAndInputQuery = { __typename?: 'Query', epoch: { __typename?: 'Epoch', input: { __typename?: 'Input', reports: { __typename?: 'ReportConnection', nodes: Array<{ __typename?: 'Report', id: string, index: number, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } } } };

export type ReportsByEpochQueryVariables = Exact<{
  epoch_index: Scalars['Int'];
}>;


export type ReportsByEpochQuery = { __typename?: 'Query', epoch: { __typename?: 'Epoch', inputs: { __typename?: 'InputConnection', nodes: Array<{ __typename?: 'Input', reports: { __typename?: 'ReportConnection', nodes: Array<{ __typename?: 'Report', id: string, index: number, payload: string, input: { __typename?: 'Input', index: number, epoch: { __typename?: 'Epoch', index: number } } }> } }> } } };


export const NoticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"keccak"}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outputHashesRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"vouchersEpochRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"noticesEpochRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"machineStateHash"}},{"kind":"Field","name":{"kind":"Name","value":"keccakInHashesSiblings"}},{"kind":"Field","name":{"kind":"Name","value":"outputHashesInEpochSiblings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NoticeQuery, NoticeQueryVariables>;
export const NoticesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<NoticesQuery, NoticesQueryVariables>;
export const NoticesByEpochAndInputDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"noticesByEpochAndInput"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"epoch"},"name":{"kind":"Name","value":"epochI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<NoticesByEpochAndInputQuery, NoticesByEpochAndInputQueryVariables>;
export const NoticesByEpochDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"noticesByEpoch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"epoch"},"name":{"kind":"Name","value":"epochI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<NoticesByEpochQuery, NoticesByEpochQueryVariables>;
export const VoucherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"voucher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voucher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"proof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outputHashesRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"vouchersEpochRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"noticesEpochRootHash"}},{"kind":"Field","name":{"kind":"Name","value":"machineStateHash"}},{"kind":"Field","name":{"kind":"Name","value":"keccakInHashesSiblings"}},{"kind":"Field","name":{"kind":"Name","value":"outputHashesInEpochSiblings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VoucherQuery, VoucherQueryVariables>;
export const VouchersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"vouchers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vouchers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VouchersQuery, VouchersQueryVariables>;
export const VouchersByEpochAndInputDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"vouchersByEpochAndInput"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"epoch"},"name":{"kind":"Name","value":"epochI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vouchers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VouchersByEpochAndInputQuery, VouchersByEpochAndInputQueryVariables>;
export const VouchersByEpochDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"vouchersByEpoch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"epoch"},"name":{"kind":"Name","value":"epochI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vouchers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VouchersByEpochQuery, VouchersByEpochQueryVariables>;
export const ReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"report"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReportQuery, ReportQueryVariables>;
export const ReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReportsQuery, ReportsQueryVariables>;
export const ReportsByEpochAndInputDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reportsByEpochAndInput"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"epoch"},"name":{"kind":"Name","value":"epochI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReportsByEpochAndInputQuery, ReportsByEpochAndInputQueryVariables>;
export const ReportsByEpochDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reportsByEpoch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"epoch"},"name":{"kind":"Name","value":"epochI"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epoch_index"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"input"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"epoch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReportsByEpochQuery, ReportsByEpochQueryVariables>;