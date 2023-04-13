import { createTRPCRouter } from "~/server/api/trpc";
import { billsRouter } from "./routers/bills";


export const appRouter = createTRPCRouter({
  bills: billsRouter,
});


export type AppRouter = typeof appRouter;
