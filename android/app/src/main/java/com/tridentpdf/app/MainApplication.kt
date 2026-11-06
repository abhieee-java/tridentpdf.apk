package com.tridentpdf.app

import android.app.Application
import android.content.res.Configuration
import android.graphics.Typeface
import android.util.Log

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.react.views.text.ReactFontManager
import com.facebook.soloader.SoLoader

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return packages
          }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
          override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }

    // Register bundled Apple/Inter sans-serif typography directly into React Native's FontManager.
    // This guarantees that all text renders in clean sans-serif and completely bypasses OEM serif theme overrides.
    try {
      val interRegular = Typeface.createFromAsset(assets, "fonts/Inter-Regular.ttf")
      val interMedium = Typeface.createFromAsset(assets, "fonts/Inter-Medium.ttf")
      val interSemiBold = Typeface.createFromAsset(assets, "fonts/Inter-SemiBold.ttf")
      val interBold = Typeface.createFromAsset(assets, "fonts/Inter-Bold.ttf")

      val fontManager = ReactFontManager.getInstance()

      // Explicit Inter font registrations
      fontManager.setTypeface("Inter-Regular", Typeface.NORMAL, interRegular)
      fontManager.setTypeface("Inter-Regular", Typeface.BOLD, interBold)
      fontManager.setTypeface("Inter-Medium", Typeface.NORMAL, interMedium)
      fontManager.setTypeface("Inter-Medium", Typeface.BOLD, interBold)
      fontManager.setTypeface("Inter-SemiBold", Typeface.NORMAL, interSemiBold)
      fontManager.setTypeface("Inter-SemiBold", Typeface.BOLD, interBold)
      fontManager.setTypeface("Inter-Bold", Typeface.NORMAL, interBold)
      fontManager.setTypeface("Inter-Bold", Typeface.BOLD, interBold)
      fontManager.setTypeface("Inter", Typeface.NORMAL, interRegular)
      fontManager.setTypeface("Inter", Typeface.BOLD, interBold)

      // Direct override of Android system font aliases to prevent ColorOS/Oppo Serif font fallback
      fontManager.setTypeface("sans-serif", Typeface.NORMAL, interRegular)
      fontManager.setTypeface("sans-serif", Typeface.BOLD, interBold)
      fontManager.setTypeface("sans-serif-medium", Typeface.NORMAL, interMedium)
      fontManager.setTypeface("sans-serif-medium", Typeface.BOLD, interBold)
      fontManager.setTypeface("sans-serif-bold", Typeface.NORMAL, interBold)
      fontManager.setTypeface("sans-serif-bold", Typeface.BOLD, interBold)
      fontManager.setTypeface("monospace", Typeface.NORMAL, interMedium)
      fontManager.setTypeface("monospace", Typeface.BOLD, interBold)

      Log.i("TridentPDF", "Successfully registered bundled Inter typography into ReactFontManager.")
    } catch (e: Exception) {
      Log.e("TridentPDF", "Failed to register bundled Inter fonts: ${e.message}", e)
    }

    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
