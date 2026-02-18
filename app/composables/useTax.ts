import { computed, ref } from "vue";

export const useTax = () => {
  const amount = ref(0); // Monthly CA

  const annualCA = computed(() => amount.value * 12);

  const cotisationRate = 0.22; // BIC service
  const vflRate = 0.022; // BIC service VFL rate

  const cotisations = computed(() => annualCA.value * cotisationRate);
  const vflAmount = computed(() => annualCA.value * vflRate);

  const netAnnual = computed(
    () => annualCA.value - cotisations.value - vflAmount.value,
  );

  const net = computed(() => netAnnual.value / 12);

  const seuil = 77700;

  const seuilProgress = computed(() =>
    Math.min(100, (annualCA.value / seuil) * 100),
  );

  const tjm = computed(() => (annualCA.value > 0 ? annualCA.value / 176 : 0));

  return {
    amount,
    annualCA,
    cotisations,
    vflAmount,
    net,
    netAnnual,
    seuil,
    seuilProgress,
    tjm,
  };
};
