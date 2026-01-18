"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import { LoginDto, RegisterDto, User } from "@/types/api/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const meQuery = useQuery<User>({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
    },
  });

  return {
    user: meQuery.data ?? null,
    userRole: meQuery.data?.role ?? "",
    isAuthenticated: !!meQuery.data,
    isLoading: meQuery.isLoading,

    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
}
