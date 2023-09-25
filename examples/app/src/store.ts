import { d } from "refina";

export const userId = d.persist(localStorage, "zvms.userId")(NaN);
