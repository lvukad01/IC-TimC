import { addEmployees } from '@api/employees';
import type { ActionResponse, CreateEmployeesRequest } from '@lumii/types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type Payload = {
  salonId: string;
  data: CreateEmployeesRequest;
};

const useAddEmployees = () => {
  return useMutation({
    mutationFn: ({ salonId, data }: Payload) => addEmployees(salonId, data),

    onSuccess: (response: ActionResponse) => {
      toast.success(response.message || 'Success');
    },

    onError: (error: any) => {
      toast.error(error);
    },
  });
};

export default useAddEmployees;
