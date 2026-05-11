import { login, register, useMe } from '@api/auth';
import { QueryKeys } from '@api/queryKeys';
import LocalStorage from '@helpers/LocalStorage';
import { useLocalStorage } from '@hooks/useLocalStorage';
import type { AccessToken, LoginRequest, RegisterRequest } from '@lumii/types';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { createContext, type ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface AuthContextType {
  authenticated: boolean;
  register: UseMutationResult<AccessToken, any, RegisterRequest>;
  login: ReturnType<typeof useMutation<AccessToken, any, LoginRequest>>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>({
    key: LocalStorage.accessTokenKey,
    initialValue: null,
  });

  const { data: user, isLoading } = useMe(accessToken);

  const authenticated = !!accessToken && !!user;

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      toast.success('Successfully logged in');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ME] });
    },
    onError: (error: any) => {
      toast.error(error || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterRequest) => register(values),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      toast.success('Registration successful!');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ME] });
    },
    onError: (error: any) => {
      toast.error(error || 'Registration failed');
    },
  });

  const logout = () => {
    setAccessToken(null);
    toast.success('Successfully logged out');
    queryClient.removeQueries({ queryKey: [QueryKeys.ME] });
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        login: loginMutation,
        register: registerMutation,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
