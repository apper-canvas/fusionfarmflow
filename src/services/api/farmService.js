class FarmService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'farm_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "created_at_c"}},
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
      console.error("Error fetching farms:", error?.response?.data?.message || error)
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
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "created_at_c"}},
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
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [{
          Name: farmData.name_c || farmData.name,
          name_c: farmData.name_c || farmData.name,
          location_c: farmData.location_c || farmData.location,
          size_c: farmData.size_c || farmData.size,
          unit_c: farmData.unit_c || farmData.unit,
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} farms:`, failed)
          throw new Error(failed[0].message || 'Failed to create farm')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, farmData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name_c || farmData.name,
          name_c: farmData.name_c || farmData.name,
          location_c: farmData.location_c || farmData.location,
          size_c: farmData.size_c || farmData.size,
          unit_c: farmData.unit_c || farmData.unit
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
          console.error(`Failed to update ${failed.length} farms:`, failed)
          throw new Error(failed[0].message || 'Failed to update farm')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error)
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
          console.error(`Failed to delete farm:`, failed)
          throw new Error(failed[0].message || 'Failed to delete farm')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new FarmService()
export default new FarmService()