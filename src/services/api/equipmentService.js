import equipmentData from '../mockData/equipment.json'

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for equipment data
let equipments = [...equipmentData]

const equipmentService = {
  async getAll() {
    await delay(300)
    return [...equipments]
  },

  async getById(id) {
    await delay(200)
    const equipment = equipments.find(e => e.Id === parseInt(id))
    if (!equipment) {
      throw new Error(`Equipment with ID ${id} not found`)
    }
    return { ...equipment }
  },

  async create(equipmentData) {
    await delay(400)
    
    // Generate new ID
    const maxId = equipments.length > 0 ? Math.max(...equipments.map(e => e.Id)) : 0
    const newEquipment = {
      ...equipmentData,
      Id: maxId + 1,
      purchaseDate: equipmentData.purchaseDate || new Date().toISOString().split('T')[0],
      status: equipmentData.status || 'Operational',
      hoursUsed: equipmentData.hoursUsed || 0,
      lastMaintenance: equipmentData.lastMaintenance || new Date().toISOString().split('T')[0],
      nextMaintenance: equipmentData.nextMaintenance || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    equipments.push(newEquipment)
    return { ...newEquipment }
  },

  async update(id, equipmentData) {
    await delay(350)
    
    const index = equipments.findIndex(e => e.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Equipment with ID ${id} not found`)
    }
    
    equipments[index] = { ...equipments[index], ...equipmentData, Id: parseInt(id) }
    return { ...equipments[index] }
  },

  async delete(id) {
    await delay(250)
    
    const index = equipments.findIndex(e => e.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Equipment with ID ${id} not found`)
    }
    
    const deletedEquipment = equipments[index]
    equipments.splice(index, 1)
    return deletedEquipment
  }
}

export default equipmentService