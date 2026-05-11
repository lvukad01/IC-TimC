import { PaymentMethod, PaymentStatus, PaymentType } from '@lumii/types';
import { Injectable } from '@nestjs/common';
import { Payments, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { PaymentInput, PaymentRefundInput } from '@tstypes/payment-input';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBookingPayments(
    { bookingId, clientId, totalAmount, depositAmount, method }: PaymentInput,
    tx: Prisma.TransactionClient,
  ): Promise<Payments[]> {
    const payments: Payments[] = [];

    const deposit = await tx.payments.create({
      data: {
        bookingId,
        clientId,
        amount: depositAmount,
        type: PaymentType.DEPOSIT,
        status: PaymentStatus.PAID,
        method: PaymentMethod.CARD,
      },
    });

    payments.push(deposit);

    if (method !== PaymentMethod.CASH) {
      const balance = await tx.payments.create({
        data: {
          bookingId,
          clientId,
          amount: totalAmount - depositAmount,
          type: PaymentType.BALANCE,
          status: PaymentStatus.PAID,
          method,
        },
      });

      payments.push(balance);
    }

    return payments;
  }

  async createRefundPayment(
    { bookingId, clientId, refunds }: PaymentRefundInput,
    tx: Prisma.TransactionClient,
  ): Promise<Payments[]> {
    return await Promise.all(
      refunds.map((refund) =>
        tx.payments.create({
          data: {
            bookingId,
            clientId,
            amount: refund.amount,
            type: PaymentType.REFUND,
            status: PaymentStatus.PAID,
            method: refund.method,
          },
        }),
      ),
    );
  }
}
