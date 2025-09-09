class CropService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'crop_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
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
      console.error("Error fetching crops:", error?.response?.data?.message || error)
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
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
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
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [{
          Name: cropData.name_c || cropData.name,
          name_c: cropData.name_c || cropData.name,
          variety_c: cropData.variety_c || cropData.variety,
          planted_date_c: cropData.planted_date_c || cropData.plantedDate,
          expected_harvest_c: cropData.expected_harvest_c || cropData.expectedHarvest,
          status_c: cropData.status_c || cropData.status,
          area_c: cropData.area_c || cropData.area,
          notes_c: cropData.notes_c || cropData.notes,
          farm_id_c: parseInt(cropData.farm_id_c || cropData.farmId)
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
          console.error(`Failed to create ${failed.length} crops:`, failed)
          throw new Error(failed[0].message || 'Failed to create crop')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.name_c || cropData.name,
          name_c: cropData.name_c || cropData.name,
          variety_c: cropData.variety_c || cropData.variety,
          planted_date_c: cropData.planted_date_c || cropData.plantedDate,
          expected_harvest_c: cropData.expected_harvest_c || cropData.expectedHarvest,
          status_c: cropData.status_c || cropData.status,
          area_c: cropData.area_c || cropData.area,
          notes_c: cropData.notes_c || cropData.notes,
          farm_id_c: parseInt(cropData.farm_id_c || cropData.farmId)
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
          console.error(`Failed to update ${failed.length} crops:`, failed)
          throw new Error(failed[0].message || 'Failed to update crop')
        }
        return successful[0]?.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error)
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
          console.error(`Failed to delete crop:`, failed)
          throw new Error(failed[0].message || 'Failed to delete crop')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default new CropService()