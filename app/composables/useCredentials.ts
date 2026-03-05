import { ref } from "vue";
import { toast } from "vue-sonner";

export interface CredentialField {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export interface Credential {
  id: string;
  label: string;
  category: string;
  clientName?: string;
  fields: CredentialField[];
  createdAt: string;
}

export const useCredentials = () => {
  const credentials = ref<Credential[]>([]);
  const loading = ref(false);

  const loadCredentials = async () => {
    loading.value = true;
    try {
      const data = await $fetch<Credential[]>("/api/credentials");
      if (data) credentials.value = data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const addCredential = async (
    credential: Omit<Credential, "id" | "createdAt">,
  ) => {
    try {
      const newCred = await $fetch<Credential>("/api/credentials", {
        method: "POST",
        body: credential,
      });
      if (newCred) credentials.value.unshift(newCred);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      await $fetch(`/api/credentials/${id}`, { method: "DELETE" });
      credentials.value = credentials.value.filter((c) => c.id !== id);
      toast.success("Clé supprimé !");
    } catch (e) {
      console.error(e);
    }
  };

  const revealField = async (fieldId: string): Promise<string> => {
    const data = await $fetch<{ value: string }>(
      `/api/credentials/fields/${fieldId}/reveal`,
    );
    return data?.value ?? "";
  };

  return {
    credentials,
    loading,
    loadCredentials,
    addCredential,
    deleteCredential,
    revealField,
  };
};
