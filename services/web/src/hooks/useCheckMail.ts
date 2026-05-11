import { checkMail } from '@api/auth';
import { useMutation } from '@tanstack/react-query';

const useCheckMail = () => {
  return useMutation({
    mutationFn: (email: string) => checkMail({ email }),
  });
};

export default useCheckMail;
