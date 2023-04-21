import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { BillFormSchema } from "components/billForm";
import { z } from "zod";
import { incrementMonthAndRetainDate } from "~/helpers/convert";

export const billsRouter = createTRPCRouter({
    getUserBills: privateProcedure.query(async ({ctx}) => 
    await ctx.prisma.bill.findMany({
            where: {
                billOwner: ctx.userId
            },
            take: 100,
            orderBy: [
                {createAt: "desc"}
            ]
        })
    ),
    getTotals: privateProcedure.query(async ({ctx}) => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const expenseTotal = await ctx.prisma.bill.aggregate({
            where: {
                billOwner: ctx.userId,
                isRecurring: true,
            },
            _sum: {
                billDueAmt: true,
            }
        })

        const currBalance = await ctx.prisma.bill.aggregate({
            where: {
                billOwner: ctx.userId,
                payd: false,
            },
            _sum: {
                billDueAmt: true,
            }
        })
        
        const monthTotal = await ctx.prisma.bill.aggregate({
            where: {
                billOwner: ctx.userId,
                billDueDate: {
                    gte: startOfMonth.toISOString(),
                    lte: endOfMonth.toISOString(),
                  },
            },
            _sum: {
                billDueAmt: true,
            }
        })

        const totals = {
            expenses: expenseTotal._sum.billDueAmt, 
            monthExpense: monthTotal._sum.billDueAmt,
            currBalance: currBalance._sum.billDueAmt,
        }

        return totals;
    }),
    create: privateProcedure
    .input(BillFormSchema)
    .mutation(async ({ctx, input}) => {
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
    }),
    getBillById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
        const bill = await ctx.prisma.bill.findUnique({
        where: { id: input.id }} )
        if(!bill) throw new TRPCError({code: "NOT_FOUND"});

        return bill;
    }),
    getBillHistoryById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ctx, input}) => {
        const billHistory = await ctx.prisma.billHistory.findMany({
            where: { 
                billOwner: ctx.userId,
                billNameID: input.id 
            },
            take: 100,
            orderBy: [
                {createAt: "desc"}
            ]
        })

        if(!billHistory) throw new TRPCError({code: "NOT_FOUND"});

        return billHistory;
    }),
    payd: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ctx, input}) => {
        const bill = await ctx.prisma.bill.findUnique({
            where: { 
                id: input.id 
            }
        })

        if(!bill) throw new TRPCError({code: "NOT_FOUND"});
        if (bill.isRecurring) {
            await ctx.prisma.bill.update({
                where: { 
                    id: input.id 
                },
                data: {
                    billDueDate: incrementMonthAndRetainDate(bill.billDueDate)
                }
            })
        }

        await ctx.prisma.bill.update({
        where: { 
            id: input.id 
        },
        data: {
            payd: true,
        }
    })
        await ctx.prisma.billHistory.create({
            data: {
                billNameID: bill.id,
                amtPaid: bill.billDueAmt,
                billOwner: ctx.userId,
            }
        })

        return bill;
    }),
    deleteBill: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ctx, input}) => 
        await ctx.prisma.bill.delete({
            where: {
                id: input.id,
            }
        }))
})