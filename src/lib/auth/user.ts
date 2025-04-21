import { action, atom, wrap } from "@reatom/core";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase";

export const $user = atom<User | null>(null);
export const $ready = atom<boolean>(false);

export const initialize = action(() => {
  onAuthStateChanged(
    auth,
    wrap((user) => {
      $user(user);
      $ready(true);
    })
  );
});
