export interface SignFilesRequest {
  keys: string[];
}

export interface SignFilesResponse {
  files: { key: string; url: string }[];
}
