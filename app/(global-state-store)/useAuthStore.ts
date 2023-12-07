import { AuthStore } from "./AuthStore";

export type AuthStoreStatesType = keyof ReturnType<typeof useAuthStore>;

export function useAuthStore() {
  const store = AuthStore();
  const stateModifiers = {
    key: store.key,
    setKey: store.setKey,
    submit: store.submit,
    setSubmit: store.setSubmit,
  };
  return stateModifiers;
}
