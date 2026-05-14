import { api } from './index';

type SignedFile = {
  key: string;
  url: string;
};

type SignedFilesResponse = {
  files: SignedFile[];
};

export const getSignedFiles = async (keys: string[]): Promise<SignedFilesResponse> => {
  return api.post('/files/sign', { keys });
};
