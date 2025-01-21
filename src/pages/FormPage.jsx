import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useFormHandling } from '../hooks/useFormHandling';

export default function FormPage() {
  const { formData, setFormData, loading, handleSubmit } = useFormHandling();

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Parking Ticket Details</h2>
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
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full md:w-auto disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner className="h-6 w-6 mx-auto" />
                ) : (
                  'Generate Dispute Letter'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}