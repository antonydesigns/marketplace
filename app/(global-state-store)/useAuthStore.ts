import { AuthStore } from "./AuthStore";

export type AuthStoreStatesType = keyof ReturnType<typeof useAuthStore>;

export function useAuthStore() {
  const store = AuthStore();
  const stateModifiers = {
    key: store.key,
    setKey: store.setKey,
    submit: store.submit,
    setSubmit: store.setSubmit,
    password: store.password,
    setPassword: store.setPassword,
    username: store.username,
    setUsername: store.setUsername,
    id: store.id,
    setID: store.setID,
    loggedIn: store.loggedIn,
    setLoggedIn: store.setLoggedIn,
    unlocked: store.unlocked,
    setUnlocked: store.setUnlocked,
  };
  return stateModifiers;
}
