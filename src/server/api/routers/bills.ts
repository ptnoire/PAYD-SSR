import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { incrementMonthAndRetainDate } from "~/helpers/convert";
import { BillEditSchema, BillFormSchema, BillHistoryEditSchema } from "~/helpers/exportTypes";
import type {BillWithHistory} from "~/helpers/exportTypes";

export const billsRouter = createTRPCRouter({
    getUserBills: privateProcedure.query(async ({ctx}) => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        
        const userBills = await ctx.prisma.bill.findMany({
            where: {
                billOwner: ctx.userId
            },
            take: 100,
            orderBy: [
                {createAt: "desc"}
            ]
        })
        
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
                billDueDate: {
                    gte: startOfMonth.toISOString(),
                    lte: endOfMonth.toISOString(),
                  },
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

        const userHistory = await ctx.prisma.billHistory.findMany({
            where: { 
                billOwner: ctx.userId,
            },
            take: 100,
            orderBy: [
                {createAt: "desc"}
            ]
        })

        const uniqueBills: Array<BillWithHistory> = [];

        userBills.forEach(element => {
            const uniqueHistory = userHistory.filter(el => el.billNameID === element.id)
            const uniqueBill = {
                id: element.id,
                createAt: element.createAt,
                billName: element.billName,
                billDueAmt: element.billDueAmt,
                billDueDate: element.billDueDate,
                isRecurring: element.isRecurring,
                payd: element.payd,
                billOwner: element.billOwner,
                history: uniqueHistory,
            }
            uniqueBills.push(uniqueBill)
        })

        const totals = {
            userBills: {
                bills: uniqueBills,
            },
            userHistory,
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
    edit: privateProcedure
    .input(BillEditSchema)
    .mutation(async ({ctx, input}) => {
        const billOwner = ctx.userId;
        const bill = await ctx.prisma.bill.update({
            where: { 
                id: input.id 
            },
            data: {
                isRecurring: input.isRecurring,
                billDueAmt: input.billDueAmt,
                billName: input.billName,
                billDueDate: input.billDueDate,
                billOwner,
            }
        });
        await ctx.prisma.billHistory.updateMany({
            where: { 
                billNameID: input.id 
            },
            data: {
                billName: input.billName
            }
        })
        return bill;
    }),
    editHistory: privateProcedure
    .input(BillHistoryEditSchema)
    .mutation(async ({ctx, input}) => {
        const billHistory = await ctx.prisma.billHistory.update({
            where: {
                id: input.id 
            },
            data: {
                amtPaid: input.billPaidAmt,
            }
        });

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
        if (bill.isRecurring && !bill.payd) {
            await ctx.prisma.bill.update({
                where: { 
                    id: input.id 
                },
                data: {
                    billDueDate: incrementMonthAndRetainDate(bill.billDueDate)
                }
            })
        }
        if (!bill.payd) {
            await ctx.prisma.bill.update({
                where: { 
                    id: input.id 
                },
                data: {
                    payd: true,
                }
            })
        } else if (bill.payd) {
            await ctx.prisma.bill.update({
                where: { 
                    id: input.id 
                },
                data: {
                    payd: false,
                }
            })
        }
        
        await ctx.prisma.billHistory.create({
            data: {
                billName: bill.billName,
                billNameID: bill.id,
                amtPaid: bill.billDueAmt,
                billOwner: ctx.userId,
            }
        })

        return bill;
    }),
    deleteBillHistory: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ctx, input}) => 
        await ctx.prisma.billHistory.delete({
            where: {
                id: input.id,
            }
        })),
    deleteBill: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ctx, input}) => {
        await ctx.prisma.bill.delete({
            where: {
                id: input.id,
            }
        })
        await ctx.prisma.billHistory.deleteMany({
            where: {
                billNameID: input.id,
            }
        })
    })
})