package com.gnuboard_react_native.naver;

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.navercorp.nid.NaverIdLoginSDK;
import com.navercorp.nid.oauth.OAuthLoginCallback;

public class NaverLoginModule extends ReactContextBaseJavaModule {

    public NaverLoginModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NaverLogin";
    }

    @ReactMethod
    public void login(final Promise promise) {
        final Context context = getCurrentActivity();
        if (context == null) {
            promise.reject("NO_ACTIVITY", "No current activity");
            return;
        }

        NaverIdLoginSDK.INSTANCE.authenticate(context, new OAuthLoginCallback() {
            @Override
            public void onSuccess() {
                String accessToken = NaverIdLoginSDK.INSTANCE.getAccessToken();
                if (accessToken != null) {
                    promise.resolve(accessToken);
                } else {
                    promise.reject("NO_TOKEN", "No access token retrieved");
                }
            }

            @Override
            public void onFailure(int httpStatus, String message) {
                promise.reject("LOGIN_FAILED", "HTTP Status: " + httpStatus + ", Message: " + message);
            }

            @Override
            public void onError(int errorCode, String message) {
                promise.reject("LOGIN_ERROR", "Error Code: " + errorCode + ", Message: " + message);
            }
        });
    }

    @ReactMethod
    public void logout() {
        NaverIdLoginSDK.INSTANCE.logout();
    }
}
