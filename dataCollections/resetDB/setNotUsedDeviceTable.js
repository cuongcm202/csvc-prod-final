const DeviceModel = mongoose.model('Device', deviceSchema);

const updateAllDevicesToNotUsed = async () => {
  try {
    const result = await DeviceModel.updateMany({}, { initStatus: 'notUsed' });
    console.log(result);
    // Kết quả sẽ hiển thị thông tin về số lượng bản ghi đã được cập nhật
  } catch (error) {
    console.error(error);
  }
};

updateAllDevicesToNotUsed();