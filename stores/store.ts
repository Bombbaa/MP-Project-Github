import { create } from "zustand";

type UseStoreState = {
  datepickerAPI: any;
  setDatepickerAPI: (data: any) => void;
};

export const useStoreAPI = create<UseStoreState>((set) => ({
  datepickerAPI: "",
  setDatepickerAPI: (data: any) => set({ datepickerAPI: data }),
}));
