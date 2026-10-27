import { users } from '../data/users';
import { pets } from '../data/pets';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  getAllCustomers: async () => {
    await delay();
    return users.filter(user => user.role === 'customer');
  },

  getCustomerById: async (customerId) => {
    await delay();
    const customer = users.find(u => u.id === customerId);
    if (!customer) throw new Error('Pelanggan tidak ditemukan');
    return customer;
  },

  getCustomerPets: async (customerId) => {
    await delay();
    return pets.filter(pet => pet.ownerId === customerId);
  },

  getPetById: async (petId) => {
    await delay();
    const pet = pets.find(p => p.id === petId);
    if (!pet) throw new Error('Data hewan tidak ditemukan');
    return pet;
  }
};