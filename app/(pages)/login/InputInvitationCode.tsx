import {
  AuthStoreStatesType,
  useAuthStore,
} from "@/app/(global-state-store)/useAuthStore";

export default function InputInvitationCode({
  stateModifiers,
  label,
  submitCode,
}: {
  stateModifiers: AuthStoreStatesType[];
  label: string;
  submitCode: string;
}) {
  const authStore = useAuthStore();
  const getter = authStore[stateModifiers[0]];
  const setter = authStore[stateModifiers[1]];
  const setSubmit = authStore.setSubmit;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit();
  }

  async function handleSubmit() {
    setSubmit(submitCode);
  }

  return (
    <form onSubmit={onSubmit}>
      <label className="block">{label}:</label>
      <input
        type="text"
        value={getter}
        onChange={(e) => setter(e.currentTarget.value)}
        className="border border-black px-2"
      />
      <button
        onClick={handleSubmit}
        className="border border-black rounded-md ml-2 px-3 hover:bg-green-200"
      >
        Enter
      </button>
    </form>
  );
}
