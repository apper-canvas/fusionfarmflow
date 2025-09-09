import transactionsData from '@/services/mockData/transactions.json'

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.transactions]
  }

  async getById(id) {
    await this.delay(200)
    const transaction = this.transactions.find(t => t.Id === parseInt(id))
    if (!transaction) throw new Error('Transaction not found')
    return { ...transaction }
  }

  async create(transactionData) {
    await this.delay(400)
    const newId = Math.max(...this.transactions.map(t => t.Id)) + 1
    const newTransaction = {
      Id: newId,
      ...transactionData
    }
    this.transactions.push(newTransaction)
    return { ...newTransaction }
  }

  async update(id, transactionData) {
    await this.delay(400)
    const index = this.transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error('Transaction not found')
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData
    }
    return { ...this.transactions[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error('Transaction not found')
    
    this.transactions.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new TransactionService()