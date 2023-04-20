import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { BillFormSchema } from "components/billForm";
import { z } from "zod";

export function incrementMonthAndRetainDate(date: string) {
    const newDate = new Date(date);

    const isLastDayOfMonth = newDate.getDate() === new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
        if (isLastDayOfMonth) {
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + 1);
            newDate.setDate(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate());
            const updatedDate = newDate.toString();
            return updatedDate as string;
        }
    newDate.setMonth(newDate.getMonth() + 1);
    const updatedDate = newDate.toString();

    return updatedDate as string;
  }

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
    getExpenseTotal: privateProcedure.query(async ({ctx}) => {
        const result = await ctx.prisma.bill.aggregate({
            where: {
                billOwner: ctx.userId,
                isRecurring: true,
            },
            _sum: {
                billDueAmt: true,
            }
        })

        return result._sum.billDueAmt;
    }),
    getMonthTotal: privateProcedure.query(async ({ctx}) => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        
        const result = await ctx.prisma.bill.aggregate({
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
        
        return result._sum.billDueAmt;
    }),
    getCurBalance: privateProcedure.query(async ({ctx}) => {
        const result = await ctx.prisma.bill.aggregate({
            where: {
                billOwner: ctx.userId,
                payd: false,
            },
            _sum: {
                billDueAmt: true,
            }
        })
        
        return result._sum.billDueAmt;
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