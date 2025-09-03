// 用于计算和存储滑块值的工具函数

// 使用localStorage存储滑块值
function saveSliderValues(key, value) {
  localStorage.setItem(key, value);
}

// 获取存储的滑块值
function getSliderValue(key, defaultValue = 0) {
  const value = localStorage.getItem(key);
  return value !== null ? parseInt(value) : defaultValue;
}

// 计算汽车碳足迹
function calculateCarFootprint(distance, size, fuelType) {
  // 根据CSV数据的排放系数 (kg CO2e/km)
  let emissionFactor = 0;
  
  // 标准化燃料类型
  const normalizedFuelType = fuelType.toLowerCase();
  
  // 根据车辆大小和燃料类型设置排放系数
  if (size === 'small') {
    switch(normalizedFuelType) {
      case 'diesel':
        emissionFactor = 0.14340;
        break;
      case 'petrol':
        emissionFactor = 0.14308;
        break;
      case 'hybrid':
        emissionFactor = 0.11413;
        break;
      case 'phev':
        emissionFactor = 0.03008;
        break;
      case 'bev':
        emissionFactor = 0.00000;
        break;
      default:
        emissionFactor = 0.14308; // 默认使用小型汽油车排放
    }
  } else if (size === 'medium') {
    switch(normalizedFuelType) {
      case 'diesel':
        emissionFactor = 0.17174;
        break;
      case 'petrol':
        emissionFactor = 0.17474;
        break;
      case 'hybrid':
        emissionFactor = 0.11724;
        break;
      case 'phev':
        emissionFactor = 0.07789;
        break;
      case 'bev':
        emissionFactor = 0.00000;
        break;
      default:
        emissionFactor = 0.17474; // 默认使用中型汽油车排放
    }
  } else if (size === 'large') {
    switch(normalizedFuelType) {
      case 'diesel':
        emissionFactor = 0.21007;
        break;
      case 'petrol':
        emissionFactor = 0.26828;
        break;
      case 'hybrid':
        emissionFactor = 0.15650;
        break;
      case 'phev':
        emissionFactor = 0.10033;
        break;
      case 'bev':
        emissionFactor = 0.00000;
        break;
      default:
        emissionFactor = 0.26828; // 默认使用大型汽油车排放
    }
  } else {
    // 使用平均排放系数
    switch(normalizedFuelType) {
      case 'diesel':
        emissionFactor = 0.17304;
        break;
      case 'petrol':
        emissionFactor = 0.16272;
        break;
      case 'hybrid':
        emissionFactor = 0.12825;
        break;
      case 'phev':
        emissionFactor = 0.09167;
        break;
      case 'bev':
        emissionFactor = 0.00000;
        break;
      default:
        emissionFactor = 0.16272; // 默认使用平均汽油车排放
    }
  }
  
  // 计算总排放量 (kg CO2)
  return distance * emissionFactor;
}

// 计算摩托车碳足迹
function calculateMotorcycleFootprint(distance, size) {
  // 根据CSV数据的排放系数 (kg CO2e/km)
  let emissionFactor = 0;
  
  // 根据摩托车大小设置排放系数
  switch(size) {
    case 'small':
      emissionFactor = 0.08319; // 小型摩托车/踏板车 (125cc以下)
      break;
    case 'medium':
      emissionFactor = 0.10107; // 中型摩托车 (125cc到500cc)
      break;
    case 'large':
      emissionFactor = 0.13252; // 大型摩托车 (500cc以上)
      break;
    default:
      emissionFactor = 0.11367; // 默认使用平均摩托车排放
  }
  
  // 计算总排放量 (kg CO2)
  return distance * emissionFactor;
}

