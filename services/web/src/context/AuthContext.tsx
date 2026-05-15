import { login, register, useMe } from '@api/auth';
import { QueryKeys } from '@api/queryKeys';
import LocalStorage from '@helpers/LocalStorage';
import { useLocalStorage } from '@hooks/useLocalStorage';
import type { AccessToken, LoginRequest, RegisterRequest, UserRole } from '@lumii/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppPaths } from 'common/routes/paths';
import { createContext, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface AuthContextType {
  authenticated: boolean;
  role: UserRole;
  register: ReturnType<typeof useMutation<AccessToken, any, RegisterRequest>>;
  login: ReturnType<typeof useMutation<AccessToken, any, LoginRequest>>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>({
    key: LocalStorage.accessTokenKey,
    initialValue: null,
  });

  const navigate = useNavigate();

  const { data: user, isLoading } = useMe(accessToken);

  const authenticated = !!accessToken && !!user;
  const role = user?.role;

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data: AccessToken) => {
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
    onSuccess: (data: AccessToken) => {
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
    navigate(`${AppPaths.LOGIN}?mode=${(user?.role as string).toLowerCase()}`);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        role,
        login: loginMutation,
        register: registerMutation,
        logout,
        loading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
