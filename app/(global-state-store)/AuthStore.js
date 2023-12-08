import { create } from "zustand";

export const AuthStore = create((set) => ({
  /// ...
  key: "",
  setKey: (s) => set(() => ({ key: s })),
  submit: "",
  setSubmit: (s) => set(() => ({ submit: s })),
  password: "",
  setPassword: (s) => set(() => ({ password: s })),
  username: "",
  setUsername: (s) => set(() => ({ username: s })),
}));
