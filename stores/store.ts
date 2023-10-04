import { create } from "zustand";

type UseStoreState = {
  datepickerAPI: any;
  setCountAPI: number;
  setWorkAPI: number;
  setAbsentAPI: number;
  setDatepickerAPI: (data: any) => void;
};

export const useStoreAPI = create<UseStoreState>((set) => ({
  datepickerAPI: "",
  setCountAPI: 0,
  setWorkAPI: 0,
  setAbsentAPI: 0,
  setDatepickerAPI: (data: any) => set({ datepickerAPI: data }),
}));
