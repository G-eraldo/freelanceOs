import { computed, ref } from "vue";

export interface ProjectStep {
  sent: boolean;
  signed: boolean;
  deposit: boolean;
  done: boolean;
}

export interface Project {
  id: string;
  client: string;
  name: string;
  amount: number;
  date: string;
  tags: string[];
  devisId?: string;
  cgvId?: string;
  hasMaintenance: boolean;
  maintAmount: number;
  maintDate: string;
  notes: string;
  steps: ProjectStep;
}

export const useProjects = () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);

  // Actions
  const loadProjects = async () => {
    loading.value = true;
    try {
      const data = await $fetch<Project[]>("/api/projects");
      if (data) {
        projects.value = data;
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      loading.value = false;
    }
  };

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const newProject = await $fetch<Project>("/api/projects", {
        method: "POST",
        body: project,
      });
      if (newProject) {
        projects.value.unshift(newProject);
      }
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    try {
      const updatedProject = await $fetch<Project>(`/api/projects/${id}`, {
        method: "PATCH",
        body: updatedData,
      });
      if (updatedProject) {
        const index = projects.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          projects.value[index] = updatedProject;
        }
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await $fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      projects.value = projects.value.filter((p) => p.id !== id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  // Stats
  const activeProjectsCount = computed(
    () => projects.value.filter((p) => !p.steps.done).length,
  );

  const totalCA = computed(() =>
    projects.value
      .filter((p) => p.steps.signed)
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  );

  const pendingCA = computed(() =>
    projects.value
      .filter((p) => p.steps.sent && !p.steps.signed)
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  );

  const maintenanceExpiringCount = computed(() => {
    return projects.value.filter((p) => {
      if (!p.hasMaintenance || !p.maintDate) return false;
      const paid = new Date(p.maintDate);
      const expiry = new Date(paid);
      expiry.setFullYear(expiry.getFullYear() + 1);
      const now = new Date();
      const daysLeft = Math.floor(
        (expiry.getTime() - now.getTime()) / 86400000,
      );
      return daysLeft <= 60;
    }).length;
  });

  return {
    projects,
    loading,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    activeProjectsCount,
    totalCA,
    pendingCA,
    maintenanceExpiringCount,
  };
};
