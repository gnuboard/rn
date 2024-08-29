object Configurations {
    const val compileSdkVersion = 33
    const val buildToolsVersion = "33.0.0"
    const val targetSdkVersion = 33
    const val minSdkVersion = 21
    const val moduleVersionName = "1.0.0"
}

plugins {
    id("com.android.library")
    `maven-publish`
    kotlin("android")
}

android {
    compileSdk = Configurations.compileSdkVersion
    buildToolsVersion = Configurations.buildToolsVersion

//    testOptions.unitTests.includeAndroidResources = true

    defaultConfig {
        targetSdk = Configurations.targetSdkVersion
        minSdk = Configurations.minSdkVersion

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        multiDexEnabled = false
        buildConfigField("String", "VERSION_NAME", "\"${Configurations.moduleVersionName}\"")
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
        }
        getByName("debug") {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }
    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(17))
        }
    }
    kotlin {
        jvmToolchain {
            (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(17))
        }
    }
    lint.abortOnError = false

    buildFeatures {
        viewBinding = true
    }
    testOptions {
        unitTests.isIncludeAndroidResources = true
    }
}

object Dependencies {
    object Kotlin {
        const val stdLib = "org.jetbrains.kotlin:kotlin-stdlib:1.8.10"
        const val coroutines = "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4"
    }

    object AndroidX {
        const val appcompat = "androidx.appcompat:appcompat:1.5.1"
        const val coreUtils = "androidx.core:core-utils:1.10.0"
        const val browser = "androidx.browser:browser:1.5.0"
        const val constraintLayout = "androidx.constraintlayout:constraintlayout:2.1.4"
        const val crypto = "androidx.security:security-crypto:1.1.0-alpha03"
        const val coreKtx = "androidx.core:core-ktx:1.10.0"
        const val fragmentKtx = "androidx.fragment:fragment-ktx:1.5.5"
        const val lifecycleViewModel = "androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.1"
    }

    object HttpClient {
        const val retrofit = "com.squareup.retrofit2:retrofit:2.9.0"
        const val converter = "com.squareup.retrofit2:converter-moshi:2.9.0"
        const val moshi = "com.squareup.moshi:moshi:1.14.0"
        const val httpInterceptor = "com.squareup.okhttp3:logging-interceptor:4.10.0"
    }

    object AirBnB {
        const val lottie = "com.airbnb.android:lottie:5.2.0"
    }

    object UnitTest {
        const val junit = "junit:junit:4.13.2"
        const val androidxTestCore = "androidx.test:core:1.4.0"
        const val androidxTestRunner = "androidx.test:runner:1.4.0"
        const val powerMockApi = "org.powermock:powermock-api-mockito2:2.0.9"
        const val powerMockJunit = "org.powermock:powermock-module-junit4:2.0.9"
        const val robolectric = "org.robolectric:robolectric:4.8.1"
        const val mockWebServer = "com.squareup.okhttp3:mockwebserver:4.10.0"
        const val mockK = "io.mockk:mockk:1.13.4"
    }
}

dependencies {

    Dependencies.Kotlin.run {
        implementation(stdLib)
        implementation(coroutines)
    }

    Dependencies.AndroidX.run {
        implementation(appcompat)
        implementation(browser)
        implementation(constraintLayout)
        implementation(crypto)
        implementation(coreKtx)
        implementation(fragmentKtx)
        implementation(lifecycleViewModel)
    }

    Dependencies.HttpClient.run {
        implementation(retrofit)
        implementation(converter)
        implementation(moshi)
        implementation(httpInterceptor)
    }

    Dependencies.AirBnB.run {
        api(lottie)
    }

    Dependencies.UnitTest.run {
        testImplementation(kotlin("test"))
        testImplementation(junit)
        testImplementation(androidxTestCore)
        testImplementation(androidxTestRunner)
        testImplementation(powerMockApi)
        testImplementation(powerMockJunit)
        testImplementation(robolectric)
        testImplementation(mockWebServer)
        testImplementation(mockK)
    }

    implementation("androidx.localbroadcastmanager:localbroadcastmanager:1.1.0")
    implementation("com.google.code.gson:gson:2.8.9")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
}

afterEvaluate {
    publishing {
        publications {
            create<MavenPublication>("release") {
                // Applies the component for the release build variant.
                from(components.getByName("release"))

                groupId = "com.navercorp.nid"
                artifactId = "oauth"
                version = Configurations.moduleVersionName

                pom {
                    licenses {
                        license {
                            name.set("Apache License, Version 2.0")
                            url.set("http://www.apache.org/licenses/LICENSE-2.0.html")
                            distribution.set("repo")
                        }
                    }

                    developers {
                        developer {
                            id.set("namhun.kim")
                            name.set("Namhoon Kim")
                            email.set("namhun.kim@navercorp.com")
                        }
                        developer {
                            id.set("dayeon.lee")
                            name.set("Dayeon Lee")
                            email.set("dayeon.lee@navercorp.com")
                        }
                    }

                    scm {
                        connection.set("scm:git@github.com:naver/naveridlogin-sdk-android.git")
                        developerConnection.set("scm:git@github.com:naver/naveridlogin-sdk-android.git")
                        url.set("https://github.com/naver/naveridlogin-sdk-android")
                    }
                }
            }
        }
    }
}