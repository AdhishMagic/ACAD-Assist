import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "../services/profileAPI";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileAPI.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: profileAPI.updatePassword,
  });
};
