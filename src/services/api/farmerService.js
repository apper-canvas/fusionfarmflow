class FarmerService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'farmer_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "contact_information_c"}},
          {"field": {"Name": "Tags"}},
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
      console.error("Error fetching farmers:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "contact_information_c"}},
          {"field": {"Name": "Tags"}},
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
      console.error(`Error fetching farmer ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(farmerData) {
    try {
      const params = {
        records: [{
          Name: farmerData.name_c || farmerData.name,
          name_c: farmerData.name_c || farmerData.name,
          contact_information_c: farmerData.contact_information_c || farmerData.contactInformation,
          Tags: farmerData.Tags || farmerData.tags || ''
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
          console.error(`Failed to create ${failed.length} farmers:`, failed)
          throw new Error(failed[0].message || 'Failed to create farmer')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating farmer:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, farmerData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: farmerData.name_c || farmerData.name,
          name_c: farmerData.name_c || farmerData.name,
          contact_information_c: farmerData.contact_information_c || farmerData.contactInformation,
          Tags: farmerData.Tags || farmerData.tags || ''
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
          console.error(`Failed to update ${failed.length} farmers:`, failed)
          throw new Error(failed[0].message || 'Failed to update farmer')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating farmer:", error?.response?.data?.message || error)
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
          console.error(`Failed to delete farmer:`, failed)
          throw new Error(failed[0].message || 'Failed to delete farmer')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting farmer:", error?.response?.data?.message || error)
      throw error
    }
  }
}

const farmerService = new FarmerService()
export default farmerService