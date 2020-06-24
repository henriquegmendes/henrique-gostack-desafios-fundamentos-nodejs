import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestService {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestService): Transaction {
    const newTransactionData = {
      title,
      value,
      type,
    };

    if (type !== 'outcome' && type !== 'income') {
      throw Error('Transaction "type" is not valid');
    }

    if (type === 'outcome') {
      const currentBalance = this.transactionsRepository.getBalance();

      if (currentBalance.total - value < 0) {
        throw Error('No available balance to perform this transaction');
      }
    }

    const newTransaction = this.transactionsRepository.create(
      newTransactionData,
    );

    return newTransaction;
  }
}

export default CreateTransactionService;
