import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from './ui/Input';

export default function TicketForm({ user }) {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleReg: '',
    ticketNumber: '',
    ticketDate: '',
    ticketReason: '',
    keeperAddress: '',
    companyAddress: '',
    circumstances: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Connect to backend
  };

  return (
    <section id="ticket-form" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Tell Us About Your Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Vehicle Make"
                value={formData.vehicleMake}
                onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                required
              />
              
              <Input
                label="Vehicle Model"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                required
              />

              <Input
                label="Vehicle Registration Number"
                value={formData.vehicleReg}
                onChange={(e) => setFormData({ ...formData, vehicleReg: e.target.value })}
                required
              />

              <Input
                label="Ticket Number"
                value={formData.ticketNumber}
                onChange={(e) => setFormData({ ...formData, ticketNumber: e.target.value })}
                required
              />

              <Input
                label="Ticket Date"
                type="date"
                value={formData.ticketDate}
                onChange={(e) => setFormData({ ...formData, ticketDate: e.target.value })}
                required
              />
            </div>

            <Input
              label="Ticket Reason"
              value={formData.ticketReason}
              onChange={(e) => setFormData({ ...formData, ticketReason: e.target.value })}
              required
            />

            <Input
              label="Your Address (Registered Keeper)"
              type="textarea"
              rows="3"
              value={formData.keeperAddress}
              onChange={(e) => setFormData({ ...formData, keeperAddress: e.target.value })}
              required
            />

            <Input
              label="Parking Company / Local Authority Address"
              type="textarea"
              rows="3"
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              required
            />

            <Input
              label="Circumstances (What happened?)"
              type="textarea"
              rows="4"
              value={formData.circumstances}
              onChange={(e) => setFormData({ ...formData, circumstances: e.target.value })}
              required
            />

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                disabled={!user}
              >
                {user ? 'Generate Dispute Letter' : 'Sign In to Continue'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}