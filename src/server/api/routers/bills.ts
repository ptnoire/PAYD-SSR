import { User, clerkClient } from "@clerk/nextjs/dist/api";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { BillFormSchema } from "components/billForm";

const filterUserForClient = (user: User) => {
    return {id: user.id}
}

export const billsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const bills = await ctx.prisma.bill.findMany({
            take: 100,
            orderBy: [
                {createAt: "desc"}
            ]
        })
        const users = (await clerkClient.users.getUserList({
            userId: bills.map((bill) => bill.billOwner),
            limit: 100,
        })).map(filterUserForClient)
        
        return bills.map(bill => {
            const owner = users.find((user) => user.id === bill.billOwner);
            

        if (!owner) throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No bills found by Owner.",
        });

        return {
            bill,
            owner,
        };
    });
    }),
    create: privateProcedure.input(BillFormSchema).mutation(async ({ctx, input}) => {
        const billOwner = ctx.userId;
        const bill = await ctx.prisma.bill.create({
            data: {
                isRecurring: input.isRecurring,
                billDueAmt: input.billDueAmt,
                billName: input.billName,
                billDueDate: input.billDueDate,
                billOwner,
            }
        });
        return bill;
    })
})