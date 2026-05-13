import { addSalon } from '@api/salon';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useAddSalon = () => {
  return useMutation({
    mutationFn: addSalon,
    onSuccess: () => {
      toast.success('Successfully created salon');
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });
};

export default useAddSalon;
