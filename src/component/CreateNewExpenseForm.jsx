import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';

export default function ExpenseModal({
  open,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  expenseOptions,
  formatCurrency,
  formatDate
}) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        }
      }}
      BackdropProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.2)', // ✅ greenish transparent overlay
          backdropFilter: 'blur(3px)'         // optional blur effect
        }
      }}
    >
      <DialogTitle className="text-green-800 text-center">Thêm khoản chi</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Form content goes here */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block mb-1">Tên khoản chi</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Chọn khoản chi --</option>
              {expenseOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Số tiền</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            {formData.amount && !isNaN(formData.amount) && (
              <p className="text-gray-600 mt-1">{formatCurrency(formData.amount)}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Thời gian chi khoản này</label>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <DatePicker
                value={formData.usedDate}
                onChange={(newValue) => {
                  if (newValue instanceof Date && !isNaN(newValue)) {
                    setFormData(prev => ({ ...prev, usedDate: newValue }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    className: "px-4 py-2 border rounded-lg",
                    required: true
                  }
                }}
              />
            </LocalizationProvider>
            <p className="text-gray-600 mt-1">Ngày chọn: {formatDate(formData.usedDate)}</p>
          </div>

          <div>
            <label className="block mb-1">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Ghi chú thêm (nếu có)"
            />
          </div>

          <div className="flex justify-end mt-4 gap-3">
            <Button onClick={onClose} color="secondary" variant="outlined">Hủy</Button>
            <Button type="submit" color="success" variant="contained">Thêm khoản chi</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
