# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class com.kakao.sdk.**.model.* { <fields>; }
-keep class * extends com.google.gson.TypeAdapter

# https://github.com/square/okhttp/pull/6792
-dontwarn org.bouncycastle.jsse.**
-dontwarn org.conscrypt.*
-dontwarn org.openjsse.**

# Keep your model classes
-keep class com.gnuboard_react_native.model.** { *; }

# Axios specific rules
-keep class com.github.axioscode.** { *; }
-keepclassmembers class com.github.axioscode.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

# Keep Axios response/request classes
-keep class org.apache.commons.codec.** { *; }
-keep class org.apache.http.** { *; }
-dontwarn org.apache.**
-dontwarn android.net.http.**
-dontwarn javax.annotation.**

# General networking rules
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# React Native rules
-keep class com.facebook.react.modules.network.** { *; }
-keep class com.facebook.react.** { *; }

# Keep your app's network-related classes
-keep class com.gnuboard_react_native.** { *; }