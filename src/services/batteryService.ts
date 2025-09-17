import { NativeModules, NativeEventEmitter } from 'react-native';

const { BatteryModule } = NativeModules;

export interface BatteryInfo {
  level: number;
  isCharging: boolean;
  batteryOptimizationEnabled: boolean;
}

class BatteryService {
  private eventEmitter: NativeEventEmitter;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(BatteryModule);
  }

  async getBatteryInfo(): Promise<BatteryInfo> {
    try {
      return await BatteryModule.getBatteryInfo();
    } catch (error) {
      console.error('Error getting battery info:', error);
      throw error;
    }
  }

  async requestBatteryOptimizationDisable(): Promise<boolean> {
    try {
      return await BatteryModule.requestBatteryOptimizationDisable();
    } catch (error) {
      console.error('Error requesting battery optimization disable:', error);
      throw error;
    }
  }

  startBatteryMonitoring(): void {
    try {
      BatteryModule.startBatteryMonitoring();
    } catch (error) {
      console.error('Error starting battery monitoring:', error);
    }
  }

  stopBatteryMonitoring(): void {
    try {
      BatteryModule.stopBatteryMonitoring();
    } catch (error) {
      console.error('Error stopping battery monitoring:', error);
    }
  }

  addBatteryChangeListener(callback: (batteryInfo: BatteryInfo) => void): () => void {
    const subscription = this.eventEmitter.addListener('batteryChanged', callback);
    return () => subscription.remove();
  }

  async checkBatteryOptimization(): Promise<boolean> {
    try {
      const batteryInfo = await this.getBatteryInfo();
      return batteryInfo.batteryOptimizationEnabled;
    } catch (error) {
      console.error('Error checking battery optimization:', error);
      return false;
    }
  }

  async handleLowBattery(): Promise<void> {
    try {
      const batteryInfo = await this.getBatteryInfo();
      
      if (batteryInfo.level < 20 && !batteryInfo.isCharging) {
        console.warn('Low battery detected:', batteryInfo.level);
        // You can implement specific low battery handling here
        // For example, reduce background sync frequency, show warning, etc.
      }
    } catch (error) {
      console.error('Error handling low battery:', error);
    }
  }
}

export const batteryService = new BatteryService();