// 计算公共交通碳足迹
function calculatePublicTransportFootprint(distances) {
  // 根据CSV数据的排放系数 (kg CO2e/pkm)
  const factors = {
    lrt: 0.10449,      // 轻轨
    mrt: 0.12694,      // 地铁
    ktm: 0.18034,      // 火车
    monorail: 0.09211, // 单轨
    bus: 0.10385       // 公交车
  };
  
  // 计算总排放量 (kg CO2)
  let totalEmission = 0;
  for (const [type, distance] of Object.entries(distances)) {
    if (factors[type]) {
      totalEmission += distance * factors[type];
    }
  }
  
  // 添加其他公共交通距离
  const publicTransport1 = getSliderValue('public_transport_distance_1', 0);
  const publicTransport2 = getSliderValue('public_transport_distance_2', 0);
  
  // 使用平均公共交通排放系数 (0.12597 kg CO2e/pkm)
  if (publicTransport1 > 0) {
    totalEmission += publicTransport1 * 0.12597;
  }
  
  if (publicTransport2 > 0) {
    totalEmission += publicTransport2 * 0.12597;
  }
  
  return totalEmission;
}

// 计算总碳足迹并转换为"地球数量"
function calculateEarthsNeeded(totalEmission) {
  // 根据碳排放量计算所需地球数量
  // 全球人均碳排放量约为4.7吨CO2/年
  // 我们假设一周的碳排放量乘以52周得到年排放量
  const annualEmission = totalEmission * 52; // 从周排放转为年排放 (kg CO2)
  
  // 将kg转换为吨
  const annualEmissionTons = annualEmission / 1000;
  
  // 计算地球数量：个人年排放量 / 可持续人均排放量
  // 可持续人均排放量约为2吨CO2/年
  const earthsNeeded = annualEmissionTons / 2;
  
  // 确保至少返回1个地球
  return Math.max(1, Math.round(earthsNeeded));
}

// 计算总碳足迹
function calculateTotalFootprint() {
  // 获取汽车数据
  let carFootprint = 0;
  for (let i = 1; i <= 5; i++) { // 假设最多有5辆车
    const distance = getSliderValue(`car_distance_${i}`, 0);
    if (distance > 0) {
      const size = localStorage.getItem(`car_size_${i}`) || 'medium';
      const fuelType = localStorage.getItem(`car_fuel_${i}`) || 'petrol';
      carFootprint += calculateCarFootprint(distance, size, fuelType);
    }
  }
  
  // 获取摩托车数据
  let motorcycleFootprint = 0;
  for (let i = 1; i <= 5; i++) { // 假设最多有5辆摩托车
    const distance = getSliderValue(`motorcycle_distance_${i}`, 0);
    if (distance > 0) {
      const size = localStorage.getItem(`motorcycle_size_${i}`) || 'medium';
      motorcycleFootprint += calculateMotorcycleFootprint(distance, size);
    }
  }
  
  // 获取公共交通数据
  const publicTransportDistances = {
    lrt: getSliderValue('lrt_distance', 0),
    mrt: getSliderValue('mrt_distance', 0),
    ktm: getSliderValue('ktm_distance', 0),
    monorail: getSliderValue('monorail_distance', 0),
    bus: getSliderValue('bus_distance', 0)
  };
  const publicTransportFootprint = calculatePublicTransportFootprint(publicTransportDistances);
  
  // 计算总碳足迹
  const totalFootprint = carFootprint + motorcycleFootprint + publicTransportFootprint;
  
  // 将总碳足迹转换为"地球数量"
  const earthsNeeded = calculateEarthsNeeded(totalFootprint);
  
  // 保存结果
  localStorage.setItem('total_footprint', totalFootprint.toFixed(2));
  localStorage.setItem('earths_needed', earthsNeeded);
  
  // 保存各部分碳足迹
  localStorage.setItem('car_footprint', carFootprint.toFixed(2));
  localStorage.setItem('motorcycle_footprint', motorcycleFootprint.toFixed(2));
  localStorage.setItem('public_transport_footprint', publicTransportFootprint.toFixed(2));
  
  return {
    totalFootprint,
    earthsNeeded,
    carFootprint,
    motorcycleFootprint,
    publicTransportFootprint
  };
}

// 导出函数供其他页面使用
window.calculatorUtils = {
  saveSliderValues,
  getSliderValue,
  calculateTotalFootprint
};
