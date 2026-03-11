import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAssistantName() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["assistantName"],
    queryFn: async () => {
      if (!actor) return "Z Assistant";
      return actor.getAssistantName();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addUserMessage(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useUpdateAssistantName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newName: string) => {
      if (!actor) throw new Error("No actor");
      return actor.updateAssistantName(newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistantName"] });
    },
  });
}
