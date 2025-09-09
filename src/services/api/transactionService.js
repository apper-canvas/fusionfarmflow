class TransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'transaction_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: transactionData.description_c || transactionData.description,
          farm_id_c: parseInt(transactionData.farm_id_c || transactionData.farmId),
          type_c: transactionData.type_c || transactionData.type,
          category_c: transactionData.category_c || transactionData.category,
          amount_c: transactionData.amount_c || transactionData.amount,
          description_c: transactionData.description_c || transactionData.description,
          date_c: transactionData.date_c || transactionData.date
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed)
          throw new Error(failed[0].message || 'Failed to create transaction')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: transactionData.description_c || transactionData.description,
          farm_id_c: parseInt(transactionData.farm_id_c || transactionData.farmId),
          type_c: transactionData.type_c || transactionData.type,
          category_c: transactionData.category_c || transactionData.category,
          amount_c: transactionData.amount_c || transactionData.amount,
          description_c: transactionData.description_c || transactionData.description,
          date_c: transactionData.date_c || transactionData.date
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed)
          throw new Error(failed[0].message || 'Failed to update transaction')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete transaction:`, failed)
          throw new Error(failed[0].message || 'Failed to delete transaction')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new TransactionService()