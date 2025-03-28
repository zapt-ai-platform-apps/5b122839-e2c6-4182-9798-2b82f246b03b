import React from 'react';
import { Input } from './ui/Input';

export default function FormContent({ formData, setFormData, loading, handleSubmit }) {
  return (
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
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 w-48 cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}