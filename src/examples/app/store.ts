import { d } from "../../lib";

export const userId = d.persist(localStorage, "zvms.userId")(NaN);
