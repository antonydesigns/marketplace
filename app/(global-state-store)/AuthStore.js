import { create } from "zustand";

export const AuthStore = create((set) => ({
  /// ...
  key: "",
  setKey: (s) => set(() => ({ key: s })),
  submit: "",
  setSubmit: (s) => set(() => ({ submit: s })),
}));
