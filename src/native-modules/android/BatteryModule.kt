package com.personalfinanceapp

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.PowerManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BatteryModule"
    }

    @ReactMethod
    fun getBatteryInfo(promise: Promise) {
        try {
            val batteryManager = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
            
            val batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
            val isCharging = batteryManager.isCharging
            val batteryOptimizationEnabled = !powerManager.isIgnoringBatteryOptimizations(reactContext.packageName)
            
            val batteryInfo = Arguments.createMap().apply {
                putInt("level", batteryLevel)
                putBoolean("isCharging", isCharging)
                putBoolean("batteryOptimizationEnabled", batteryOptimizationEnabled)
            }
            
            promise.resolve(batteryInfo)
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", "Failed to get battery info", e)
        }
    }

    @ReactMethod
    fun requestBatteryOptimizationDisable(promise: Promise) {
        try {
            val intent = Intent().apply {
                action = PowerManager.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
                data = android.net.Uri.parse("package:${reactContext.packageName}")
            }
            
            reactContext.currentActivity?.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BATTERY_OPTIMIZATION_ERROR", "Failed to request battery optimization disable", e)
        }
    }

    @ReactMethod
    fun startBatteryMonitoring() {
        val batteryReceiver = object : android.content.BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent?.action == Intent.ACTION_BATTERY_CHANGED) {
                    val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                    val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                    val batteryPct = (level * 100 / scale.toFloat()).toInt()
                    val isCharging = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1) == BatteryManager.BATTERY_STATUS_CHARGING
                    
                    val batteryData = Arguments.createMap().apply {
                        putInt("level", batteryPct)
                        putBoolean("isCharging", isCharging)
                    }
                    
                    sendEvent("batteryChanged", batteryData)
                }
            }
        }
        
        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        reactContext.registerReceiver(batteryReceiver, filter)
    }

    @ReactMethod
    fun stopBatteryMonitoring() {
        // Unregister receivers if needed
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
