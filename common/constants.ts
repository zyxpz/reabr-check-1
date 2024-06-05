export const materialList = [10, 15, 20, 25, 30, 35]?.map((one, index) => {
  return {
    materialId: index + 1,
    materialName: '直螺纹钢筋',
    materialSpec: `${one}mm`,
    extCode: '',
    weighValue: 123,
    count: 0,
  };
});
