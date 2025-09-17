package com.mapproject

import android.content.Context
import android.os.BatteryManager
import android.os.PowerManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import io.mockk.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@RunWith(RobolectricTestRunner::class)
class BatteryModuleTest {

    private lateinit var batteryModule: BatteryModule
    private lateinit var mockReactContext: ReactApplicationContext
    private lateinit var mockBatteryManager: BatteryManager
    private lateinit var mockPowerManager: PowerManager

    @Before
    fun setUp() {
        mockkStatic(BatteryManager::class)
        mockkStatic(PowerManager::class)
        
        mockReactContext = mockk<ReactApplicationContext>(relaxed = true)
        mockBatteryManager = mockk<BatteryManager>(relaxed = true)
        mockPowerManager = mockk<PowerManager>(relaxed = true)
        
        every { mockReactContext.getSystemService(Context.BATTERY_SERVICE) } returns mockBatteryManager
        every { mockReactContext.getSystemService(Context.POWER_SERVICE) } returns mockPowerManager
        every { mockReactContext.packageName } returns "com.mapproject"
        
        batteryModule = BatteryModule(mockReactContext)
    }

    @Test
    fun `test getBatteryInfo returns correct battery information`() {
        // Arrange
        every { mockBatteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) } returns 75
        every { mockBatteryManager.isCharging } returns true
        every { mockPowerManager.isIgnoringBatteryOptimizations("com.mapproject") } returns false

        // Act
        val promise = mockk<com.facebook.react.bridge.Promise>(relaxed = true)
        batteryModule.getBatteryInfo(promise)

        // Assert
        verify { promise.resolve(any<WritableMap>()) }
    }

    @Test
    fun `test getBatteryInfo handles exceptions correctly`() {
        // Arrange
        every { mockBatteryManager.getIntProperty(any()) } throws RuntimeException("Battery error")

        // Act
        val promise = mockk<com.facebook.react.bridge.Promise>(relaxed = true)
        batteryModule.getBatteryInfo(promise)

        // Assert
        verify { promise.reject("BATTERY_ERROR", "Failed to get battery info", any<RuntimeException>()) }
    }

    @Test
    fun `test requestBatteryOptimizationDisable calls correct intent`() {
        // Arrange
        val mockActivity = mockk<android.app.Activity>(relaxed = true)
        every { mockReactContext.currentActivity } returns mockActivity

        // Act
        val promise = mockk<com.facebook.react.bridge.Promise>(relaxed = true)
        batteryModule.requestBatteryOptimizationDisable(promise)

        // Assert
        verify { mockActivity.startActivity(any()) }
        verify { promise.resolve(true) }
    }

    @Test
    fun `test requestBatteryOptimizationDisable handles exceptions`() {
        // Arrange
        every { mockReactContext.currentActivity } throws RuntimeException("Activity error")

        // Act
        val promise = mockk<com.facebook.react.bridge.Promise>(relaxed = true)
        batteryModule.requestBatteryOptimizationDisable(promise)

        // Assert
        verify { promise.reject("BATTERY_OPTIMIZATION_ERROR", "Failed to request battery optimization disable", any<RuntimeException>()) }
    }

    @Test
    fun `test startBatteryMonitoring registers receiver`() {
        // Act
        batteryModule.startBatteryMonitoring()

        // Assert
        verify { mockReactContext.registerReceiver(any(), any()) }
    }

    @Test
    fun `test stopBatteryMonitoring does not throw exception`() {
        // Act & Assert
        kotlin.runCatching { batteryModule.stopBatteryMonitoring() }
            .onSuccess { /* Should not throw */ }
            .onFailure { throw it }
    }

    @Test
    fun `test module name is correct`() {
        // Assert
        assertEquals("BatteryModule", batteryModule.name)
    }
}
