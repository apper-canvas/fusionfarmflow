import { toast } from 'react-toastify'

const salesOrderService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await apperClient.fetchRecords('sales_order_c', params)

      if (!response?.data?.length) {
        return []
      }

      return response.data
    } catch (error) {
      console.error('Error fetching sales orders:', error?.response?.data?.message || error)
      throw error
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('sales_order_c', id, params)

      if (!response?.data) {
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(orderData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Name: orderData.Name || '',
          Tags: orderData.Tags || '',
          customer_name_c: orderData.customer_name_c,
          order_date_c: orderData.order_date_c,
          total_amount_c: parseFloat(orderData.total_amount_c)
        }]
      }

      const response = await apperClient.createRecord('sales_order_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales orders:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to create sales order')
        }

        toast.success('Sales order created successfully')
        return successful[0]?.data
      }
    } catch (error) {
      console.error('Error creating sales order:', error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, orderData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: orderData.Name || '',
          Tags: orderData.Tags || '',
          customer_name_c: orderData.customer_name_c,
          order_date_c: orderData.order_date_c,
          total_amount_c: parseFloat(orderData.total_amount_c)
        }]
      }

      const response = await apperClient.updateRecord('sales_order_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales orders:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to update sales order')
        }

        toast.success('Sales order updated successfully')
        return successful[0]?.data
      }
    } catch (error) {
      console.error('Error updating sales order:', error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(ids) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const idsArray = Array.isArray(ids) ? ids : [ids]
      const params = {
        RecordIds: idsArray.map(id => parseInt(id))
      }

      const response = await apperClient.deleteRecord('sales_order_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales orders:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to delete some sales orders')
        }

        toast.success(idsArray.length === 1 ? 'Sales order deleted successfully' : 'Sales orders deleted successfully')
        return true
      }
    } catch (error) {
      console.error('Error deleting sales orders:', error?.response?.data?.message || error)
      throw error
    }
  }
}

export default salesOrderService